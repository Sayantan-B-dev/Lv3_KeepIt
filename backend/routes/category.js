import express from "express";
import { isLoggedIn } from "../middlewares/isAuthenticated.js";
import { aiModeration } from "../middlewares/aiModeration.js";

import {
  getUserCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

/* ================= User categories ================= */

router.get("/", isLoggedIn, getUserCategories);
router.get("/:id", isLoggedIn, getCategoryById);

/* ================= Mutations ================= */

router.post("/", isLoggedIn, aiModeration, createCategory);
router.put("/:id", isLoggedIn, aiModeration, updateCategory);
router.delete("/:id", isLoggedIn, deleteCategory);

export default router;
