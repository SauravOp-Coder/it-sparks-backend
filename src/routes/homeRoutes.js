import express from "express";
import {
  getHomeContent,
  updateHomeContent,
} from "../controllers/homeController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get("/", getHomeContent);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.put("/", protectAdmin, updateHomeContent);

export default router;