import axios from "axios";
import { toast } from "sonner";
import { refreshAccessToken } from "./auth.api"; 

const API_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const retryRequest = async (request, retries = 3, delay = 1000) => {
  try {
   // console.log(`Attempting request, retries left: ${retries}`);
    return await request();
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
     // console.log(`Rate limited (429), retrying after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(request, retries - 1, delay * 2);
    }
   // console.error("Request failed:", error.message);
    throw error;
  }
};

apiClient.interceptors.request.use((config) => {
 // console.log(`Making request to: ${config.url}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
   // console.log(`Response received from ${response.config.url}: ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;
     // console.log("401 Unauthorized received");

      try {
       // console.log("Attempting token refresh");
        const refreshResult = await refreshAccessToken();
        if (refreshResult.success) {
         // console.log("Token refresh successful, retrying original request");
          return apiClient(originalRequest); // Retry with new cookie
        }
      } catch (refreshError) {
       // console.error("Token refresh failed:", refreshError.message);
        return Promise.reject(error); // Reject original error, not refreshError
      }
    }

    if (error.response?.status === 429) {
     // console.log("429 Too Many Requests received");
      toast.error("Too many requests. Please wait a moment and try again.");
    }

   // console.error("Request error:", error.message);
    return Promise.reject(error);
  }
);

const handleApiCall = async (promise) => {
  try {
    const response = await retryRequest(() => promise);
   // console.log("API call successful:", response.data);
    if (response.data.success !== undefined && !response.data.success) {
      throw new Error(response.data.message);
    }
    return { success: true, data: response.data }; 
  } catch (error) {
   // console.error("API Error:", error.message);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred. Please try again.";
    if (error.response?.status !== 429) {
      toast.error(errorMessage);
    }
    return { success: false, message: errorMessage };
  }
};

export { apiClient, handleApiCall };