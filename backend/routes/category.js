import express from 'express'
import{
    getUserCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
} from '../controllers/categoryController.js'
import {isLoggedIn} from '../middlewares/isAuthenticated.js'

const router=express.Router()

router.get('/',isLoggedIn,getUserCategories)
router.get('/:id', isLoggedIn, getCategoryById);

router.post('/',isLoggedIn,createCategory)
router.put('/:id',isLoggedIn,updateCategory)
router.delete('/:id',isLoggedIn,deleteCategory)

export default router 