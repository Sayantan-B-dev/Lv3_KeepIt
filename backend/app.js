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
import GoogleStrategy from "passport-google-oauth20"



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

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/myapp',
        touchAfter: 24 * 3600,
    }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
    }
}));

// Flash messages
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


const workerSrcUrls = [
    "'self'",
    "blob:"
];//this allows the home page to run..donno why
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
// 🔹 Session Configuration (Before Passport
const store = MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,//the Key matters very much
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
        httpOnly: true,//to prevent from accessing the cookie from the client side
        //secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}
app.use(session(sessionConfig))
app.use(flash());

// 🔹 Passport Configuration (After Session)
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    User.authenticate(),
    async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ googleId: profile.id })
        if (!user) {
            const newUser = new User({ googleId: profile.id, username: profile.displayName, email: profile.emails[0].value })
            await newUser.save()
        }
    }));
passport.serializeUser(User.serializeUser()) //how to store in session
passport.deserializeUser(User.deserializeUser()) //how to un-store in session

// 🔹 Flash Messages Middleware (After Passport)
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Import routes
import authRoutes from "./routes/auth.js";
import categoryRoutes from './routes/category.js';
import noteRoutes from './routes/note.js';
import profileRoutes from './routes/profile.js';
import googleAuthRoutes from './routes/googleAuth.js';
import globalRoutes from './routes/globalRoutes.js';
// Use routes
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/google', googleAuthRoutes);
app.use('/api/global', globalRoutes);

export default app;