// routes/categoryType.routes.js
import express from "express";
import {
  getMyCategoryTypes,
  createCategoryType,
  deleteCategoryType,
  getCategoriesByCategoryType,
  getPublicCategoriesByCategoryType
} from "../controllers/categoryType.controller.js";
import { isLoggedIn } from "../middlewares/isAuthenticated.middleware.js";

const router = express.Router();

// My category types
router.get("/my-category-types", isLoggedIn, getMyCategoryTypes);

// Create
router.post("/", isLoggedIn, createCategoryType);

// Delete
router.delete("/:id", isLoggedIn, deleteCategoryType);

// Get categories under a category type (public / own)
router.get("/:id/categories", isLoggedIn, getCategoriesByCategoryType);
router.get("/:id/public/categories", getPublicCategoriesByCategoryType);

export default router;
