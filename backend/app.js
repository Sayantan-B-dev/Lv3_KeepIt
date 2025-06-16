import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"  
import passport from "passport"
import flash from "connect-flash"
import methodOverride from "method-override"
import mongoSanitize from "express-mongo-sanitize"
import helmet from "helmet"

import path from "path"
import { fileURLToPath } from "url"
const __dirname=path.dirname(fileURLToPath(import.meta.url))//added fpr authRoutes

import dotenv from 'dotenv';
dotenv.config();//solves the express.session deprecated problem 



const app=express() 
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(mongoSanitize())
app.use(helmet())

import authRoutes from "./routes/auth.js"
app.use(authRoutes)

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:flash,
    store:MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/myapp',
        touchAfter: 24 * 3600,
    }),
    cookie:{
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, 
    }
}))

app.use((req,res,next)=>{
    req.locals.success=req.flash("success")
    req.locals.error=req.flash("error")
    next()
})


app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

export default app