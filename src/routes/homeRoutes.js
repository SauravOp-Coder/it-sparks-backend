import express from "express";
import {
  getHomeContent,
  updateHomeContent,
} from "../controllers/homeController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/home - Fetch home page data
router.get("/", getHomeContent);

// PUT /api/home - Save/update home page content (JSON payload)
router.put("/", protectAdmin, updateHomeContent);

export default router;