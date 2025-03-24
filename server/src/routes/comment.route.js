import express from "express";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const commentRouter = express.Router();

// Route to add a comment to a post
commentRouter.post("/create/:postId", authMiddleware, addComment);
commentRouter.get("/:postId", getComments);

// Route to update a comment on a post
commentRouter.put("/posts/:postId/comments/:commentId", updateComment);

// Route to delete a comment from a post
commentRouter.delete(
  "/delete/:postId/:commentId",
  authMiddleware,
  deleteComment
);

export default commentRouter;
