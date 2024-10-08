import Conversation from "../models/conversation.model.js";

// Get Conversations for a User
export const getConversationsForUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name username avatar")
      .populate("lastMessage", "content sender createdAt"); // Populate lastMessage

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Conversation by ID
export const getConversationById = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const conversation = await Conversation.findById(conversationId)
      .populate("participants", "name username avatar")
      .populate("messages")
      .populate("lastMessage", "content sender createdAt"); // Populate lastMessage

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Conversation by ID
export const deleteConversationById = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if the user is a participant in the conversation
    if (!conversation.participants.includes(userId)) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to delete this conversation",
        });
    }

    // Delete the conversation
    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
