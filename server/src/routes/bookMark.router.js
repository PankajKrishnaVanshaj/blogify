import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  BookMarkStatus,
  getBookMark,
  toggleBookMark,
} from "../controllers/bookMark.controller.js";

const bookMarkRouter = express.Router();

bookMarkRouter.get("/:postId", authMiddleware, BookMarkStatus);
bookMarkRouter.post("/:postId", authMiddleware, toggleBookMark);
bookMarkRouter.get("/", authMiddleware, getBookMark);

export default bookMarkRouter;
