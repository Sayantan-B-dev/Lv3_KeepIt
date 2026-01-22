import express from "express";
import rateLimit from "express-rate-limit";
import { validateBody } from "../middlewares/validate.js";
import { noteSchema, categorySchema } from "../validators/auth.js";
import { isLoggedIn } from "../middlewares/isAuthenticated.js";
import { aiModeration } from "../middlewares/aiModeration.js";

import {
  getNotesById,
  getCategoryNotes,
  getPublicNotesbyUser,
  getAllPublicNotes,
  getNotesByTag,
  getAllTags,
  getMyNotesPaginated,
  getMyTags,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

/* ================= Rate limit ================= */

const noteLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
});

/* ================= Public ================= */

router.get("/public/all", getAllPublicNotes);
router.get("/public/:userId", isLoggedIn, getPublicNotesbyUser);
router.get("/tags", getAllTags);
router.get("/", getNotesByTag);

/* ================= User ================= */

router.get("/my", isLoggedIn, getMyNotesPaginated);
router.get("/my-tags", isLoggedIn, getMyTags);

/* ================= Category notes (PAGINATED) ================= */

router.get(
  "/category/:id",
  isLoggedIn,
  getCategoryNotes
);

/* ================= Single note ================= */

router.get("/:id", isLoggedIn, getNotesById);

/* ================= Create / Update ================= */

router.post(
  "/",
  noteLimiter,
  isLoggedIn,
  validateBody(noteSchema),
  aiModeration,
  createNote
);

router.put(
  "/:id",
  isLoggedIn,
  validateBody(noteSchema || categorySchema),
  aiModeration,
  updateNote
);

/* ================= Delete ================= */

router.delete("/:id", isLoggedIn, deleteNote);

export default router;
