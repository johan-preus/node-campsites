var express = require("express")
const User = require("../models/user")
var router = express.Router()

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource")
})

router.post("/signup", (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                const err = new Error(
                    `User ${req.body.username} already exists`
                )
                err.status = 403
                return next(err)
            }
            User.create({
                username: req.body.username,
                password: req.body.password,
            })
                .then((user) => {
                    res.statusCode = 200
                    res.setHeader("Content-Type", "application/json")
                    res.json({ status: "Registration successful", user: user })
                })
                .catch((err) => next(err))
        })
        .catch((err) => next(err))
})

router.post("/login", (req, res, next) => {
    if (!req.session.user) {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            const err = new Error("You are not authenticated")
            res.setHeader("WWW-Authenticate", "Basic") //lets client know that basic auth is being requested
            err.status = 401
            return next(err)
        }

        const auth = Buffer.from(authHeader.split(" ")[1], "base64")
            .toString()
            .split(":")
        const [username, password] = auth

        User.findOne({ username: username })
            .then((user) => {
                if (!user) {
                    const err = new Error(`User ${username} does not exist`)
                    err.status = 401
                    return next(err)
                }
                if (user.password !== password) {
                    const err = new Error(`Your password is incorrect`)
                    err.status = 401
                    return next(err)
                }
                // unnecessary check done as a precaution
                if (user.username === username && user.password === password) {
                    req.session.user = "authenticated"
                    res.statusCode = 200
                    res.setHeader("Content-Type", "text/plain")
                    res.end("You are authenticated")
                }
            })
            .catch((err) => next(err))
    } else {
        res.statusCode = 200
        res.setHeader("Content-Type", "text/plain")
        res.end("You are already authenticated")
    }
})

router.get("/logout", (req, res, next) => {
    if (req.session) {
        // deletes file on server side, will not be recognized as valid if user tries to log in with this session
        req.session.destroy()

        res.clearCookie("session-id") // name configured in app.js
        res.redirect("/")
    } else {
        const err = new Error("You are not logged in")
        err.status = 401
        return next(err)
    }
})

module.exports = router
