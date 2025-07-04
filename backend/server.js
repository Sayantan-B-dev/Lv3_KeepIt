import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import MongoStore from "connect-mongo"

import app from './app.js'
import configurePassport from "./utils/passportConfig.js"
import passport from "passport"

// Set development environment
process.env.NODE_ENV = 'development'

const PORT = process.env.port || 5000
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("DB Connected!!")
        configurePassport()
        app.listen(PORT, () => {
            console.log(`🚀Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`)
        })
    })
    .catch((e) => {
        console.log("MongoDB Error : " + e)
        process.exit(1)
    })