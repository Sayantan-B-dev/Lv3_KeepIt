import express from "express"
import {
    registerUser,
    loginUser,
    postLogin,
    logoutUser
} from "../controllers/authController.js"
import upload from "../utils/multer.js"

const router=express.Router()

router.post('/register',upload.single('profileImage'),registerUser)
router.post('/login',loginUser,postLogin)
router.post('/logout',logoutUser)

export default router