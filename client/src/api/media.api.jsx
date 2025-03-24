import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/medias";

// Create an axios instance with default settings
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Helper function to get the token
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Upload media
export const uploadMediaAPI = async (formData) => {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to upload media.");
  }

  try {
    const response = await axiosInstance.post("/upload-media", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      return { success: true, message: "Media submitted successfully" };
    } else {
      return { success: false, message: "Error uploading media" };
    }
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message || "An unexpected error occurred";

    console.error("Upload error:", error.response || error);

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const fetchCreatorMediaAPI = async (page = 1, limit = 10) => {
  const token = getToken();

  if (!token) {
    throw new Error("No user found. Please log in.");
  }

  try {
    const { data } = await axiosInstance.get("/all-medias-of-creator", {
      params: { page, limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error("Failed to fetch medias.");
  }
};


export const fetchAllMedias = async () => {
  try {
    const response = await axiosInstance.get("/get-all-medias");
    return response.data.posts || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch posts");
  }
};

export const getMediaById = async (mediaId) => {
  try {
    const response = await axiosInstance.get(`/media/${mediaId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch media data.");
  }
};

export const updateMedia = async (mediaId, formData) => {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to update a media.");
  }

  try {
    const response = await axiosInstance.put(
      `/edit-media/${mediaId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response
        ? error.response.data.message
        : "An unexpected error occurred"
    );
  }
};

export const deleteMedia = async (mediaId) => {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to delete media.");
  }

  try {
    await axiosInstance.delete(`/media/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error("Failed to delete media.");
  }
};
