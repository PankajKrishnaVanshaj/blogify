import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1";

export const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export const fetchConversations = async () => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  return axios.get(`${API_BASE_URL}/conversation`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchMessages = async (conversationId) => {
  const token = getToken();
  return axios.get(`${API_BASE_URL}/conversation/${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteConversation = async (conversationId) => {
  const token = getToken();
  return axios.delete(`${API_BASE_URL}/conversation/${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const sendMessage = async (receiverId, messageContent) => {
  const token = getToken();
  return axios.post(
    `${API_BASE_URL}/message/send`,
    { receiverId, content: messageContent },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
