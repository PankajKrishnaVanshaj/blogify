import { apiClient, handleApiCall } from "./client";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1";

// Adjusted refreshAccessToken to not expect data in response
export const refreshAccessToken = async () => {
 // console.log("Calling refreshAccessToken");
  const promise = apiClient.post("/auth/refresh-token");
  try {
    const response = await handleApiCall(promise);
    if (response.success) {
     // console.log("Refresh token successful, new access token set in cookie");
      return { success: true }; // No data expected since token is in cookie
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
   // console.error("Refresh token failed:", error.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
 // console.log("Fetching current user");
  try {
    const response = await apiClient.get("/auth/me");
   // console.log("Current user data:", response.data);
    return response.data;
  } catch (error) {
   // console.error("Error fetching user:", error.message);
    throw error;
  }
};

export const signIn = async (email, password) => {
 // console.log("Attempting sign in for:", email);
  const payload = { email, password };
  const promise = apiClient.post("/auth/login", payload);
  return await handleApiCall(promise);
};

export const signUp = async (firstName, lastName, email, password) => {
 // console.log("Attempting sign up for:", email);
  const payload = { firstName, lastName, email, password };
  const promise = apiClient.post("/auth/register", payload);
  return await handleApiCall(promise);
};

export const googleLogin = () => {
 // console.log("Initiating Google login");
  window.open(`${API_URL}/auth/google`, "_self");
};

export const logout = async () => {
 // console.log("Attempting logout");
  try {
    await apiClient.post("/auth/logout");
   // console.log("Logout successful");
    return { success: true };
  } catch (error) {
   // console.error("Logout error:", error.message);
    return { success: false, message: error.message };
  }
};

export const isAuthenticated = async () => {
 // console.log("Checking authentication status");
  try {
    await getCurrentUser();
   // console.log("User is authenticated");
    return true;
  } catch (error) {
   // console.log("User is not authenticated:", error.message);
    return false;
  }
};