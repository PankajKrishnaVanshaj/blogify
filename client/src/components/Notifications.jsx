"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Image from "next/image";
import { MdNotificationsActive } from "react-icons/md";
import UserInfo from "./UserInfo";
import Link from "next/link";
import Cookies from "js-cookie";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const token = Cookies.get("token");
  const notificationsRef = useRef(null);

  // Log notifications for debugging
  useEffect(() => {
    // console.log(
    //   user?.msg?.notifications?.map((notification) => notification.message)
    // );
    if (user?.msg?.notifications) {
      setNotifications(user.msg.notifications);
    }
  }, [user]);

  // Fetch posts related to notifications
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

  // Close notification on outside click or "Escape" key
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        closeNotification();
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        closeNotification();
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen]);

  const toggleNotificationButton = () => {
    setIsOpen(!isOpen);
  };

  const closeNotification = () => {
    setIsOpen(false);
  };

  const markAsRead = async (notificationId) => {
    const notification = notifications.find((n) => n._id === notificationId);
    closeNotification();

    if (notification && !notification.read) {
      try {
        await axios.patch(
          `http://localhost:55555/api/v1/posts/${notificationId}/mark-notification`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Update local state to mark as read
        setNotifications(
          notifications.map((n) =>
            n._id === notificationId ? { ...n, read: true } : n
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  if (error) {
    return <div className="p-4 text-red-700">{error}</div>;
  }

  return (
    <div className="relative z-10" ref={notificationsRef}>
      <button
        onClick={toggleNotificationButton}
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition duration-150 ease-in-out"
      >
        <MdNotificationsActive size={30} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-auto max-h-[calc(100vh-4rem)]">
          {posts
            .slice()
            .reverse()
            .map(({ post, ...notification }) => (
              <div
                key={notification._id}
                className="relative mb-2 p-2 border border-gray-200 rounded-lg shadow-md bg-white"
              >
                {!notification.read && (
                  <span className="absolute top-2 right-2 block h-3 w-3 bg-primary rounded-full"></span>
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
