const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("./models/user")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const jwt = require("jsonwebtoken")

const config = require("./config")

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 }) // omit expiration and token never expires
}

const opts = {}

// specifies how jwt should be extracted from request
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

opts.secretOrKey = config.secretKey

exports.jwtPassport = passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        console.log("JWT Payload", jwt_payload)
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false)
            } else if (user) {
                return done(null, user)
            } else {
                // could set up code prompting new account
                return done(null, false)
            }
        })
    })
)

exports.verifyUser = passport.authenticate("jwt", { session: false })
