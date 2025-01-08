// Creator.jsx
"use client";
import FollowButton from "@/components/FollowButton";
import MessageForm from "@/components/MessageForm";
import { getUserDetails } from "@/api/user.api";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ShareButton from "@/components/ShareButton";
const BlogPostCard = dynamic(() => import("@/components/BlogPostCard"), {
  ssr: false,
});

const Creator = ({ params }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { userData, userError } = await getUserDetails(params.creator);
      if (userError) {
        setError(userError);
      } else {
        setUser(userData);
      }
      setLoading(false);
    };

    fetchUserDetails();
  }, [params.creator]);

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
    <div className="py-2">
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 p-6 bg-white shadow-lg rounded-lg border border-gray-200 mx-auto max-w-4xl">
        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary">
          <Image
            src={
              `${process.env.NEXT_PUBLIC_BASE_URL}/${user?.avatar}` ||
              "/pankri.png"
            }
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
            <FollowButton userId={user} />
            <div className="border border-primary px-5 rounded-md hover:bg-primary transition-colors">
              <ShareButton url={window.location.href} size={24} />
            </div>
            <MessageForm receiver={user} />
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
          <p className="text-sm font-light leading-4 py-1 rounded-lg">
            {user?.bio}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 py-3">
        {user.posts
          .slice()
          .reverse()
          .map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
      </div>
    </div>
  );
};

export default Creator;
