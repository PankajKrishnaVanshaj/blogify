import express from "express";
import {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} from "../controllers/message.controller.js"; // Adjust the path

const messageRouter = express.Router();

// Create a new message
messageRouter.post("/", createMessage);

// Get all messages (optionally by sender or receiver)
messageRouter.get("/", getMessages);

// Update a message by ID (for status updates)
messageRouter.put("/:id", updateMessage);

// Delete a message by ID
messageRouter.delete("/:id", deleteMessage);

export default messageRouter;
