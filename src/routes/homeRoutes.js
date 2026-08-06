import express from "express";
import {
  getHomeContent,
  updateHomeContent,
} from "../controllers/homeController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getHomeContent);
router.put("/", protectAdmin, upload.single("heroImage"), updateHomeContent);

export default router;