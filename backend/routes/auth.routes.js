import express from "express"
import {
    registerUser,
    loginUser,
    logoutUser,
    checkAuth,
    uploadProfileImage,
    getAllUsers,
    forgotPassword,
    resetPassword,
    requestProUpgrade,
    confirmProUpgrade
} from "../controllers/auth.controller.js"
import upload from "../utils/multer.util.js"
import passport from "passport";
import { isLoggedIn } from "../middlewares/isAuthenticated.middleware.js";
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
router.route('/pro-upgrade-request').post(isLoggedIn, requestProUpgrade);
router.route('/pro-upgrade-confirm/:token').get(confirmProUpgrade);

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"], prompt: "select_account" }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Logged in via Google");

    req.session.save(() => {
      res.redirect(process.env.FRONTEND_URL);
    });
  }
);


export default router