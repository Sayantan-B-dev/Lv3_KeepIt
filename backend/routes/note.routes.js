import express from "express";
import rateLimit from "express-rate-limit";
import { validateBody } from "../middlewares/validate.middleware.js";
import { noteSchema, categorySchema } from "../validators/auth.validator.js";
import { isLoggedIn } from "../middlewares/isAuthenticated.middleware.js";

import {
  getNotesById,
  getCategoryNotes,
  getPublicNotesbyUser,
  getRandomPublicNotes,
  getAllPublicNotes,
  getNotesByTag,
  getAllTags,
  getMyNotesPaginated,
  getMyTags,
  createNote,
  updateNote,
  deleteNote,
  getPublicCategoryNotes,
  bulkAddTags,
  bulkDeleteNotes,
  downloadCategoryZip
} from "../controllers/note.controller.js";
 
const router = express.Router();

/* ================= Rate limit ================= */

const noteLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1000, // Increased to support bulk uploads (over 500 files)
});

/* ================= Public ================= */

router.get("/public/all", getAllPublicNotes);
router.get("/public/random", getRandomPublicNotes);
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
router.get(
  "/category/:id/public",
  getPublicCategoryNotes
);

router.get(
  "/category/:id/download",
  isLoggedIn,
  downloadCategoryZip
);
/* ================= Create / Update ================= */

router.post(
  "/bulk-tag",
  isLoggedIn,
  bulkAddTags
);

router.post(
  "/bulk-delete",
  isLoggedIn,
  bulkDeleteNotes
);

router.post(
  "/",
  noteLimiter,
  isLoggedIn,
  validateBody(noteSchema),
  createNote
);

router.put(
  "/:id",
  isLoggedIn,
  validateBody(noteSchema || categorySchema),
  updateNote
);

/* ================= Delete ================= */

router.delete("/:id", isLoggedIn, deleteNote);

export default router;
