import express from 'express'
import{
    getUserCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js'
import {isLoggedIn} from '../middlewares/isAuthenticated.js'

const router=express.Router()

router.get('/',isLoggedIn,getUserCategories)
router.post('/',isLoggedIn,createCategory)
router.put('/:id',isLoggedIn,updateCategory)
router.delete('/:id',isLoggedIn,deleteCategory)

export default router 