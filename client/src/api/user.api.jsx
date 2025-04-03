import { apiClient, handleApiCall } from "./client";

// Function to fetch user details
export const getUserDetails = async (userId) => {
  // console.log(`Fetching details for user: ${userId}`);
  try {
    const response = await apiClient.get(`/users/user/${userId}`);
    // console.log("User data:", response.data);
    return { userData: response.data };
  } catch (error) {
    // console.error("Error fetching user data:", error.message);
    return { userError: "Failed to fetch user data" };
  }
};

// Function to toggle user block/unblock
export const toggleUserBlock = async (userId) => {
  // console.log(`Toggling block/unblock for user: ${userId}`);
  try {
    const promise = apiClient.post(`/users/user/${userId}/toggle-block-unblock`, {});
    const result = await handleApiCall(promise);
    if (result.success) {
      // console.log("Block/unblock toggled successfully:", result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    // console.error("Error toggling user block/unblock:", error.message);
    throw error;
  }
};

// Function to toggle following/unfollowing a user
export const toggleFollowingUnfollowing = async (userId) => {
  // console.log(`Toggling follow/unfollow for user: ${userId}`);
  try {
    const promise = apiClient.post(`/users/user/${userId}/toggle-follow-unfollow`, {});
    const result = await handleApiCall(promise);
    if (result.success) {
      // console.log("Follow/unfollow toggled successfully:", result.data);
      return { success: true, message: result.data.message || "Action completed successfully", data: result.data };
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    // console.error("Error toggling follow/unfollow:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to toggle follow/unfollow",
    };
  }
};

// Function to update user profile with form data
export const updateProfile = async (formData) => {
  // console.log("Updating profile with data:", formData);
  try {
    const response = await apiClient.put("/auth/update", formData, {
      headers: {
        "Content-Type": "application/json", // Adjust to multipart/form-data if needed
      },
    });
    // console.log("Profile updated successfully:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error updating profile:", error.message);
    throw error;
  }
};