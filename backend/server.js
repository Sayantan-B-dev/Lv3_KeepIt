import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import session from "express-session"
import MongoStore from "connect-mongo"

import app from './app.js'
import configurePassport from "./utils/passportConfig.js"
import passport from "passport"

const PORT=process.env.port||5000
mongoose.connect('mongodb://127.0.0.1:27017/myapp')//process.env.DATABASE_URL
    .then(()=>console.log("Connected!!"))
    .catch((e)=>console.log("MongoDB Error : "+e))


configurePassport()
app.listen(PORT,()=>{
    console.log(`🚀Server running on http://localhost:${PORT}`)
})