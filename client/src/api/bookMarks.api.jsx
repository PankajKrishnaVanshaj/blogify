import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/bookmark";

const getToken = () => Cookies.get("token");

export const fetchBookmarks = async () => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const response = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.bookMarks;
};

export const toggleBookmark = async (postId) => {
  const token = getToken();
  if (!token) throw new Error("Please log in first");

  const response = await axios.post(
    `${BASE_URL}/${postId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};