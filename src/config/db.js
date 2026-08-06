import mongoose from "mongoose";
import dns from "dns";

// Force Node.js to use Google and Cloudflare DNS to bypass local DNS resolution failures
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Full MongoDB Error:");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;