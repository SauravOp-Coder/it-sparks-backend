import express from "express";
import { getAdminProfile, loginAdmin } from "../controllers/authController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/profile", protectAdmin, getAdminProfile);

export default router;