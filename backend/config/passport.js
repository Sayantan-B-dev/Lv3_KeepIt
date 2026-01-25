import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

// 1. Custom Local Strategy (Username OR Email)
// We override the default authentication behavior of passport-local-mongoose
passport.use(new LocalStrategy({
    usernameField: 'username', // Frontend sends 'username', but it could be email
    passwordField: 'password'
}, async (usernameOrEmail, password, done) => {
    try {
        // Find user by username OR email
        const user = await User.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });

        if (!user) {
            return done(null, false, { message: 'Incorrect username or email.' });
        }

        // Verify password using the method provided by passport-local-mongoose
        // authenticate() returns a promise if no args are passed, or accepts a callback.
        // But since we have the user instance, we can use the model's authenticate method if exposed,
        // OR better yet, since PLM adds authenticate() to the *model* (static), we might need to use that differently.
        // Actually PLM instance method for verify is `user.authenticate(password, cb)`? 
        // No, PLM documentation says: user.authenticate(password, function(err, thisModel, passwordErr) {...})

        user.authenticate(password, (err, user, passwordError) => {
            if (err) return done(err);
            if (passwordError) return done(null, false, { message: 'Incorrect password.' });
            if (!user) return done(null, false, { message: 'Incorrect credentials.' });
            return done(null, user);
        });

    } catch (err) {
        return done(err);
    }
}));

// 2. Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // 1. Check if user exists by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user);
        }

        // 2. Check if user exists by Email (to link accounts)
        // Google profile emails are in profile.emails array
        const googleEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (googleEmail) {
            user = await User.findOne({ email: googleEmail });
            if (user) {
                // Link Google ID to existing user
                user.googleId = profile.id;
                // Optionally update profile image if empty
                // if (!user.profileImage || !user.profileImage.url) ...
                await user.save();
                return done(null, user);
            }
        }

        // 3. Create new user
        // Generate a username from display name or email
        let baseUsername = profile.displayName.replace(/\s+/g, '').toLowerCase();
        // Ensure username length constraints (min 3)
        if (baseUsername.length < 3) baseUsername = "user" + baseUsername;

        // We need to ensure username uniqueness logic or let Mongo throw error and retry?
        // Simple strategy: check existence, if exists, append random
        let newUsername = baseUsername;
        let counter = 1;
        while (await User.exists({ username: newUsername })) {
            newUsername = baseUsername + Math.floor(Math.random() * 10000);
            counter++;
        }

        // Fallback profile image
        const profileImage = {
            url: profile.photos && profile.photos[0] ? profile.photos[0].value : "https://res.cloudinary.com/demo/image/upload/v1585668962/placeholder_image.png",
            filename: "google-oauth"
        };

        const newUser = new User({
            username: newUsername,
            email: googleEmail,
            googleId: profile.id,
            profileImage: profileImage,
            isVerified: true // Google emails are verified
        });

        await newUser.save();
        return done(null, newUser);

    } catch (err) {
        return done(err);
    }
}));

// Serialize/Deserialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export default passport;
