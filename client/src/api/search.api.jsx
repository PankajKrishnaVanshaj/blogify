import axios from "axios";

// Define the base API URL
const API_URL = "http://localhost:55555/api/v1";

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
