import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions globally
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...", err);
  process.exit(1);
});

// Initialize database and external services before launching server
const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas first
    await connectDB();
    console.log("Database connected successfully.");

    // 2. Connect to Cloudinary
    await connectCloudinary();
    console.log("Cloudinary connected successfully.");

    // 3. Start Express app server
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections globally
    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION! 💥 Shutting down...", err);
      server.close(() => {
        process.exit(1);
      });
    });


    process.on("SIGTERM", () => {
      console.log("👋 SIGTERM RECEIVED. Shutting down gracefully...");
      server.close(() => {
        console.log("💥 Process terminated!");
      });
    });

  } catch (error) {
    console.error("Failed to initialize server startup:", error.message);
    process.exit(1);
  }
};

startServer();