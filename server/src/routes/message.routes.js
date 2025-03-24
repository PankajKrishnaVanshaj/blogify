import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendMessage } from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.post("/send", authMiddleware, sendMessage);

export default messageRouter;
