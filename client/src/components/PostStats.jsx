"use client";
import { BiHeart, BiShowAlt, BiSolidChat, BiSolidHeart } from "react-icons/bi";
import CommentForm from "./comment/CommentForm";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ShareButton from "./ShareButton";
import { toast } from "sonner"; // Import toast from Sonner Toast
import { useAuth } from "@/context/AuthContext";

const PostStats = ({ post }) => {
  const { user } = useAuth();
  const token = Cookies.get("token");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  useEffect(() => {
    if (post) {
      setIsLiked(
        post.likes.some((f) => f.user.toString() === user?.msg?._id.toString())
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

  const toggleLikeDislike = async () => {
    try {
      if (!token) {
        toast.error("Login first");
        return;
      }

      const response = await axios.post(
        `http://localhost:55555/api/v1/posts/${post._id}/toggle-like-dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        toast(`You ${isLiked ? "unliked" : "liked"} this post!`);
      }
    } catch (error) {
      console.error("Error toggling like/dislike:", error);
      toast.error("Failed to update like status.");
    }
  };

  return (
    <div className="">
      <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <BiShowAlt className="text-xl" />
          {post.views}
        </span>
        <span
          className="flex items-center gap-1 cursor-pointer text-xl text-red-500"
          onClick={toggleLikeDislike}
        >
          {isLiked ? <BiSolidHeart /> : <BiHeart />}
          {likesCount}
        </span>
        <span className="flex items-center gap-1 cursor-pointer">
          <ShareButton url={`http://localhost:3000/${post._id}`} size={20} />
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
