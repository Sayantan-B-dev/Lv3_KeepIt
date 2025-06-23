import express from "express";
import passport from "passport";

const router = express.Router();

// Route to start Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
    session: true,
  }),
  (req, res) => {
    // Successful authentication, redirect or respond as needed
    // For API, you might want to send a token or user info
    res.redirect(`${process.env.FRONTEND_URL}/`); // Or send a JSON response for SPA
  }
);

// Optional: Logout route for Google-authenticated users
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.redirect("/");
  });
});

export default router;
