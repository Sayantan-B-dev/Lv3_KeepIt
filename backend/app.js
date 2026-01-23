import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import methodOverride from "method-override";
import sanitize from "mongo-sanitize";
import dotenv from "dotenv";

import User from "./models/user.model.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import noteRoutes from "./routes/note.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import globalRoutes from "./routes/global.routes.js";
import categoryTypeRoutes from "./routes/categoryType.routes.js";

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === "production";

/* ======================================================
   1. FAST, ISOLATED HEALTH CHECK (NO MIDDLEWARE)
====================================================== */
app.get("/api/health", (req, res) => {
  res.sendStatus(200);
});

/* ======================================================
   2. LIGHTWEIGHT GLOBAL MIDDLEWARE (STATELESS)
====================================================== */
app.use(compression());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = process.env.FRONTEND_URL?.replace(/\/$/, "");
      const incoming = origin.replace(/\/$/, "");
      if (incoming === allowed) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  req.body = sanitize(req.body);
  req.params = sanitize(req.params);
  next();
});

/* ======================================================
   3. SECURITY HEADERS (NO SESSION DEPENDENCY)
====================================================== */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* ======================================================
   4. SESSION + PASSPORT (SCOPED, NOT GLOBAL)
====================================================== */
if (isProduction) {
  app.set("trust proxy", 1);
}

const sessionStore = MongoStore.create({
  mongoUrl: process.env.DATABASE_URL,
  touchAfter: 24 * 60 * 60,
});

const sessionConfig = {
  store: sessionStore,
  name: "connect.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
};

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ======================================================
   5. AUTH / SESSION ROUTER (ONLY WHERE NEEDED)
====================================================== */
const sessionRouter = express.Router();

sessionRouter.use(session(sessionConfig));
sessionRouter.use(passport.initialize());
sessionRouter.use(passport.session());

/* ======================================================
   6. RATE LIMITING (LOGIN ONLY)
====================================================== */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

/* ======================================================
   7. ROUTES
====================================================== */

// Auth (session-based)
sessionRouter.use("/auth/login", loginLimiter, authRoutes);
sessionRouter.use("/auth", authRoutes);

// Protected session routes
sessionRouter.use("/profile", profileRoutes);
sessionRouter.use("/notes", noteRoutes);
sessionRouter.use("/categories", categoryRoutes);

// Public / low-cost routes
app.use("/api/global", globalRoutes);
app.use("/api/category-types", categoryTypeRoutes);

// Mount sessioned API
app.use("/api", sessionRouter);

/* ======================================================
   8. ERROR HANDLER (LAST)
====================================================== */
app.use(errorHandler);

export default app;
