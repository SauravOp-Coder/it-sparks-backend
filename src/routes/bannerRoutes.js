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

const bannerUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "mobileImage", maxCount: 1 },
]);

router.get("/", getBanners);
router.get("/page/:page", getBannersByPage);
router.get("/admin/all", protectAdmin, getAdminBanners);

router.post("/", protectAdmin, bannerUpload, createBanner);
router.put("/:id", protectAdmin, bannerUpload, updateBanner);
router.delete("/:id", protectAdmin, deleteBanner);

export default router;