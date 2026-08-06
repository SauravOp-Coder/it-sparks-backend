import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js"; // Updated database import
import { connectCloudinary } from "./config/cloudinary.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize connections
connectDB();
connectCloudinary();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});