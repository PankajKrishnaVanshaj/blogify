"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { deleteWebStory, fetchCreatorWebStories } from "@/api/webStory.api";
import { GrNext, GrPrevious } from "react-icons/gr";

const AllWebStories = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 10,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, totalPages, page } = await fetchCreatorWebStories(
        pagination.page,
        pagination.limit
      );
      setData(data || []);
      setPagination((prev) => ({
        ...prev,
        totalPages,
        page,
      }));
    } catch (err) {
      console.error("Error fetching web stories:", err);
      setError(err.response?.data?.message || "Failed to fetch web stories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page]);

  const handleDelete = async (webStoryId) => {
    if (confirm("Are you sure you want to delete this web story?")) {
      try {
        await deleteWebStory(webStoryId);
        setData((prevData) =>
          prevData.filter((story) => story._id !== webStoryId)
        );
        alert("Web story deleted successfully.");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete the web story.");
      }
    }
  };

  const handleEdit = (webStoryId) => {
    if (confirm("Are you sure you want to edit this web story?")) {
      router.push(`/dashboard/create-web-story/${webStoryId}`);
    }
  };

  const handlePageChange = (direction) => {
    setPagination((prev) => {
      const newPage = prev.page + direction;
      if (newPage > 0 && newPage <= prev.totalPages) {
        return { ...prev, page: newPage };
      }
      return prev;
    });
  };

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container w-full">
      <div className="overflow-x-auto w-full shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-pink-200 via-pink-100 to-pink-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Web Story Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Likes
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Comments
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((webStory) => (
                <tr key={webStory._id} className="hover:bg-gray-50">
                  <td className="px-6 py-2 whitespace-nowrap text-sm">
                    {webStory.coverImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/${webStory.coverImage}`}
                        width={100}
                        height={100}
                        alt={webStory.title}
                        className="h-10 w-10 object-cover rounded-full"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-[28ch]">
                    <Link
                      href={`/${
                        webStory.slug &&
                        typeof webStory.slug === "string" &&
                        webStory.slug.length > 0
                          ? webStory.slug
                          : webStory._id
                      }/web-story`}
                      target="_blank"
                      className="block w-full"
                    >
                      {webStory.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {webStory.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {webStory.views || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {webStory.likes?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {webStory.comments?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(webStory.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium flex space-x-2">
                    <button
                      onClick={() => handleEdit(webStory._id)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(webStory._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  No web stories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={pagination.page <= 1}
          className="px-4 py-2 bg-gray-200 text-primary rounded-l-md"
        >
          <GrPrevious />
        </button>
        <span>
          <span className="px-4 py-2">{`${pagination.page} of ${pagination.totalPages}`}</span>
        </span>
        <button
          onClick={() => handlePageChange(1)}
          disabled={pagination.page >= pagination.totalPages}
          className="px-4 py-2 bg-gray-200 text-primary rounded-r-md"
        >
          <GrNext />
        </button>
      </div>
    </div>
  );
};

export default AllWebStories;
