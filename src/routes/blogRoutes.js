import express from "express";
import {
  createBlog,
  deleteBlog,
  getAdminBlogs,
  getBlogs,
  getSingleBlog,
  updateBlog,
} from "../controllers/blogController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/admin/all", protectAdmin, getAdminBlogs);
router.get("/:id", getSingleBlog);

router.post("/", protectAdmin, upload.single("image"), createBlog);
router.put("/:id", protectAdmin, upload.single("image"), updateBlog);
router.delete("/:id", protectAdmin, deleteBlog);

export default router;