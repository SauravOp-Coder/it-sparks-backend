import express from "express";
import {
  createEnquiry,
  deleteEnquiry,
  getAdminEnquiries,
  updateEnquiryStatus,
} from "../controllers/enquiryController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createEnquiry);
router.get("/admin/all", protectAdmin, getAdminEnquiries);
router.put("/:id/status", protectAdmin, updateEnquiryStatus);
router.delete("/:id", protectAdmin, deleteEnquiry);

export default router;