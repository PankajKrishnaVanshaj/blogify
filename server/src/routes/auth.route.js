import express from "express";
import {
  login,
  logout,
  me,
  refreshToken,
  register,
  update,
} from "../controllers/auth.controller.js";
import "../config/google-strategy.js";
import passport from "passport";
import authMiddleware from "../middleware/authMiddleware.js";

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.get("/me", authMiddleware, me);
authRoute.put("/update", authMiddleware,  update);
authRoute.post("/refresh-token", refreshToken);

// Route for initiating Google OAuth
authRoute.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

// Route for handling Google OAuth callback
authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_HOST}`,
  }),
  (req, res) => {
    if (req.user && req.user.accessToken && req.user.refreshToken) {
      res.cookie('accessToken', req.user.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });
      
      res.cookie('refreshToken', req.user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.redirect(`${process.env.CLIENT_HOST}/dashboard`);
    } else {
      res.redirect(`${process.env.CLIENT_HOST}`);
    }
  }
);

export default authRoute;
