import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/web-stories";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Helper: Get token from localStorage
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Helper: Set Authorization Header
const setAuthHeader = () => {
  const token = getToken();
  if (!token) throw new Error("Authentication token is missing.");
  return { Authorization: `Bearer ${token}` };
};

export const fetchSitemapWebStories =async ()=>{
  try {
    const response = await axiosInstance.get("/web-stories");
    return response.data
  } catch (error) {
    console.error("Error fetching sitemap web-stories:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch web-stories"
    );
  }
}

// Fetch paginated web stories for creator
export const fetchCreatorWebStories = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get("/", {
      headers: setAuthHeader(),
      params: { page, limit },  // Add pagination params
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching creator web stories:", error.response?.data || error.message);
    throw new Error("Failed to fetch creator web stories.");
  }
};

// Delete a web story
export const deleteWebStory = async (webStoryId) => {
  try {
    await axiosInstance.delete(`/${webStoryId}`, {
      headers: setAuthHeader(),
    });
  } catch (error) {
    console.error("Error deleting web story:", error.response?.data || error.message);
    throw new Error("Failed to delete the web story.");
  }
};

// Fetch a web story by ID
export const getWebStoryById = async (webStoryId) => {
  try {
    const response = await axiosInstance.get(`/${webStoryId}/stories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching web story by ID:", error.response?.data || error.message);
    throw new Error("Failed to fetch web story.");
  }
};

// Update a web story
export const updateWebStory = async (webStoryId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/${webStoryId}`, updatedData, {
      headers: {
        ...setAuthHeader(),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating web story:", error.response?.data || error.message);
    throw new Error("Failed to update the web story.");
  }
};

// Create a new web story
export const createWebStory = async (webStoryData) => {
  try {
    const response = await axiosInstance.post("/", webStoryData, {
      headers: {
        ...setAuthHeader(),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating web story:", error.response?.data || error.message);
    throw new Error("Failed to create the web story.");
  }
};


// Fetch paginated web stories
export const fetchPaginatedWebStories = async (page, limit) => {
  try {
    const response = await axiosInstance.get("/all", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated web stories:", error.response?.data || error.message);
    throw new Error("Failed to fetch paginated web stories.");
  }
};