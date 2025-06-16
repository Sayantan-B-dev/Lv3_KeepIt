import express from "express"
import {
    registerUser,
    loginUser,
    postLogin,
    logoutUser
} from "../controllers/authController.js"

const router=express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser,postLogin)
router.post('/logout',logoutUser)

export default router