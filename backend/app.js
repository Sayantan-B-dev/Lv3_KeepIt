import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import flash from "connect-flash"
import methodOverride from "method-override"
import sanitize from 'mongo-sanitize';
import helmet from "helmet"
import cors from "cors";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express()

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
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
        maxAge: 1000 * 60 * 60 * 24 * 7,
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

// Import routes
import authRoutes from "./routes/auth.js";
import categoryRoutes from './routes/category.js';
import noteRoutes from './routes/note.js';
import profileRoutes from './routes/profile.js';

// Use routes
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notes', noteRoutes);

export default app;