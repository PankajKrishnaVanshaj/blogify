import {
  getUserByIdOrUsername,
  toggleFollowUnfollow,
  followersStatus,
  toggleBlockUnblock,
} from "../controllers/user.controller.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const userRoute = express.Router();

userRoute.get("/user/:id", getUserByIdOrUsername);

userRoute.post(
  "/user/:id/toggle-follow-unfollow",
  authMiddleware,
  toggleFollowUnfollow
);

userRoute.post(
  "/user/:id/toggle-block-unblock",
  authMiddleware,
  toggleBlockUnblock
);

userRoute.get("/user/:id/followers-status", authMiddleware, followersStatus);

export default userRoute;
