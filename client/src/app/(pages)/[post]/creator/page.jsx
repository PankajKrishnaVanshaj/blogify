"use client";
import BlogPostCard from "@/components/BlogPostCard";
import FollowButton from "@/components/FollowButton";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Creator = ({ params }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:55555/api/v1/users/user/${params.post}`
      );
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center text-gray-600">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center text-red-600">
        <span className="text-lg">{error}</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 flex justify-center items-center text-gray-600">
        <span className="text-lg">No user data available</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500">
          <Image
            src={user.avatarUrl || "/pankri.png"}
            alt={user.name}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-lg text-gray-600">@{user.username}</p>
            </div>
            <FollowButton user={user} /> {/* Pass the entire user object */}
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-600">
            <span className="flex items-center space-x-1">
              <span className="font-medium text-gray-800">Posts:</span>
              <span>{user.posts.length}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="font-medium text-gray-800">Joined:</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </span>
          </div>
        </div>
      </div>
      <div>
        {user.posts.map((post) => (
          <BlogPostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Creator;
