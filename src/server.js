import dotenv from "dotenv";
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
      "https://itsparks.vercel.app",
    ],
    credentials: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});