"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AllPosts = () => {
  const router = useRouter();
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
        `http://localhost:55555/api/v1/posts/all-posts-of-creator`,
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
      await axios.delete(`http://localhost:55555/api/v1/posts/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Optimistic UI update
      setData(data.filter((post) => post._id !== postId));
    } catch (error) {
      alert("An error occurred while deleting the post.");
    }
  };

  const handleEdit = (postId) => {
    const confirmEdit = window.confirm(
      "Are you sure you want to edit this post?"
    );
    if (!confirmEdit) return;
    router.push(`/dashboard/create-post/${postId}`);
  };

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container">
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-pink-200 via-pink-100 to-pink-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Image
              </th>
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(data) && data.length > 0 ? (
              data
                .slice()
                .reverse()
                .map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-6 py-2 whitespace-nowrap text-sm">
                      {post.banner ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}/${post.banner}`}
                          width={100}
                          height={100}
                          alt={post.title}
                          className="h-10 w-10 object-cover rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs cursor-pointer">
                      <Link href={`/${post._id}`}>{post.title}</Link>
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
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium flex space-x-2">
                      <button
                        onClick={() => handleEdit(post._id)}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 transition duration-300 ease-in-out"
                      >
                        <FaEdit />
                        <span></span>
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-red-600 hover:text-red-800 flex items-center space-x-1 transition duration-300 ease-in-out"
                      >
                        <FaTrash />
                        <span></span>
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

export default AllPosts;
