import dotenv from 'dotenv'
dotenv.config()

export function isLoggedIn(req, res, next) {
    console.log("isLoggedIn check: authenticated =", req.isAuthenticated(), "user =", req.user?._id);
    if (process.env.NODE_ENV === 'development' && process.env.DEV_ID) {
        if (!req.user) {
            req.user = {
                _id: process.env.DEV_ID,
                username: process.env.DEV_PASS || "devuser",
                email: process.env.DEV_EMAIL || "dev@example.com"
            };
        }
        return next();
    }

    // Production mode - normal authentication
    if (req.isAuthenticated()) return next()
    req.flash('error', 'You must be logged in')
    res.status(401).json({ error: 'Not Authenticated' })
}