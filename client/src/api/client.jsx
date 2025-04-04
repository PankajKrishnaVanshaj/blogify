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
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

const retryRequest = async (request, retries = 3, delay = 1000) => {
  try {
    return await request();
  } catch (error) {
    const status = error.response?.status;
    if ((status === 429 || error.code === "ECONNABORTED") && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(request, retries - 1, delay * 2);
    }
    throw error;
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResult = await refreshAccessToken();
          if (refreshResult.success) {
            processQueue(null);
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError);
          // If no access token, don’t retry, just fail silently
          if (refreshError.message === "NO_ACCESS_TOKEN") {
            return Promise.reject(new Error("NO_ACCESS_TOKEN"));
          }
          return Promise.reject(new Error("SESSION_EXPIRED"));
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    if (status === 429) {
      toast.error("Too many requests. Please wait and try again.");
    }

    if (status === 401) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

const handleApiCall = async (promise) => {
  try {
    const response = await retryRequest(() => promise);
    if (response.data.success !== undefined && !response.data.success) {
      throw new Error(response.data.message);
    }
    return { success: true, data: response.data };
  } catch (error) {
    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred. Please try again.";

    if (status === 429) {
      toast.error("Too many requests. Please wait and try again.");
    } else if (
      status !== 401 ||
      (error.message !== "NO_ACCESS_TOKEN" && error.message === "SESSION_EXPIRED")
    ) {
      toast.error(errorMessage);
    }

    return { success: false, message: errorMessage };
  }
};

export { apiClient, handleApiCall };