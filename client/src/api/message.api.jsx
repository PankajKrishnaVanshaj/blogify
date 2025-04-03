import { apiClient } from "./client";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1";

export const fetchConversations = async () => {
  // console.log("Fetching conversations");
  try {
    const response = await apiClient.get(`${API_BASE_URL}/conversation`);
    // console.log("Conversations fetched:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error fetching conversations:", error.message);
    throw new Error("Failed to fetch conversations");
  }
};

export const fetchMessages = async (conversationId) => {
  // console.log(`Fetching messages for conversation: ${conversationId}`);
  try {
    const response = await apiClient.get(`${API_BASE_URL}/conversation/${conversationId}`);
    // console.log("Messages fetched:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error fetching messages:", error.message);
    throw new Error("Failed to fetch messages");
  }
};

export const deleteConversation = async (conversationId) => {
  // console.log(`Deleting conversation: ${conversationId}`);
  try {
    const response = await apiClient.delete(`${API_BASE_URL}/conversation/${conversationId}`);
    // console.log("Conversation deleted:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error deleting conversation:", error.message);
    throw new Error("Failed to delete conversation");
  }
};

export const sendMessage = async (receiverId, messageContent) => {
  // console.log(`Sending message to receiver: ${receiverId}, content:`, messageContent);
  try {
    const response = await apiClient.post(`${API_BASE_URL}/message/send`, {
      receiverId,
      content: messageContent,
    });
    // console.log("Message sent:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error sending message:", error.message);
    throw new Error("Failed to send message");
  }
};