"use client";
import { BiHeart, BiShowAlt, BiSolidChat } from "react-icons/bi"; 
import CommentForm from "./comment/CommentForm";
import { useEffect, useState } from "react";
import ShareButton from "./ShareButton";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import BookMarkStatus from "./BookMarkStatus";
import { toggleLikeDislike } from "@/api/blogPost.api";
import PostSummary from "./PostSummary";

const PostStats = ({ post, size = 21 }) => {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  useEffect(() => {
    if (post && user) {
      setIsLiked(
        post.likes.some((f) => f.user.toString() === user?._id.toString())
      );
    }
  }, [user, post]);

  // useEffect(() => {
  //   const fetchLikeStatus = async () => {
  //     try {
  //       if (!token) {
  //         console.error("No token found");
  //         return;
  //       }

  //       const response = await axios.get(
  //         `http://localhost:55555/api/v1/posts/${post._id}/likes-status`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       setIsLiked(response.data.isLiked);
  //     } catch (error) {
  //       console.error("Error fetching like status:", error);
  //       toast.error("Failed to fetch like status.");
  //     }
  //   };

  //   fetchLikeStatus();
  // }, [post._id, token]);

  const handleToggleLike = async () => {
    try {
      await toggleLikeDislike(post._id);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      toast(`You ${isLiked ? "unliked" : "liked"} this post!`);
    } catch (error) {
      console.error("Error toggling like/dislike:", error);
      toast.error(error.message || "Failed to update like status.");
    }
  };

 
  const postTitle = post.title; // Post title
  return (
    <div className="">
      <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <BiShowAlt className="text-xl text-black" />
          {post.views}
        </span>
        <span
          className={`flex items-center gap-1 cursor-pointer ${
            isLiked ? "text-red-500" : "text-black"
          } transition-colors duration-200`}
          onClick={handleToggleLike}
        >
          <BiHeart size={size} />
          {likesCount}
        </span>
        <span className="flex items-center gap-1 cursor-pointer">
          <ShareButton
            url={window.location.href}
            title={postTitle}
            size={20}
          />
        </span>
        <span className="flex items-center gap-1 cursor-pointer">
          <BookMarkStatus post={post._id} size={17} />
        </span>
        <span className="flex items-center gap-1 cursor-pointer">
          <PostSummary PostContent={post.content} />
        </span>
        <span
          className="flex flex-shrink-0 items-center gap-1 border rounded-full px-3 py-1 text-sm font-thin cursor-pointer"
          onClick={toggleForm}
        >
          <BiSolidChat className="text-xl" />
          Add a comment...
        </span>
      </div>
      {isFormOpen && <CommentForm closeForm={toggleForm} />}
    </div>
  );
};

export default PostStats;