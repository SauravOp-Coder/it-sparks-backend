import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect Database & Services
connectDB();
connectCloudinary();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});