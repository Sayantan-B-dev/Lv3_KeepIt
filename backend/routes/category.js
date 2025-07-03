import express from 'express'
import{
    getUserCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
} from '../controllers/categoryController.js'
import {isLoggedIn} from '../middlewares/isAuthenticated.js'
import { aiModeration } from '../middlewares/aiModeration.js'

const router=express.Router()

router.get('/',isLoggedIn,getUserCategories)
router.get('/:id', isLoggedIn, getCategoryById);

router.post('/',isLoggedIn,aiModeration,createCategory)
router.put('/:id',isLoggedIn,aiModeration,updateCategory)
router.delete('/:id',isLoggedIn,deleteCategory)




export default router 