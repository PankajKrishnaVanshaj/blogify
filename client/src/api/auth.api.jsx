import { apiClient, handleApiCall } from "./client";

// Local flags to track authentication state
let isAuthChecked = false;
let isAuthValid = false;

export const refreshAccessToken = async () => {
  // Only attempt refresh if we believe there’s a session
  if (!isAuthChecked || !isAuthValid) {
    throw new Error("NO_ACCESS_TOKEN");
  }

  const promise = apiClient.post("/auth/refresh-token");
  try {
    const response = await handleApiCall(promise);
    if (response.success) {
      isAuthChecked = true;
      isAuthValid = true;
      return { success: true };
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    isAuthChecked = true;
    isAuthValid = false;
    throw new Error("SESSION_EXPIRED");
  }
};

export const getCurrentUser = async () => {
  // Skip if we know there’s no valid session
  if (isAuthChecked && !isAuthValid) {
    throw new Error("NO_ACCESS_TOKEN");
  }

  try {
    const response = await apiClient.get("/auth/me");
    isAuthChecked = true;
    isAuthValid = true;
    return response.data;
  } catch (error) {
    isAuthChecked = true;
    isAuthValid = false;
    throw error;
  }
};

export const signIn = async (email, password) => {
  const payload = { email, password };
  const promise = apiClient.post("/auth/login", payload);
  try {
    const response = await handleApiCall(promise);
    if (response.success) {
      isAuthChecked = true;
      isAuthValid = true;
    }
    return response;
  } catch (error) {
    isAuthChecked = true;
    isAuthValid = false;
    throw error;
  }
};

export const signUp = async (firstName, lastName, email, password) => {
  const payload = { firstName, lastName, email, password };
  const promise = apiClient.post("/auth/register", payload);
  try {
    const response = await handleApiCall(promise);
    if (response.success) {
      isAuthChecked = true;
      isAuthValid = true;
    }
    return response;
  } catch (error) {
    isAuthChecked = true;
    isAuthValid = false;
    throw error;
  }
};

export const googleLogin = () => {
  const API_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1";
  window.open(`${API_URL}/auth/google`, "_self");
};

export const logout = async () => {
  try {
    await apiClient.post("/auth/logout");
    isAuthChecked = true;
    isAuthValid = false;
    return { success: true };
  } catch (error) {
    isAuthChecked = true;
    isAuthValid = false;
    return { success: false, message: error.message };
  }
};

export const isAuthenticated = async () => {
  // If already checked and valid, return true without API call
  if (isAuthChecked && isAuthValid) {
    return true;
  }
  // If already checked and invalid, return false without API call
  if (isAuthChecked && !isAuthValid) {
    return false;
  }
  // Otherwise, check with the server
  try {
    await getCurrentUser();
    return true;
  } catch (error) {
    return false;
  }
};

// Reset auth state (e.g., on page refresh or manual trigger)
export const resetAuthState = () => {
  isAuthChecked = false;
  isAuthValid = false;
};