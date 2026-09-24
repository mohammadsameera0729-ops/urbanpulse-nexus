import dotenv from "dotenv";
import mongoose from "mongoose";
import { Complaint } from "./models/Complaint";
import { resolveVijayawadaCoordinates } from "./routes/complaintRoutes";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/urbanpulse_nexus";

async function runBackfill() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, { dbName: "urbanpulse_nexus" });
    console.log("Connected to MongoDB");

    const unmappedComplaints = await Complaint.find({
      $or: [
        { latitude: { $exists: false } },
        { longitude: { $exists: false } },
        { latitude: null },
        { longitude: null },
      ],
    });

    console.log(`Found ${unmappedComplaints.length} unmapped complaints.`);

    let updatedCount = 0;
    const resolvedResults: Array<{
      id: string;
      title: string;
      location: string;
      latitude: number;
      longitude: number;
    }> = [];
    const unresolvedResults: Array<{
      id: string;
      title: string;
      location: string;
    }> = [];

    for (const complaint of unmappedComplaints) {
      console.log(`Processing: "${complaint.title}" at "${complaint.location}"...`);
      const coords = await resolveVijayawadaCoordinates(complaint.location);

      if (coords.latitude !== undefined && coords.longitude !== undefined) {
        complaint.latitude = coords.latitude;
        complaint.longitude = coords.longitude;
        await complaint.save();

        updatedCount++;
        resolvedResults.push({
          id: complaint._id.toString(),
          title: complaint.title,
          location: complaint.location,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        console.log(`-> Resolved: lat=${coords.latitude}, lng=${coords.longitude}`);
      } else {
        unresolvedResults.push({
          id: complaint._id.toString(),
          title: complaint.title,
          location: complaint.location,
        });
        console.log(`-> Could not resolve coordinates for location: "${complaint.location}"`);
      }

      // 1 sec pause to adhere to OSM Nominatim rate limits if multiple candidates exist
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("\n================ BACKFILL SUMMARY ================");
    console.log(`Total Unmapped Processed: ${unmappedComplaints.length}`);
    console.log(`Successfully Updated: ${updatedCount}`);
    console.log(`Failed / Unresolved: ${unresolvedResults.length}`);

    if (resolvedResults.length > 0) {
      console.log("\n--- RESOLVED COMPLAINTS ---");
      for (const res of resolvedResults) {
        console.log(`Title: "${res.title}"`);
        console.log(`  Location: "${res.location}"`);
        console.log(`  Latitude: ${res.latitude}`);
        console.log(`  Longitude: ${res.longitude}`);
      }
    }

    if (unresolvedResults.length > 0) {
      console.log("\n--- UNRESOLVED COMPLAINTS ---");
      for (const unres of unresolvedResults) {
        console.log(`Title: "${unres.title}" | Location: "${unres.location}"`);
      }
    }
    console.log("==================================================\n");

  } catch (error) {
    console.error("Error during coordinate backfill:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

runBackfill();
