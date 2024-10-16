import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:55555/api/v1"; // Use an environment variable

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Function to handle API calls
const handleApiCall = async (promise) => {
  try {
    const response = await promise;
    if (response.data.success) {
      return { success: true, data: response.data };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred. Please try again.";
    toast.error(errorMessage);
    return { success: false, message: errorMessage };
  }
};

// Function to get the current user
export const getCurrentUser = async () => {
  const token = Cookies.get("token");

  if (!token) {
    console.log("No token found");
    return null;
  }

  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Sign-in function
export const signIn = async (email, password) => {
  const payload = { email, password };
  const promise = apiClient.post("/auth/login", payload);
  const result = await handleApiCall(promise);

  if (result.success) {
    Cookies.set("token", result.data.token); // Assuming the token is returned in the response
    return { success: true, message: result.data.message };
  }
  return result;
};

// Sign-up function
export const signUp = async (firstName, lastName, email, password) => {
  const payload = { firstName, lastName, email, password };
  const promise = apiClient.post("/auth/register", payload);
  return handleApiCall(promise);
};

// Google login function
export const googleLogin = () => {
  window.open(`${API_URL}/auth/google`, "_self");
};
