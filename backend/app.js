import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import LocalStrategy from "passport-local"
import flash from "connect-flash"
import methodOverride from "method-override"
import sanitize from 'mongo-sanitize';
import helmet from "helmet"
import cors from "cors";
import dotenv from 'dotenv';
import User from "./models/user.js"

// Load environment variables
dotenv.config();

const app = express()

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// Sanitize middleware
app.use((req, res, next) => {
    req.body = sanitize(req.body);
    req.params = sanitize(req.params);
    next();
});

/*
 * Why does the app crash if I delete the first session/flash/passport block,
 * even though there is a "duplicate" block later?
 *
 * The answer is: order matters for Express middlewares, especially for session and passport.
 * 
 * The first block:
 *   app.use(session(...))
 *   app.use(flash())
 *   app.use(passport.initialize())
 *   app.use(passport.session())
 *   app.use((req, res, next) => { ... })
 * 
 * is NOT a duplicate of the later block, because:
 *   - The first block uses a different session config (shorter maxAge, no crypto, etc).
 *   - The later block creates a new store and session config, and re-applies session, flash, etc.
 * 
 * If you delete the first block, then the helmet.contentSecurityPolicy middleware (and any other middleware before the second session block)
 * will run BEFORE session and passport are initialized, so req.session and req.user will NOT be available to those middlewares.
 * 
 * In particular, if any middleware or route before the second session block tries to access req.session, req.user, or req.flash, it will crash.
 * 
 * The correct way is to have only ONE session/flash/passport block, with the correct config, and to ensure it is applied BEFORE any middleware that needs session/flash/passport.
 * 
 * So, you should remove the FIRST session/flash/passport block, and move the helmet.contentSecurityPolicy and everything else AFTER the session/flash/passport block.
 * 
 * For now, to answer your question: deleting the first block causes a crash because the helmet middleware (and any others before the second session block)
 * will not have access to req.session, req.user, or req.flash, which they may expect.
 */

// --- REMOVE THIS BLOCK (the "first" session/flash/passport block) ---
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your-secret-key',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//         mongoUrl: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/myapp',
//         touchAfter: 24 * 3600,
//     }),
//     cookie: {
//         httpOnly: true,
//         maxAge: 1000 * 60 * 60 * 24 * 30,
//     }
// }));
// app.use(flash());

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // Flash messages middleware
// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// });
// --- END REMOVE ---

const workerSrcUrls = [
    "'self'",
    "blob:"
];//this allows the home page to run..donno why

// 🔹 Session Configuration (Before Passport)
const store = MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SESSION_SECRET,
    }
})
store.on("error", function (e) {
    console.log("Session Store error: ", e)
})
const sessionConfig = {
    store,
    name: `__cf${Math.floor(Math.random() * 1000000000)}`,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

// 🔹 Passport Configuration (After Session)
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()) //how to store in session
passport.deserializeUser(User.deserializeUser()) //how to un-store in session

// 🔹 Flash Messages Middleware (After Passport)
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Helmet CSP should come AFTER session/flash/passport
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            workerSrc: workerSrcUrls,
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

// Import routes
import authRoutes from "./routes/auth.js";
import categoryRoutes from './routes/category.js';
import noteRoutes from './routes/note.js';
import profileRoutes from './routes/profile.js';
import globalRoutes from './routes/globalRoutes.js';
// Use routes
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/global', globalRoutes);

export default app;