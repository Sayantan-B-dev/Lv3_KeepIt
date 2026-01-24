import User from "../models/user.model.js";
import passport from "passport";
import { cloudinary, storage } from '../utils/cloudinary.util.js';
import multer from 'multer';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

export const upload = multer({ storage });

export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        res.json({
            url: req.file.path,
            public_id: req.file.filename,
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};


export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentCount = await User.countDocuments({
            registrationIp: ip,
            createdAt: { $gte: since }
        });
        const userLimit = 5;
        if (recentCount >= userLimit) {
            return res.status(429).json({ error: `Registration limit reached: Only ${userLimit} accounts per day allowed from this IP.` });
        }
        const user = new User({ username, email, registrationIp: ip });

        if (req.file) {
            user.profileImage = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        const registeredUser = await User.register(user, password);

        // Explicitly log in the user after registration
        req.logIn(registeredUser, function (err) {
            if (err) {
                req.flash("error", err.message);
                return res.status(400).json({ error: err.message });
            }
            req.flash("success", 'Welcome to Notes App');
            return res.status(201).json({
                message: "Registered successfully",
                user: {
                    _id: registeredUser._id,
                    username: registeredUser.username,
                    email: registeredUser.email,
                    profileImage: registeredUser.profileImage
                }
            });
        });
    } catch (e) {
        req.flash("error", e.message);
        res.status(400).json({ error: e.message });
    }
};

export const loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ message: info?.message || "Invalid credentials" });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            // console.log("✅ req.user after login:", req.user);
            // console.log("✅ req.sessionID after login:", req.sessionID);
            // console.log("✅ Session content:", req.session);

            req.flash('success', 'welcome back');
            return res.status(200).json({
                message: req.flash("success")[0] || "Logged in successfully",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage
                }
            });
        });
    })(req, res, next);
};

export const postLogin = (req, res) => {
    req.flash('success', 'welcome back');
    res.status(200).json({
        message: 'logged in successfully',
        user: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            profileImage: req.user.profileImage
        }
    });
};

export const logoutUser = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'logged out successfully');
        req.session.destroy((err) => {
            if (err) return next(err);
            Object.keys(req.cookies || {}).forEach(cookieName => {
                if (cookieName.startsWith('__cf') || cookieName === 'connect.sid') {
                    res.clearCookie(cookieName);
                }
            });
            res.status(200).json({ message: 'logged out successfully' });
        });
    });
};

export const checkAuth = (req, res) => {
    //     console.log("🔍 checkAuth: req.user =", req.user);
    //   console.log("🔍 checkAuth: session ID =", req.sessionID);
    if (req.isAuthenticated()) {
        res.status(200).json({
            authenticated: true,
            user: {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                profileImage: req.user.profileImage
            }

        });
    } else {
        // Return 200 instead of 401 to avoid console errors
        res.status(200).json({ authenticated: false });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username email profileImage');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Email could not be sent" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Token expires in 10 minutes
        user.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message,
            });

            res.status(200).json({ success: true, data: "Email Sent" });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return res.status(500).json({ error: "Email could not be sent" });
        }
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid Reset Token" });
        }

        user.setPassword(req.body.password, async (err) => {
            if (err) return next(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(201).json({
                success: true,
                data: "Password Reset Success",
            });
        });

    } catch (err) {
        next(err);
    }
};
