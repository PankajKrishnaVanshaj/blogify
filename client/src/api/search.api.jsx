import { apiClient } from "./client";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1";

export const fetchPostsByCategory = async (category) => {
  if (!category) {
    throw new Error("Category is required");
  }
  // console.log(`Fetching posts by category: ${category}`);
  try {
    const response = await apiClient.get(
      `${API_URL}/search/suggestion-posts-by-category?category=${encodeURIComponent(category)}`
    );
    // console.log("Posts by category fetched:", response.data.posts);
    if (!Array.isArray(response.data.posts)) {
      throw new Error("Received data is not in the expected format");
    }
    return response.data.posts;
  } catch (error) {
    // console.error("Error fetching posts by category:", error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch posts");
  }
};

export const fetchSearchSuggestions = async (query) => {
  if (!query.trim()) return [];
  // console.log(`Fetching search suggestions for query: ${query}`);
  try {
    const response = await apiClient.get(`${API_URL}/search/suggestion`, {
      params: { q: query },
    });
    // console.log("Search suggestions fetched:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    // console.error("Error fetching suggestions:", error.message);
    return [];
  }
};

export const searchPosts = async (query) => {
  // console.log(`Searching posts with query: ${query}`);
  try {
    const response = await apiClient.get(`${API_URL}/search`, {
      params: { q: query },
    });
    // console.log("Search results:", response.data.posts);
    return response.data.posts;
  } catch (error) {
    // console.error("Error fetching search results:", error.message);
    throw new Error(error.response?.data?.message || "Failed to search posts");
  }
};