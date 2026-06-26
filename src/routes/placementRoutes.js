import express from "express";
import {
  createPlacement,
  deletePlacement,
  getAdminPlacements,
  getPlacements,
  updatePlacement,
} from "../controllers/placementController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getPlacements);
router.get("/admin/all", protectAdmin, getAdminPlacements);

router.post("/", protectAdmin, upload.single("image"), createPlacement);
router.put("/:id", protectAdmin, upload.single("image"), updatePlacement);
router.delete("/:id", protectAdmin, deletePlacement);

export default router;