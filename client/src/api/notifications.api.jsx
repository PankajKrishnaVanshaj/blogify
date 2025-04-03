import { apiClient } from "./client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/posts";

const notificationService = {
  markAsRead: async (notificationId) => {
    // console.log(`Marking notification as read: ${notificationId}`);
    try {
      const response = await apiClient.patch(`${BASE_URL}/${notificationId}/mark-notification`, {});
      // console.log("Notification marked as read:", response.data);
      return response.data;
    } catch (error) {
      // console.error("Error marking notification as read:", error.message);
      throw new Error("Failed to mark notification as read");
    }
  },

  fetchPostById: async (postId) => {
    // console.log(`Fetching post by ID: ${postId}`);
    try {
      const response = await apiClient.get(`${BASE_URL}/post/${postId}`);
      // console.log("Post data:", response.data);
      return response.data;
    } catch (error) {
      // console.error("Error fetching post:", error.message);
      throw new Error("Failed to fetch post data");
    }
  },
};

export default notificationService;