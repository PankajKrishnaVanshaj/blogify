import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import Users from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/index.js";

// Send a message
export const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user._id;

  try {
    // Fetch the receiver user data to check blocked users
    const receiver = await Users.findById(receiverId).select("blockedUsers");

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Check if the sender is in the receiver's blockedUsers list
    const isBlocked = receiver.blockedUsers.some(
      (blockedUser) => blockedUser.user.toString() === senderId.toString()
    );

    if (isBlocked) {
      return res.status(403).json({ message: "You are blocked by this user" });
    }

    // Create new message
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    const savedMessage = await newMessage.save();

    // Find or create conversation between sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      // If no conversation exists, create a new one
      conversation = new Conversation({
        participants: [senderId, receiverId],
        messages: [savedMessage._id],
        lastMessage: savedMessage._id, // Set the last message
      });
    } else {
      // If conversation exists, push the new message and update the last message
      conversation.messages.push(savedMessage._id);
      conversation.lastMessage = savedMessage._id; // Update the last message
    }

    await conversation.save();
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(savedMessage);
  } catch (err) {
    // console.error("Error in sendMessage:", err.message); // Log detailed error
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Messages in a Conversation
export const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId).populate(
      "messages"
    );
    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });
    res.status(200).json(conversation.messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
