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
import { validateBody } from "../middlewares/validate.js";
import { registerSchema,profileImageSchema } from "../validators/auth.js";
import helmet from "helmet";

const router=express.Router()

router.post('/register',upload.single('profileImage'),validateBody(registerSchema),registerUser)

router.route('/login').post(loginUser,postLogin)
router.route('/logout').post(logoutUser)
router.route('/check').get(checkAuth)
router.route('/users').get(getAllUsers)
router.route('/upload-profile-image').post(upload.single('image'), validateBody(profileImageSchema), uploadProfileImage)

//router.route('/my-profile').get(myProfile)

// Enable all default helmet protections
router.use(helmet());

// Custom Content Security Policy
router.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            workerSrc: ["'self'", "blob:"],
            connectSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'"],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/",
                "https://api.maptiler.com/",
            ],
        },
    })
);

export default router