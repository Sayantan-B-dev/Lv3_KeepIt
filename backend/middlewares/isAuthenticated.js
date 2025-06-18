import dotenv from 'dotenv'
dotenv.config()


export function isLoggedIn(req,res,next){
    if (process.env.NODE_ENV === 'development') {
        if (!req.user) {
            req.user = {
                _id: process.env.DEV_ID,
                username: process.env.DEV_PASS,
                email: process.env.DEV_EMAIL
            };
        }
        return next();
    }

    // Production mode - normal authentication
    if(req.isAuthenticated()) return next()
    req.flash('error','You must be logged in')
    res.status(401).json({error:'Not Authenticated'})
}