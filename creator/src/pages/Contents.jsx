import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";

const Contents = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get("token");

  const fetchData = async () => {
    if (!token) {
      setError("No user found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/all-posts-of-creator`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(
        Array.isArray(response.data) ? response.data : response.data.posts
      );
    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optimistic UI update
      setData(data.filter((post) => post._id !== postId));

      console.log(`Post with ID: ${postId} has been deleted.`);
    } catch (error) {
      console.error(
        "Error deleting post:",
        error.response ? error.response.data : error.message
      );
      alert("An error occurred while deleting the post.");
    }
  };

  const handleEdit = (postId) => {
    const confirmEdit = window.confirm(
      "Are you sure you want to edit this post?"
    );
    if (!confirmEdit) return;
    navigate(`/create-post/${postId}`);
  };

  const formatToIST = (date) =>
    new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  if (loading) return <div className="spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container mx-auto">
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-pink-500 to-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Post Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Comments
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Post Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(data) && data.length > 0 ? (
              data.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">
                    {post.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Array.isArray(post.comments)
                      ? post.comments.length
                      : "No Comments"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatToIST(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium flex space-x-2">
                    <button
                      onClick={() => handleEdit(post._id)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 transition duration-300 ease-in-out"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 hover:text-red-800 flex items-center space-x-1 transition duration-300 ease-in-out"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contents;
