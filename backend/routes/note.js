import express from 'express'

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

const router=express.Router()

// Public routes
router.get('/public/all',getAllPublicNotes)
router.get('/',isLoggedIn,getUserNotes)
router.get('/public/:userId',isLoggedIn,getPublicNotesbyUser)
router.post('/',isLoggedIn,createNote)
router.put('/:id',isLoggedIn,updateNote)
router.delete('/:id',isLoggedIn,deleteNote)

router.get('/:id', isLoggedIn, getNotesById);


export default router