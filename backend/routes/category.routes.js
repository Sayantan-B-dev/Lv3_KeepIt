import express from "express";
import { isLoggedIn } from "../middlewares/isAuthenticated.middleware.js";
import User from "../models/user.model.js";

import {
  getUserCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getPublicCategoryById
} from "../controllers/category.controller.js";

const router = express.Router();

/* ================= User categories ================= */

router.get("/", isLoggedIn, getUserCategories);
router.get("/:id", isLoggedIn, getCategoryById);
router.get("/:id/public", getPublicCategoryById);


/* ================= Mutations ================= */

router.post("/", isLoggedIn, createCategory);
router.put("/:id", isLoggedIn, updateCategory);
router.delete("/:id", isLoggedIn, deleteCategory);

export default router;
