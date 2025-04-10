import { apiClient, handleApiCall } from "./client";


// Upload media
export const uploadMediaAPI = async (formData) => {
  // console.log("Uploading media with data:", formData);
  try {
    const response = await apiClient.post("/medias/upload-media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("Raw server response:", response); // Log full response

    // Check status directly since handleApiCall might not fit here
    if (response.status === 201) {
      // console.log("Media submitted successfully:", response.data);
      return { success: true, message: "Media submitted successfully", data: response.data };
    } else {
      // console.warn("Unexpected response status:", response.status);
      return { success: false, message: "Unexpected response from server" };
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred during media upload";
     console.error("Upload error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return { success: false, message: errorMessage };
  }
};

// Fetch creator's media
export const fetchCreatorMediaAPI = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get("/medias/all-medias-of-creator", {
      params: { page, limit },
    });
    console.log("API Response:", {
      page,
      limit,
      medias: response.data.medias.length,
      totalMedias: response.data.totalMedias,
      totalPages: response.data.totalPages,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching creator media:", error.message);
    throw new Error("Failed to fetch medias.");
  }
};

// Fetch all medias
export const fetchAllMedias = async () => {
  // console.log("Fetching all medias");
  try {
    const response = await apiClient.get("/medias/get-all-medias");
    // console.log("All medias fetched:", response.data.posts);
    return response.data.posts || [];
  } catch (error) {
    // console.error("Error fetching all medias:", error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch posts");
  }
};

// Get media by ID
export const getMediaById = async (mediaId) => {
  // console.log(`Fetching media with ID: ${mediaId}`);
  try {
    const response = await apiClient.get(`/medias/media/${mediaId}`);
    // console.log("Media data:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error fetching media:", error.message);
    throw new Error("Failed to fetch media data.");
  }
};

// Update media
export const updateMedia = async (mediaId, formData) => {
  // console.log(`Updating media with ID: ${mediaId}, data:`, formData);
  try {
    const response = await apiClient.put(`/medias/edit-media/${mediaId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("Media updated successfully:", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error updating media:", error.message);
    throw new Error(
      error.response?.data?.message || "An unexpected error occurred"
    );
  }
};

// Delete media
export const deleteMedia = async (mediaId) => {
  // console.log(`Deleting media with ID: ${mediaId}`);
  try {
    await apiClient.delete(`/medias/media/${mediaId}`);
    // console.log("Media deleted successfully");
  } catch (error) {
    // console.error("Error deleting media:", error.message);
    throw new Error("Failed to delete media.");
  }
};