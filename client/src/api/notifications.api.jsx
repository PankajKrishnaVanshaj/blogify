import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:55555/api/v1/posts"; // Adjust this as needed

const token = Cookies.get("token");

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
