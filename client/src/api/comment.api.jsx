import { apiClient } from "./client";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/comments";

export const getComments = async (postId) => {
 // console.log(`Fetching comments for post: ${postId}`);
  try {
    const response = await apiClient.get(`${API_BASE_URL}/${postId}`);
   // console.log("Comments fetched:", response.data);
    return response.data;
  } catch (error) {
   // console.error("Error fetching comments:", error.message);
    throw new Error("Failed to fetch comments");
  }
};

export const createComment = async (creatorId, comment) => {
 // console.log(`Creating comment for creator: ${creatorId}, comment:`, comment);
  try {
    const response = await apiClient.post(`${API_BASE_URL}/create/${creatorId}`, { comment });
   // console.log("Comment created:", response.data);
    return response.data;
  } catch (error) {
   // console.error("Error creating comment:", error.message);
    throw new Error("Failed to create comment");
  }
};

export const updateComment = async (creatorId, commentId, comment) => {
 // console.log(`Updating comment: ${commentId} for creator: ${creatorId}`);
  try {
    const response = await apiClient.put(`${API_BASE_URL}/update/${creatorId}/${commentId}`, { comment });
   // console.log("Comment updated:", response.data);
    return response.data;
  } catch (error) {
   // console.error("Error updating comment:", error.message);
    throw new Error("Failed to update comment");
  }
};

export const deleteComment = async (creatorId, commentId) => {
 // console.log(`Deleting comment: ${commentId} for creator: ${creatorId}`);
  try {
    await apiClient.delete(`${API_BASE_URL}/delete/${creatorId}/${commentId}`);
   // console.log("Comment deleted successfully");
  } catch (error) {
   // console.error("Error deleting comment:", error.message);
    throw new Error("Failed to delete comment");
  }
};