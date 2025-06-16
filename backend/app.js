import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"  
import passport from "passport"
import flash from "connect-flash"
import methodOverride from "method-override"
import sanitize from 'mongo-sanitize';
import helmet from "helmet"



//added fpr authRoutes
import path from "path"
import { fileURLToPath } from "url"
const __dirname=path.dirname(fileURLToPath(import.meta.url))


//solves the express.session deprecated problem 
import dotenv from 'dotenv';
dotenv.config();


//important middlewares
const app=express() 
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  req.body = sanitize(req.body);
  req.params = sanitize(req.params);
  next();
});
app.use(helmet())


app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/myapp',
        touchAfter: 24 * 3600,
    }),
    cookie:{
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, 
    }
}))

//must be after session
app.use(flash())

// Passport middleware (after session)
app.use(passport.initialize());
app.use(passport.session());

// Custom middleware to make flash messages available in all responses (optional if using EJS)
app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    next()
})

import authRoutes from "./routes/auth.js";
import categoryRoutes from './routes/category.js'
import noteRoutes from './routes/note.js'


app.use('/api/auth', authRoutes)
app.use('/app/categories',categoryRoutes)
app.use('/app/notes',noteRoutes)


export default app