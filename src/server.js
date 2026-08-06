import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
import cors from "cors";
import app from "./app.js";
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Configure CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://it-sparks-frontend.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS Error: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle uncaught exceptions globally
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...", err);
  process.exit(1);
});

// Initialize database and external services before starting server
const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDB();
    console.log("Database connected successfully.");

    // Connect to Cloudinary
    await connectCloudinary();
    console.log("Cloudinary connected successfully.");

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION! 💥 Shutting down...", err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown on Render/cloud termination
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