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

const postRoute = express.Router();

postRoute.get("/post/:id", getPostById);
postRoute.get("/get-all-posts", getAllPosts);
postRoute.delete("/post/:id", authMiddleware, deletePost);
postRoute.post("/create-post", authMiddleware, createPost);
postRoute.put("/edit-post/:id", authMiddleware, updatePost);
postRoute.get("/all-posts-of-creator", authMiddleware, getPostsByUser);

postRoute.get("/:id/likes-status", authMiddleware, LikesStatus);
postRoute.patch("/:id/mark-notification", authMiddleware, markNotification);
postRoute.post("/:id/toggle-like-dislike", authMiddleware, toggleLikeDislike);

export default postRoute;
