import express from "express";
import {
  createBanner,
  deleteBanner,
  getAdminBanners,
  getBanners,
  getBannersByPage,
  updateBanner,
} from "../controllers/bannerController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getBanners);
router.get("/page/:page", getBannersByPage);
router.get("/admin/all", protectAdmin, getAdminBanners);

router.post("/", protectAdmin, upload.single("image"), createBanner);
router.put("/:id", protectAdmin, upload.single("image"), updateBanner);
router.delete("/:id", protectAdmin, deleteBanner);

export default router;