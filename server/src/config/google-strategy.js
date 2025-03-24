// Config/google-strategy.js
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
import Users from "../models/user.model.js";
import {
  createJWT,
  generateUniqueUsername,
  hashString,
} from "../utils/index.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback", // Ensure this matches your route
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const name = profile.displayName;

        if (!email) {
          return done(new Error("No email found in profile"));
        }

        let user = await Users.findOne({ email });
        if (!user) {
          const lastSixDigitsID = profile.id.slice(-6);
          const lastTwoDigitsName = name.slice(-2);
          const newPass = lastTwoDigitsName + lastSixDigitsID;
          const hashedPassword = await hashString(newPass);
          const defaultUsername = email.split("@")[0];
          const uniqueUsername = await generateUniqueUsername(defaultUsername);

          user = await Users.create({
            name,
            email,
            username: uniqueUsername,
            password: hashedPassword,
          });
        }

        user.password = undefined;
        const token = createJWT(user._id);
        return done(null, { user, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
