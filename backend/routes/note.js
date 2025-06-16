import express from 'express'

import {
    getUserNotes,
    getPublicNotesbyUser,
    createNote,
    updateNote,
    deleteNote
} from '../controllers/noteController.js'
import {isLoggedIn} from '../middlewares/isAuthenticated.js'

const router=express.Router()

router.get('/',isLoggedIn,getUserNotes)
router.get('/public/:userId',isLoggedIn,getPublicNotesbyUser)
router.post('/',isLoggedIn,createNote)
router.put('/:id',isLoggedIn,updateNote)
router.delete('/:id',isLoggedIn,deleteNote)


export default router