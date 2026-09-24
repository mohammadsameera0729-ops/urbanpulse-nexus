import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI as string;

const startServer = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "urbanpulse_nexus",
        });

        console.log("✅ MongoDB connected successfully to database: urbanpulse_nexus");

        app.listen(PORT, () => {
            console.log(`🚦 UrbanPulse Nexus Backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};

startServer();