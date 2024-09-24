import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { IoBookmarksOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const BookMarkStatus = ({ post, size = 24 }) => {
  const { user } = useAuth();
  const token = Cookies.get("token");

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user?.msg?.bookMarks) {
      setIsBookmarked(
        user.msg.bookMarks.some((item) => {
          // Check if both item.postId and post are defined before comparing
          return (
            item.postId && post && item.postId.toString() === post.toString()
          );
        })
      );
    }
  }, [user, post]);

  // useEffect(() => {
  //   const fetchBookmarkStatus = async () => {
  //     try {
  //       if (!token) {
  //         alert("No token found");
  //         return;
  //       }

  //       const response = await axios.get(
  //         `http://localhost:55555/api/v1/bookmark/${book}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       setIsBookmarked(response.data.isBookmarked);
  //     } catch (error) {
  //       console.error("Error fetching bookmark status:", error);
  //     }
  //   };

  //   if (book) {
  //     fetchBookmarkStatus();
  //   }
  // }, [book, token]);

  const toggleBookmark = async () => {
    try {
      if (!token) {
        alert("Please log in first");
        return;
      }

      const response = await axios.post(
        `http://localhost:55555/api/v1/bookmark/${post}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsBookmarked(!isBookmarked);
        toast(
          `You ${
            isBookmarked
              ? "removed this post from your bookmarks!"
              : "bookmarked this post!"
          }`
        );
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <div>
      <button
        onClick={toggleBookmark}
        className={`p-2 rounded-full hover:bg-gray-200 ${
          isBookmarked ? "text-red-500 " : "text-black"
        } transition-colors duration-200`}
        aria-label={isBookmarked ? "Remove from bookmark" : "Add to bookmark"}
      >
        <IoBookmarksOutline size={size} />
      </button>
    </div>
  );
};

export default BookMarkStatus;
