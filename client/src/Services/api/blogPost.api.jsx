import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");

export const fetchAllPosts = async () => {
  if (!token) {
    throw new Error("No user found. Please log in.");
  }

  const { data } = await axios.get(
    `http://localhost:55555/api/v1/posts/all-posts-of-creator`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return Array.isArray(data) ? data : data.posts;
};
