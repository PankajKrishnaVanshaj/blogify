import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  LikesStatus,
  markNotification,
  toggleLikeDislike,
  updatePost,
} from "../controllers/post.controller.js";
import { upload } from "../config/multer.js";

const postRoute = express.Router();

postRoute.post(
  "/create-post",
  authMiddleware,
  upload.single("banner"), // Corrected the field name here
  createPost
);
postRoute.get("/all-posts-of-creator", authMiddleware, getPostsByUser);
postRoute.get("/get-all-posts", getAllPosts);
postRoute.get("/post/:id", getPostById);
postRoute.put(
  "/edit-post/:id",
  authMiddleware,
  upload.single("banner"),
  updatePost
);
postRoute.delete("/post/:id", authMiddleware, deletePost);

postRoute.post("/:id/toggle-like-dislike", authMiddleware, toggleLikeDislike);
postRoute.get("/:id/likes-status", authMiddleware, LikesStatus);
postRoute.patch("/:id/mark-notification", authMiddleware, markNotification);

export default postRoute;
