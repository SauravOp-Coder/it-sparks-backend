import mongoose from "mongoose";
import dns from "dns";

// Safely set custom DNS servers only in non-serverless local environments
if (process.env.NODE_ENV !== "production") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (err) {
    console.warn("DNS override skipped:", err.message);
  }
}

// Global cached connection object for serverless re-use
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is missing.");
  }

  // Return existing cached connection if available (vital for Vercel)
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Prevents queries from hanging indefinitely if connection drops
      maxPoolSize: 10,       // Prevents connection pool exhaustion on Render/Vercel
      serverSelectionTimeoutMS: 10000, // Fails fast if DNS or Atlas IP access fails (10s)
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
      console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset promise so future requests can retry
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }

  return cached.conn;
};

export default connectDB;