import axios from "axios";

// Define the base API URL
const API_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1";

export const fetchPostsByCategory = async (category) => {
  if (!category) {
    throw new Error("Category is required");
  }

  const response = await axios.get(
    `${API_URL}/search/suggestion-posts-by-category?category=${encodeURIComponent(
      category
    )}`
  );

  const data = response.data;

  // Check if data has 'posts' array
  if (!Array.isArray(data.posts)) {
    throw new Error("Received data is not in the expected format");
  }

  return data.posts;
};

// Function to fetch search suggestions
export const fetchSearchSuggestions = async (query) => {
  if (!query.trim()) return [];

  try {
    const response = await axios.get(`${API_URL}/search/suggestion`, {
      params: { q: query },
    });

    const data = response.data;

    // Ensure the data is an array
    if (Array.isArray(data)) {
      return data; // Return the suggestions
    } else {
      return []; // Return an empty array if data is not an array
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return []; // Return an empty array in case of an error
  }
};

// Function to search posts
export const searchPosts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { q: query },
    });
    return response.data.posts; // Return the posts from the response
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error; // Re-throw the error for handling in the calling component
  }
};
