import express from "express";
import { getHomeContent, updateHomeContent } from "../controllers/homeController.js";

const router = express.Router();

router.get("/", getHomeContent);
router.put("/", updateHomeContent); // Pure JSON route - no file parsing needed

export default router;