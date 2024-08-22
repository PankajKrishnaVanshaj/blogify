"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Image from "next/image";
import { IoMdCloseCircleOutline } from "react-icons/io";
import UserInfo from "./UserInfo";
import Link from "next/link";
import Cookies from "js-cookie";

const Notifications = ({ isDialogVisible, setIsDialogVisible }) => {
  const { loading, notifications = [] } = useAuth(); // Initialize notifications to an empty array
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await Promise.all(
          notifications.map(async (notification) => {
            const postId = notification.message;
            const response = await axios.get(
              `http://localhost:55555/api/v1/posts/post/${postId}`
            );
            return { ...notification, post: response.data };
          })
        );
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching post data:", error);
        setError("Failed to fetch post data");
      }
    };

    if (notifications.length > 0) {
      fetchPosts();
    }
  }, [notifications]);

  const markAsRead = async (notificationId) => {
    const notification = notifications.find((n) => n._id === notificationId);
    if (notification && !notification.read) {
      await axios.patch(
        `http://localhost:55555/api/v1/posts/${notificationId}/mark-notification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div
      className={`fixed top-16 right-4 bg-white bg-opacity-90 z-50 p-4 max-w-sm w-full border border-gray-300 rounded-lg shadow-lg transition-transform ${
        isDialogVisible ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ maxHeight: "80vh", overflowY: "auto" }} // Added overflow-auto with max-height
    >
      <button
        aria-label="Close notifications"
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-50"
        onClick={() => setIsDialogVisible(false)}
      >
        <IoMdCloseCircleOutline size={24} />
        {notifications.length > 0 &&
          notifications.some((notification) => !notification.read) && (
            <span className="absolute top-0 right-0 block h-3 w-3 bg-pink-500 rounded-full"></span>
          )}
      </button>
      {isDialogVisible && (
        <div>
          {posts.map(({ post, ...notification }) => (
            <div
              key={notification._id}
              className="relative mb-2 p-2 border border-gray-200 rounded-lg shadow-md bg-white"
            >
              {!notification.read && (
                <span className="absolute top-2 right-2 block h-3 w-3 bg-pink-500 rounded-full"></span>
              )}
              <div className="flex items-center mb-2">
                <Image
                  src={
                    `${process.env.NEXT_PUBLIC_BASE_URL}/${post.banner}` ||
                    "/default-image.png"
                  }
                  alt={post.title || "Notification Image"}
                  width={80}
                  height={80}
                  className="object-cover w-12 h-12 rounded-lg"
                />
                <div className="ml-4">
                  <Link
                    href={`/${post._id}`}
                    onClick={() => markAsRead(notification._id)}
                  >
                    <h1 className="text-md font-lg cursor-pointer hover:scale-x-105 duration-300">
                      {post.title.length > 50
                        ? `${post.title.slice(0, 50)}...`
                        : post.title}
                    </h1>
                  </Link>
                </div>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <div>
                  {post.createdBy && (
                    <UserInfo user={post.user} use={"BlogPostCard"} />
                  )}
                </div>
                <div>{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
