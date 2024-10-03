import Message from "../models/message.model.js";

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    const newMessage = new Message({ sender, receiver, content });
    await newMessage.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Message created successfully",
        data: newMessage,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create message",
        error: error.message,
      });
  }
};

// Get all messages (optional: filter by sender or receiver)
export const getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.query;
    let filter = {};
    if (sender) filter.sender = sender;
    if (receiver) filter.receiver = receiver;

    const messages = await Message.find(filter)
      .populate("sender")
      .populate("receiver");
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch messages",
        error: error.message,
      });
  }
};

// Update a message (e.g., to mark as "read")
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Message updated successfully",
        data: updatedMessage,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update message",
        error: error.message,
      });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete message",
        error: error.message,
      });
  }
};
