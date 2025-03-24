// user.api.js
import axios from "axios";

// Define the base API URL
const API_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1";

// Utility function to get the token
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

// Utility function to create headers with Authorization token
const getAuthHeaders = () => {
  const token = getToken();
  if (!token) throw new Error("No token found");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Function to fetch user details
export const getUserDetails = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/user/${userId}`, {
      // headers: getAuthHeaders(),
    });
    return { userData: response.data }; // Return user data
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { userError: "Failed to fetch user data" }; // Return error message
  }
};

// Function to toggle user block/unblock
export const toggleUserBlock = async (userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/user/${userId}/toggle-block-unblock`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling user block/unblock:", error);
    throw error;
  }
};

// Function to toggle following/unfollowing a user
export const toggleFollowingUnfollowing = async (userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/user/${userId}/toggle-follow-unfollow`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling follow/unfollow:", error);
    throw error;
  }
};

// Function to update user profile with form data (supports file upload)
export const updateProfile = async (formData) => {
  try {
    const response = await axios.put(`${API_URL}/auth/update`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return updated user data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
