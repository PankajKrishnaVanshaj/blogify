"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import notificationService from "@/api/notifications.api";
import Image from "next/image";
import { MdOutlineNotificationsActive } from "react-icons/md";
import UserInfo from "./UserInfo";
import Link from "next/link";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const notificationsRef = useRef(null);

  useEffect(() => {
    if (user?.notifications) {
      setNotifications(user.notifications);
    }
  }, [user]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await Promise.all(
          notifications.map(async (notification) => {
            const postId = notification.message;
            try {
              const post = await notificationService.fetchPostById(postId); // Use the service
              return { ...notification, post };
            } catch (error) {
              console.error("Error fetching post data:", error);
              return { ...notification, post: null }; // Handle missing posts
            }
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
        await notificationService.markAsRead(notificationId); // Use the service
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

  const unreadNotifications = notifications.some((n) => !n.read);

  return (
    <div className="relative z-10" ref={notificationsRef}>
      <button
        onClick={toggleNotificationButton}
        className="p-2 rounded-full text-primary hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition duration-150 ease-in-out relative"
      >
        <MdOutlineNotificationsActive size={30} />
        {unreadNotifications && (
          <span className="absolute top-2 right-2 block h-3 w-3 bg-red-600 rounded-full"></span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 p-1 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-auto max-h-[calc(100vh-6rem)]">
          {posts.length > 0 ? (
            posts
              .slice()
              .reverse()
              .map(({ post, ...notification }) => (
                <div
                  key={notification._id}
                  className={`relative mb-2 p-4 border ${
                    notification.read
                      ? "border-gray-200"
                      : "border-primary bg-pink-50"
                  } rounded-lg shadow-md`}
                >
                  <div className="flex items-center mb-2">
                    <Image
                      src={
                        post?.banner
                          ? `${process.env.NEXT_PUBLIC_BASE_URL}/${post.banner}`
                          : "/default-image.png"
                      }
                      alt={post?.title || "Notification Image"}
                      width={80}
                      height={80}
                      className="object-cover w-16 h-16 rounded-lg"
                    />
                    <div className="ml-4">
                      {post ? (
                        <Link
                          href={`/${post._id}/post`}
                          onClick={() => markAsRead(notification._id)}
                        >
                          <h1 className="text-md font-semibold cursor-pointer hover:scale-105 transition duration-200">
                            {post.title.length > 50
                              ? `${post.title.slice(0, 50)}...`
                              : post.title}
                          </h1>
                        </Link>
                      ) : (
                        <p className="text-md text-red-500">
                          Post not available
                        </p>
                      )}
                    </div>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-sm text-gray-500">
                    {post?.createdBy && (
                      <UserInfo user={post.user} use={"BlogPostCard"} />
                    )}
                    <span>
                      {post
                        ? new Date(post.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <p className="p-4 text-center text-gray-600">
              No notifications yet.
            </p>
          )}
          {error && <p className="p-4 text-center text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Notifications;
