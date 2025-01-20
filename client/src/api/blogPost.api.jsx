import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/posts";

// Create an axios instance with default settings
const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const fetchSitemapPosts = async () => {
  try {
    const response = await axiosInstance.get("/sitemap-posts");
    return response.data
  } catch (error) {
    console.error("Error fetching sitemap posts:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch posts"
    );
  }
};

export const fetchAllPosts = async () => {
  try {
    const response = await axiosInstance.get("/get-all-posts");
    return response.data.posts || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch posts");
  }
};

export const fetchFilterPosts = async (page, category) => {
  const categoryParam =
    category === "All" ? "" : `&category=${encodeURIComponent(category)}`;
  const response = await axios.get(
    `${API_URL}/get-all-posts?page=${page}&limit=10${categoryParam}`
  );
  return response.data;
};

// Fetch all posts for the creator
export const fetchCreatorPosts = async (page = 1, limit = 10) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    throw new Error("No user found. Please log in.");
  }

  try {
    const { data } = await axiosInstance.get("/all-posts-of-creator", {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit }, // Sending page and limit as query params
    });
    return data;
  } catch (error) {
    throw new Error("Failed to fetch posts.");
  }
};


// Fetch a post by ID
export const getPostById = async (postId) => {
  try {
    const response = await axiosInstance.get(`/post/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch post data.");
  }
};

// Create a new post
export const createPostAPI = async (formData) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    throw new Error("You must be logged in to create a post.");
  }

  try {
    const response = await axiosInstance.post("/create-post", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      return { success: true, message: "Post submitted successfully" };
    } else {
      return { success: false, message: "Error submitting post" };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response
        ? error.response.data.message
        : "An unexpected error occurred",
    };
  }
};

// Update a post
export const updatePost = async (postId, formData) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    throw new Error("You must be logged in to update a post.");
  }

  try {
    const response = await axiosInstance.put(`/edit-post/${postId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response
        ? error.response.data.message
        : "An unexpected error occurred"
    );
  }
};

// Delete a post
export const deletePost = async (postId) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    throw new Error("You must be logged in to delete posts.");
  }

  try {
    await axiosInstance.delete(`/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error("Failed to delete post.");
  }
};

// Toggle like/dislike for a post
export const toggleLikeDislike = async (postId) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) throw new Error("Login required.");

  try {
    const { data } = await axiosInstance.post(
      `/${postId}/toggle-like-dislike`,
      {}, // Empty body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data; // Return relevant data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to toggle like/dislike"
    );
  }
};
