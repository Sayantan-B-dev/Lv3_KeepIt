import express from "express"
import {
    registerUser,
    loginUser,
    postLogin,
    logoutUser,
    checkAuth,
    getAllUsers
} from "../controllers/authController.js"
import upload from "../utils/multer.js"
//import { isLoggedIn } from "../middlewares/isAuthenticated.js"

const router=express.Router()

router.post('/register',upload.single('profileImage'),registerUser)
router.post('/login',loginUser,postLogin)
router.post('/logout',logoutUser)
router.get('/check',checkAuth)
router.get('/users', getAllUsers)

export default router