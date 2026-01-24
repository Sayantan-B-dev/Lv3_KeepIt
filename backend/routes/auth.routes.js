import express from "express"
import {
    registerUser,
    loginUser,
    logoutUser,
    checkAuth,
    uploadProfileImage,
    getAllUsers,
    forgotPassword,
    resetPassword
} from "../controllers/auth.controller.js"
import upload from "../utils/multer.util.js"
import passport from "passport";
import { validateBody } from "../middlewares/validate.middleware.js";
import { registerSchema, profileImageSchema } from "../validators/auth.validator.js";

const router = express.Router()

router.post('/register', upload.single('profileImage'), validateBody(registerSchema), registerUser)

router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/check').get(checkAuth)
router.route('/users').get(getAllUsers)
router.route('/upload-profile-image').post(upload.single('image'), validateBody(profileImageSchema), uploadProfileImage)
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:resetToken').post(resetPassword);


router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:resetToken').post(resetPassword);

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"], prompt: "select_account" }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", failureFlash: true }),
    (req, res) => {
        // Successful authentication
        // We can redirect strictly to frontend
        // Or if we need to pass data, maybe redirect with query params?
        // But since we use session/cookies, just redirecting is fine.
        req.flash('success', 'Logged in via Google');
        res.redirect("http://localhost:5173/"); // Adjust this to env variable later
    }
);

export default router