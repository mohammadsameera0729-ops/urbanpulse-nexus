import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/urbanpulse_nexus";

const seedUsers = [
  {
    username: "citizen",
    email: "citizen@urbanpulse.com",
    password: process.env.SEED_CITIZEN_PASSWORD || "Citizen@12345",
    fullName: "Citizen User",
    role: "citizen" as const,
    isActive: true,
  },

  {
    username: "admin",
    email: "admin@urbanpulse.com",
    password: process.env.SEED_ADMIN_PASSWORD || "password123",
    fullName: "Samreen Mohmmad",
    role: "admin" as const,
    isActive: true,
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGODB_URI, { dbName: "urbanpulse_nexus" });
    console.log("Connected to MongoDB");

    for (const seedUser of seedUsers) {
      const existingUser = await User.findOne({ email: seedUser.email });

      if (existingUser) {
        console.log(`User already exists (left untouched): ${seedUser.email}`);
      } else {
        const hashedPassword = await bcrypt.hash(seedUser.password, 10);
        await User.create({
          ...seedUser,
          password: hashedPassword,
        });
        console.log(`Created test user: ${seedUser.email} (${seedUser.role})`);
      }
    }

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
