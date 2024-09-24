import { MdOutlineDeleteOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import UserInfo from "../UserInfo";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

const CommentList = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:55555/api/v1/comments/${postId}`
        );
        setComments(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const deleteHandle = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:55555/api/v1/comments/delete/${postId}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error(
        "Error deleting comment:",
        error.response ? error.response.data : error.message
      );
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-4">Error: {error}</div>;

  return (
    <div className="rounded-lg shadow-md bg-white p-4 max-h-80 overflow-auto">
      {comments.length > 0 ? (
        <ul>
          {comments
            .slice()
            .reverse()
            .map((comment) => (
              <li
                key={comment._id}
                className="px-4 py-2 my-2 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <UserInfo user={comment.user} use={"BlogPostCard"} />
                  <small className="text-gray-500 ml-2">
                    {new Date(comment.createdAt).toLocaleString("en-GB", {
                      timeZone: "Asia/Karachi", // Adjust time zone as needed
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </small>
                </div>
                <hr className="mt-2 mb-2" />
                <div className="flex justify-between mt-2 text-gray-700 font-medium max-h-32 overflow-auto">
                  <p>{comment.comment}</p>
                  <span className="flex flex-row gap-2 text-lg">
                    {comment.user._id === user?.msg?._id && (
                      <MdOutlineDeleteOutline
                        className="text-red-500 cursor-pointer"
                        onClick={() => deleteHandle(comment._id)}
                      />
                    )}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500">No comments found</div>
      )}
    </div>
  );
};

export default CommentList;
