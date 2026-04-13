import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./config/passport.js";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import methodOverride from "method-override";
import sanitize from "mongo-sanitize";
import flash from "connect-flash";
import User from "./models/user.model.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import noteRoutes from "./routes/note.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import globalRoutes from "./routes/global.routes.js";
import categoryTypeRoutes from "./routes/categoryType.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

/* ======================================================
   1. FAST, ISOLATED HEALTH CHECK (NO MIDDLEWARE)
====================================================== */
app.use(
   cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.get("/api/health", (req, res) => {
  res.sendStatus(200);
});

/* ======================================================
   2. LIGHTWEIGHT GLOBAL MIDDLEWARE (STATELESS)
====================================================== */
app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
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

if (!process.env.DATABASE_URL) {
  console.warn("[warning] DATABASE_URL is not defined – session persistence will fail if no store is available.");
}

if (!process.env.SESSION_SECRET) {
  console.warn("[warning] SESSION_SECRET is not defined – sessions may be insecure or will break on every restart.");
}

const sessionStore = MongoStore.create({
  mongoUrl: process.env.DATABASE_URL,
  touchAfter: 24 * 60 * 60,
});

// Log any store errors so the problem is visible in the logs
sessionStore.on("error", (err) => {
  console.error("[session store error]", err);
});

const sessionConfig = {
  store: sessionStore,
  name: "connect.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
};

// Passport is configured in config/passport.js

/* ======================================================
   5. AUTH / SESSION ROUTER (ONLY WHERE NEEDED)
====================================================== */
const sessionRouter = express.Router();

sessionRouter.use(session(sessionConfig));
sessionRouter.use(passport.initialize());
sessionRouter.use(passport.session());
sessionRouter.use(flash());

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
// sessionRouter.use("/auth/login", loginLimiter, authRoutes);
sessionRouter.use("/auth", authRoutes);

// Protected session routes
sessionRouter.use("/profile", profileRoutes);
sessionRouter.use("/notes", noteRoutes);
sessionRouter.use("/categories", categoryRoutes);
sessionRouter.use("/category-types", categoryTypeRoutes);
sessionRouter.use("/payment", paymentRoutes);

// Public / low-cost routes
app.use("/api/global", globalRoutes);

// Mount sessioned API
app.use("/api", sessionRouter);

/* ======================================================
   8. ERROR HANDLER (LAST)
====================================================== */
app.use(errorHandler);

export default app;
