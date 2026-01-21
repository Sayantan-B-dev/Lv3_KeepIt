// routes/categoryTypeRoutes.js
import express from "express";
import {
  getMyCategoryTypes,
  createCategoryType,
  deleteCategoryType,
  getCategoriesByCategoryType
} from "../controllers/categoryTypeController.js";
import { isLoggedIn } from "../middlewares/isAuthenticated.js";
import { aiModeration } from "../middlewares/aiModeration.js";

const router = express.Router();

// My category types
router.get("/my", isLoggedIn, getMyCategoryTypes);

// Create
router.post("/", isLoggedIn, aiModeration, createCategoryType);

// Delete
router.delete("/:id", isLoggedIn, deleteCategoryType);

// Get categories under a category type (public / own)
router.get("/:id/categories", isLoggedIn, getCategoriesByCategoryType);

export default router;
