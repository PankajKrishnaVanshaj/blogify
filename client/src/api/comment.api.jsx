import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/comments";
const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const getComments = async (postId) => {
  const response = await axios.get(`${API_BASE_URL}/${postId}`);
  return response.data;
};

const createComment = async (creatorId, comment) => {
  const response = await axios.post(
    `${API_BASE_URL}/create/${creatorId}`,
    { comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const updateComment = async (creatorId, commentId, comment) => {
  const response = await axios.put(
    `${API_BASE_URL}/update/${creatorId}/${commentId}`,
    { comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const deleteComment = async (creatorId, commentId) => {
  await axios.delete(`${API_BASE_URL}/delete/${creatorId}/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getComments, createComment, updateComment, deleteComment };
