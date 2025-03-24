import express from "express";
import {
  login,
  logout,
  me,
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
    if (req.user && req.user.token) {
      const { token } = req.user;
      // Redirect to client with token as a query parameter
      res.redirect(`${process.env.CLIENT_HOST}/auth?token=${token}`);
    } else {
      // Redirect to client if no token
      res.redirect(`${process.env.CLIENT_HOST}`);
    }
  }
);

export default authRoute;
