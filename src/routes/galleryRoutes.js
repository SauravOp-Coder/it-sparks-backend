import express from "express";
import {
  createGalleryItem,
  deleteGalleryItem,
  getAdminGalleryItems,
  getGalleryItems,
  updateGalleryItem,
} from "../controllers/galleryController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getGalleryItems);
router.get("/admin/all", protectAdmin, getAdminGalleryItems);

router.post("/", protectAdmin, upload.single("image"), createGalleryItem);
router.put("/:id", protectAdmin, upload.single("image"), updateGalleryItem);
router.delete("/:id", protectAdmin, deleteGalleryItem);

export default router;