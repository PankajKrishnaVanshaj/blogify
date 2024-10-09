// Services/ApiService.js
import axios from "axios";
import Cookies from "js-cookie";

export const getToken = () => Cookies.get("token");

export const fetchConversations = async () => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  return axios.get("http://localhost:55555/api/v1/conversation", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchMessages = async (conversationId) => {
  const token = getToken();
  return axios.get(
    `http://localhost:55555/api/v1/conversation/${conversationId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const sendMessage = async (receiverId, messageContent) => {
  const token = getToken();
  return axios.post(
    "http://localhost:55555/api/v1/message/send",
    { receiverId, content: messageContent },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteConversation = async (conversationId) => {
  const token = getToken();
  return axios.delete(
    `http://localhost:55555/api/v1/conversation/${conversationId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const toggleUserBlock = async (userId) => {
  const token = getToken();
  return axios.post(
    `http://localhost:55555/api/v1/users/user/${userId}/toggle-block-unblock`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const toggleFollowingUnfollowing = async (userId) => {
  const token = getToken();
  return axios.post(
    `http://localhost:55555/api/v1/users/user/${userId}/toggle-follow-unfollow`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
