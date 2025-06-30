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
    getNotesById
} from '../controllers/noteController.js'
import {isLoggedIn} from '../middlewares/isAuthenticated.js'
import { aiModeration } from '../middlewares/aiModeration.js'


const router=express.Router()

// Public routes
router.get('/public/all',getAllPublicNotes)
router.get('/public/:userId',isLoggedIn,getPublicNotesbyUser)

router.get('/',isLoggedIn,getUserNotes)
router.post('/',isLoggedIn,validateBody(noteSchema),aiModeration,createNote)

router.get('/:id', isLoggedIn, getNotesById);
router.put('/:id',isLoggedIn,validateBody(noteSchema || categorySchema),aiModeration,updateNote)
router.put('/:id/edit',isLoggedIn,validateBody(noteSchema || categorySchema),aiModeration,updateNote)
router.delete('/:id',isLoggedIn,deleteNote)



export default router