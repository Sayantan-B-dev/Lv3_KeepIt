import express from 'express'
import { validateBody } from '../middlewares/validate.js'
import { noteSchema,categorySchema } from '../validators/auth.js'
import {
    getUserNotes,
    getPublicNotesbyUser,
    getAllPublicNotes,
    createNote,
    updateNote,
    deleteNote,
    getNotesById,
    getNotesByTag,
    getAllTags,
    // createNoteFromMD
} from '../controllers/noteController.js'
import {isLoggedIn} from '../middlewares/isAuthenticated.js'
import { aiModeration } from '../middlewares/aiModeration.js'
import rateLimit from 'express-rate-limit';

const noteLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // limit each IP to 20 note creations per windowMs
  handler: (req, res, next, options) => {
    const retryAfter = Math.ceil((options.windowMs - (Date.now() - options.store.hits[req.ip].resetTime)) / 1000);
    res.set('Retry-After', retryAfter);
    res.status(429).json({
      error: `Too many notes created. Please try again later.`,
      retryAfterSeconds: retryAfter,
      message: `Please wait ${retryAfter} seconds before creating another note.`
    });
  }
});

const router=express.Router()

// Public routes
router.get('/public/all',getAllPublicNotes)
router.get('/public/:userId',isLoggedIn,getPublicNotesbyUser)

router.get('/', getNotesByTag)
router.post('/', noteLimiter, isLoggedIn, validateBody(noteSchema), aiModeration, createNote);
// router.post('/md', noteLimiter, isLoggedIn, validateBody(noteSchema), aiModeration, createNoteFromMD);
router.get('/tags', getAllTags)

router.get('/:id', isLoggedIn, getNotesById);
router.put('/:id',isLoggedIn,validateBody(noteSchema || categorySchema),aiModeration,updateNote)
router.put('/:id/edit',isLoggedIn,validateBody(noteSchema || categorySchema),aiModeration,updateNote)
router.delete('/:id',isLoggedIn,deleteNote)



export default router