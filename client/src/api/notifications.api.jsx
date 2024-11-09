import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/posts";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const notificationService = {
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/${notificationId}/mark-notification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to mark notification as read");
    }
  },

  fetchPostById: async (postId) => {
    try {
      const response = await axios.get(`${BASE_URL}/post/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch post data");
    }
  },
};

export default notificationService;
