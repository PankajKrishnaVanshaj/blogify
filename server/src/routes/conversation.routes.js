import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  deleteConversationById,
  getConversationById,
  getConversationsForUser,
} from "../controllers/conversation.controller.js";

const conversationRouter = express.Router();

// Apply authMiddleware globally to all routes
conversationRouter.use(authMiddleware);

// Route to get all conversations for the logged-in user
conversationRouter.route("/").get(getConversationsForUser);

// Routes to get or delete a conversation by its ID
conversationRouter
  .route("/:conversationId")
  .get(getConversationById)
  .delete(deleteConversationById);

export default conversationRouter;
