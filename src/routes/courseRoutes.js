import express from "express";
import {
  createCourse,
  deleteCourse,
  getAdminCourses,
  getCourseById,
  getCourses,
  updateCourse,
} from "../controllers/courseController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import courseUpload from "../middleware/courseUploadMiddleware.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/admin/all", protectAdmin, getAdminCourses);
router.get("/:id", getCourseById);

router.post(
  "/",
  protectAdmin,
  courseUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "brochure", maxCount: 1 },
  ]),
  createCourse
);

router.put(
  "/:id",
  protectAdmin,
  courseUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "brochure", maxCount: 1 },
  ]),
  updateCourse
);

router.delete("/:id", protectAdmin, deleteCourse);

export default router;