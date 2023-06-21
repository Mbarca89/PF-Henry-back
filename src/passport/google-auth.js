import passport from "passport";
import { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } from "../../config.js";
import GoogleStrategy from 'passport-google-oauth20'
import User from "../models/User.js";


passport.use("sign-in-google", new GoogleStrategy(
    {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        const user = await User.find({ email: profile.emails[0].value })
        if (!user.length) {
            const notFound = {
                registered: false,
                name: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value
            }
            done(null, notFound)
        } else done(null, user)
    }
)
);