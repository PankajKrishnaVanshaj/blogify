import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
import Users from "../models/user.model.js";
import {
  createAccessToken,
  createRefreshToken,
  generateUniqueUsername,
  hashString,
} from "../utils/index.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
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
            isGoogleAuth: true,
            refreshToken: [] // Initialize as empty array
          });
        }

        // Generate tokens
        const newAccessToken = createAccessToken(user._id);
        const newRefreshToken = createRefreshToken(user._id);

        // Replace any existing refresh tokens with the new one
        // This ensures only one refresh token exists at a time
        user.refreshToken = [newRefreshToken];
        
        // Save the updated user
        await user.save();

        // Remove password from response
        user.password = undefined;

        return done(null, {
          user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        });
      } catch (error) {
        // console.error('Google Strategy Error:', error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((data, done) => {
  done(null, {
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken
  });
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});