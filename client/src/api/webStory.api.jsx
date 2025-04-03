import { apiClient } from "./client";


export const fetchSitemapWebStories = async () => {
  // console.log("Fetching sitemap web stories");
  try {
    const response = await apiClient.get("/web-stories/web-stories");
    // console.log("Sitemap web stories fetched:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error fetching sitemap web-stories:", error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch web-stories");
  }
};

export const fetchCreatorWebStories = async (page = 1, limit = 10) => {
  // console.log(`Fetching creator web stories, page: ${page}, limit: ${limit}`);
  try {
    const response = await apiClient.get("/web-stories/", {
      params: { page, limit },
    });
    // console.log("Creator web stories fetched:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error fetching creator web stories:", error.message);
    throw new Error("Failed to fetch creator web stories.");
  }
};

export const deleteWebStory = async (webStoryId) => {
  // console.log(`Deleting web story: ${webStoryId}`);
  try {
    await apiClient.delete(`/web-stories/${webStoryId}`);
    // console.log("Web story deleted successfully");
  } catch (error) {
    // console.error("Error deleting web story:", error.message);
    throw new Error("Failed to delete the web story.");
  }
};

export const getWebStoryById = async (webStoryId) => {
  // console.log(`Fetching web story with ID: ${webStoryId}`);
  try {
    const response = await apiClient.get(`/web-stories/${webStoryId}/stories`);
    // console.log("Web story data:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error fetching web story:", error.message);
    throw new Error("Failed to fetch web story.");
  }
};

export const updateWebStory = async (webStoryId, updatedData) => {
  // console.log(`Updating web story with ID: ${webStoryId}, data:`, updatedData);
  try {
    const response = await apiClient.put(`/web-stories/${webStoryId}`, updatedData, {
      headers: { "Content-Type": "application/json" },
    });
    // console.log("Web story updated successfully:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error updating web story:", error.message);
    throw new Error("Failed to update the web story.");
  }
};

export const createWebStory = async (webStoryData) => {
  // console.log("Creating web story with data:", webStoryData);
  try {
    const response = await apiClient.post("/web-stories/", webStoryData);
    // console.log("Web story API response:", response.data);

    // Check if response indicates success (adjust based on your API)
    if (!response.data || (response.data.success !== undefined && !response.data.success)) {
      throw new Error(response.data.message || "Web story creation failed on server.");
    }

    return response.data;
  } catch (error) {
    // Include server response details in the error
    const errorMessage = error.response?.data?.message || error.message || "Failed to create the web story.";
    console.error("Error creating web story:", {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(errorMessage);
  }
};

export const fetchPaginatedWebStories = async (page, limit) => {
  // console.log(`Fetching paginated web stories, page: ${page}, limit: ${limit}`);
  try {
    const response = await apiClient.get("/web-stories/all", {
      params: { page, limit },
    });
    // console.log("Paginated web stories fetched:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error fetching paginated web stories:", error.message);
    throw new Error("Failed to fetch paginated web stories.");
  }
};