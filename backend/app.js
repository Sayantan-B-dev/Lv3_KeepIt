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

const workerSrcUrls = [
    "'self'",
    "blob:"
];//this allows the home page to run..donno why

// 🔹 Session Configuration (Before Passport)
const store = MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    touchAfter: 24 * 60 * 60,
    // Remove crypto if not using encrypted session store
    // crypto: {
    //     secret: process.env.SESSION_SECRET,
    // }
})
store.on("error", function (e) {
    console.error("Session Store error: ", e)
})

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
    app.set('trust proxy', 1); // ✅ required for secure cookies to work on Render
  }
  

const sessionConfig = {
    store,
    name: "connect.sid", // Use a consistent session cookie name
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Only save sessions when something is stored
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        sameSite: "none",
        secure: false
    }
}

if (isProduction) {
    // Trust the first proxy (Render, Vercel, etc.)
    app.set('trust proxy', 1);
}

// Main session middleware
app.use(session(sessionConfig));
app.use(flash());

// 🔹 Passport Configuration (After Session)
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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
            connectSrc: ["'self'", process.env.FRONTEND_URL],
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