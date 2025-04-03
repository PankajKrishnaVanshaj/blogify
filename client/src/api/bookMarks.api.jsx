import { apiClient } from "./client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/bookmark";

export const fetchBookmarks = async () => {
 // console.log("Fetching bookmarks");
  try {
    const response = await apiClient.get(BASE_URL);
   // console.log("Bookmarks fetched:", response.data.bookMarks);
    return response.data.bookMarks;
  } catch (error) {
   // console.error("Error fetching bookmarks:", error.message);
    throw new Error("Failed to fetch bookmarks");
  }
};

export const toggleBookmark = async (postId) => {
 // console.log(`Toggling bookmark for post: ${postId}`);
  try {
    const response = await apiClient.post(`${BASE_URL}/${postId}`, {});
   // console.log("Bookmark toggled:", response.data);
    return response.data;
  } catch (error) {
   // console.error("Error toggling bookmark:", error.message);
    throw new Error("Failed to toggle bookmark");
  }
};