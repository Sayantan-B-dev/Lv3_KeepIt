export function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next()
    req.flash('error','You must be logged in')
    res.status(401).json({error:'Not Authenticated'})
}