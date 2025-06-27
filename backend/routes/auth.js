import express from "express"
import {
    registerUser,
    loginUser,
    postLogin,
    logoutUser,
    checkAuth,
    uploadProfileImage,
    getAllUsers
    
} from "../controllers/authController.js"
import upload from "../utils/multer.js"





const router=express.Router()

router.post('/register',upload.single('profileImage'),registerUser)

router.route('/login').post(loginUser,postLogin)
router.route('/logout').get(logoutUser)
router.route('/check').get(checkAuth)
router.route('/users').get(getAllUsers)
router.route('/upload-profile-image').post(upload.single('image'), uploadProfileImage)

//router.route('/my-profile').get(myProfile)


export default router