import {
  getUserById,
  toggleFollowUnfollow,
  followersStatus,
} from "../controllers/user.controller.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const userRoute = express.Router();

userRoute.get("/user/:id", getUserById);
userRoute.post(
  "/user/:id/toggle-follow-unfollow",
  authMiddleware,
  toggleFollowUnfollow
);
userRoute.get("/user/:id/followers-status", authMiddleware, followersStatus);

export default userRoute;
