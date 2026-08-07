import express from "express";
import cors from "cors";

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

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

const app = express();

/**
 * Allowed Origins
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://it-sparks-frontend.vercel.app",
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman, curl, mobile apps
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS Policy Error: ${origin} not allowed`)
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("IT Sparks Technologies Backend Server Running");
});

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

app.use(notFound);
app.use(errorHandler);

export default app;