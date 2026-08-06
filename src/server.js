import dotenv from "dotenv";
import cors from "cors";

import app from "./app.js";
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();
connectCloudinary();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://it-sparks-frontend.vercel.app", // <-- your actual frontend URL
    ],
    credentials: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});