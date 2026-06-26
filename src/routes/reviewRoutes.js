import express from "express";
import {
  createReview,
  deleteReview,
  getAdminReviews,
  getReviews,
  updateReview,
} from "../controllers/reviewController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getReviews);
router.get("/admin/all", protectAdmin, getAdminReviews);

router.post("/", protectAdmin, upload.single("image"), createReview);
router.put("/:id", protectAdmin, upload.single("image"), updateReview);
router.delete("/:id", protectAdmin, deleteReview);

export default router;