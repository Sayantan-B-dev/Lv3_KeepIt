import User from "../models/user.js"
import passport from "passport"

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ username, email })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, e => {
            if (e) return next(e)
            req.flash("success", 'Welcome to Notes App')
            req.status(201).json({ message: "Registered successfully" })
        })
    } catch (e) {
        req.flash("error", e.message)
        req.status(400).json({ error: e.message })
    }
}

export const loginUser = passport.authenticate('local', {
    failureFlash: false,
    failureRedirect: '/login'
})

export const postLogin = (req, res) => {
    req.flash('success', 'welcome back')
    req.status(200).json({ message: 'logged in successfully' })
}

export const logoutUser = (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'logged out successfully')
        req.status(200).json({ message: 'logged out successfully' })
    })
}
