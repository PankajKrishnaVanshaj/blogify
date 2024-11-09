import { useEffect, useState } from "react";
import { IoBookmarksOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { toggleBookmark as toggleBookmarkAPI } from "@/api/bookMarks.api";

const BookMarkStatus = ({ post, size = 24 }) => {
  const { user } = useAuth();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user?.bookMarks) {
      setIsBookmarked(
        user.bookMarks.some(
          (item) =>
            item.postId?._id &&
            post &&
            item.postId._id.toString() === post.toString()
        )
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
      const response = await toggleBookmarkAPI(post); // Call the API function
      setIsBookmarked(!isBookmarked); // Update the bookmarked state

      // Show toast notification after the state has been updated
      toast(
        `You ${
          !isBookmarked
            ? "bookmarked this post!"
            : "removed this post from your bookmarks!"
        }`
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to toggle bookmark");
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
