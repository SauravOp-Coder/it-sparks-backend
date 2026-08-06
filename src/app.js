import express from "express";
import cors from "cors";
import path from "path";

import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import placementRoutes from "./routes/placementRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://it-sparks-frontend.vercel.app",
];

// 1. CORS Setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// 2. Disable Browser Cache for API Routes
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

// 3. Body Parsing with Higher Limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 4. Static Uploads Folder
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// 5. Health Check
app.get("/", (req, res) => {
  res.send("IT Sparks Technologies Backend Server Running");
});

// 6. API Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/banners", bannerRoutes);

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// 7. Error Middleware (MUST ALWAYS BE LAST)
app.use(notFound);
app.use(errorHandler);

export default app;