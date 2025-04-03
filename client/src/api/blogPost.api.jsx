import { apiClient, handleApiCall } from "./client";

export const fetchSitemapPosts = async () => {
 // console.log("Fetching sitemap posts");
  try {
    const response = await apiClient.get("/posts/sitemap-posts");
   // console.log("Sitemap posts fetched:", response.data);
    return response.data;
  } catch (error) {
   // console.error("Error fetching sitemap posts:", error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch posts");
  }
};

export const fetchAllPosts = async () => {
 // console.log("Fetching all posts");
  try {
    const response = await apiClient.get("/posts/get-all-posts");
   // console.log("All posts fetched:", response.data.posts);
    return response.data.posts || [];
  } catch (error) {
   // console.error("Error fetching all posts:", error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch posts");
  }
};

export const fetchFilterPosts = async (page, category) => {
  const categoryParam = category === "All" ? "" : `&category=${encodeURIComponent(category)}`;
 // console.log(`Fetching filtered posts, page: ${page}, category: ${category}`);
  try {
    const response = await apiClient.get(`/posts/get-all-posts?page=${page}&limit=10${categoryParam}`);
   // console.log("Filtered posts fetched:", response.data);
    return response.data;
  } catch (error) {
   // console.error("Error fetching filtered posts:", error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch posts");
  }
};

export const fetchCreatorPosts = async (page = 1, limit = 10) => {
 // console.log(`Fetching creator posts, page: ${page}, limit: ${limit}`);
  try {
    const response = await apiClient.get("/posts/all-posts-of-creator", {
      params: { page, limit },
    });
   // console.log("Creator posts fetched:", response.data);
    return response.data;
  } catch (error) {
   // console.error("Error fetching creator posts:", error.message);
    throw new Error("Failed to fetch posts.");
  }
};

export const getPostById = async (postId) => {
 // console.log(`Fetching post with ID: ${postId}`);
  try {
    const response = await apiClient.get(`/posts/post/${postId}`);
   // console.log("Post data:", response.data);
    return response.data;
  } catch (error) {
   // console.error("Error fetching post:", error.message);
    throw new Error("Failed to fetch post data.");
  }
};

export const createPostAPI = async (formData) => {
 // console.log("Creating post with data:", Object.fromEntries(formData));
  try {
    const promise = apiClient.post("/posts/create-post", formData, {
      // Remove Content-Type header; FormData sets it automatically
    });
    const response = await handleApiCall(promise);
    if (response.success) {
     // console.log("Post submitted successfully:", response.data);
      return { success: true, message: "Post submitted successfully", data: response.data };
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
   // console.error("Error creating post:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

export const updatePost = async (postId, formData) => {
 // console.log(`Updating post with ID: ${postId}, data:`, Object.fromEntries(formData));
  try {
    const promise = apiClient.put(`/posts/edit-post/${postId}`, formData, {
      // Let FormData set the Content-Type automatically
    });
    const response = await handleApiCall(promise);
    if (response.success) {
     // console.log("Post updated successfully:", response.data);
      return { success: true, message: "Post updated successfully", data: response.data };
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
   // console.error("Error updating post:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update post",
    };
  }
};

export const deletePost = async (postId) => {
 // console.log(`Deleting post with ID: ${postId}`);
  try {
    await apiClient.delete(`/posts/post/${postId}`);
   // console.log("Post deleted successfully");
  } catch (error) {
   // console.error("Error deleting post:", error.message);
    throw new Error("Failed to delete post.");
  }
};

export const toggleLikeDislike = async (postId) => {
 // console.log(`Toggling like/dislike for post: ${postId}`);
  try {
    const response = await apiClient.post(`/posts/${postId}/toggle-like-dislike`, {});
   // console.log("Like/dislike toggled:", response.data);
    return response.data;
  } catch (error) {
   // console.error("Error toggling like/dislike:", error.message);
    throw new Error(error.response?.data?.message || "Failed to toggle like/dislike");
  }
};