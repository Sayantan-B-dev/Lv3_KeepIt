import User from "../models/user.model.js";
import passport from "passport";
import { cloudinary, storage } from '../utils/cloudinary.util.js';
import multer from 'multer';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import generateOTP from '../utils/generateOTP.js';
import jwt from "jsonwebtoken";

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

        const user = new User({
            username,
            email,
            registrationIp: ip
        });

        if (req.file) {
            user.profileImage = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        const registeredUser = await User.register(user, password);

        req.logIn(registeredUser, (err) => {
            if (err) return next(err);

            return res.status(201).json({
                message: "Registered successfully",
                user: {
                    _id: registeredUser._id,
                    username: registeredUser.username,
                    email: registeredUser.email,
                    profileImage: registeredUser.profileImage,
                    isPro: registeredUser.isPro,
                    isPremium: registeredUser.isPremium
                }
            });
        });
    } catch (e) {
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

            req.flash('success', 'welcome back');
            return res.status(200).json({
                message: req.flash("success")[0] || "Logged in successfully",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    isPro: user.isPro,
                    isPremium: user.isPremium
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
            profileImage: req.user.profileImage,
            isPro: req.user.isPro,
            isPremium: req.user.isPremium
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
                profileImage: req.user.profileImage,
                isPro: req.user.isPro,
                isPremium: req.user.isPremium
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
                html: message,
                text: `Please use this link to reset your password: ${resetUrl}`,
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

export const requestProUpgrade = async (req, res) => {
    try {
        const { reason } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Generate 24h approval token
        const token = jwt.sign(
            { userId: user._id },
            process.env.SESSION_SECRET,
            { expiresIn: "24h" }
        );

        const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
        const approvalUrl = `${baseUrl}/api/auth/pro-upgrade-confirm/${token}`;

        const adminMessage = `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #d97706;">Pro Access Request</h2>
                <p>A user is requesting Pro access to the <strong>KeepIt Notes Archive</strong>.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p><strong>User:</strong> ${user.username} (${user.email})</p>
                <p><strong>Reason:</strong> ${reason}</p>
                <div style="margin-top: 30px;">
                    <a href="${approvalUrl}" 
                       style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                       GRANT ACCESS
                    </a>
                </div>
                <p style="font-size: 12px; color: #666; margin-top: 40px;">
                    This link will expire in 24 hours. If you did not expect this request, please ignore it.
                </p>
            </div>
        `;

        await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `Pro Request: ${user.username}`,
            text: adminMessage,
        });

        res.json({ message: "Upgrade request sent to administrator." });

    } catch (error) {
        console.error("Pro request error:", error);
        res.status(500).json({ error: "Failed to send upgrade request" });
    }
};

export const confirmProUpgrade = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        const { userId } = decoded;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (user.isPro) {
            return res.status(400).send("User is already a Pro member");
        }

        user.isPro = true;
        await user.save();

        // Send confirmation email to user
        const userMessage = `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #d97706;">Welcome to KeepIt Pro!</h2>
                <p>Hello <strong>${user.username}</strong>,</p>
                <p>Your request for Pro access has been <strong>approved</strong> by the administrator.</p>
                <p>You now have access to all premium features, including ZIP exports, bulk tagging, and increased upload limits.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p>Enjoy your newly unlocked productivity tools!</p>
                <div style="margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL}" 
                       style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                       GO TO DASHBOARD
                    </a>
                </div>
            </div>
        `;

        await sendEmail({
            to: user.email,
            subject: "Your KeepIt Pro Access is Granted!",
            text: userMessage,
        });

        // Redirect back to frontend
        res.redirect(`${process.env.FRONTEND_URL}/profile/MyProfile?pro=success`);

    } catch (error) {
        console.error("Pro confirmation error:", error);
        if (error.name === "TokenExpiredError") {
            return res.status(400).send("Approval link has expired (24h limit). Please ask the user to request again.");
        }
        res.status(400).send("Invalid or corrupted approval link.");
    }
};
