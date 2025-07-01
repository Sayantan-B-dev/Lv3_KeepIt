import express from "express"
import {
    registerUser,
    loginUser,
    logoutUser,
    checkAuth,
    uploadProfileImage,
    getAllUsers
} from "../controllers/authController.js"
import upload from "../utils/multer.js"
import { validateBody } from "../middlewares/validate.js";
import { registerSchema,profileImageSchema } from "../validators/auth.js";

const router=express.Router()

router.post('/register',upload.single('profileImage'),validateBody(registerSchema),registerUser)

router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/check').get(checkAuth)
router.route('/users').get(getAllUsers)
router.route('/upload-profile-image').post(upload.single('image'), validateBody(profileImageSchema), uploadProfileImage)


export default router