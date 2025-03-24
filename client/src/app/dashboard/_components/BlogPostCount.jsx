"use client";
import React, { useEffect, useState } from "react";
import {
  AiOutlineFundProjectionScreen,
  AiOutlineComment,
  AiOutlineFileText,
} from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { fetchSitemapPosts } from "@/api/blogPost.api";

const BlogPostCount = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [posts, setPosts] = useState(0);

  const fetchData = async () => {
    try {
      const fetchedPosts = await fetchSitemapPosts();

      const totalViews = fetchedPosts.reduce(
        (acc, post) => acc + post.views,
        0
      );
      const totalLikes = fetchedPosts.reduce(
        (acc, post) => acc + post.likes.length,
        0
      );
      const totalComments = fetchedPosts.reduce(
        (acc, post) => acc + post.comments.length,
        0
      );

      setViews(totalViews);
      setLikes(totalLikes);
      setComments(totalComments);
      setPosts(fetchedPosts.length);
    } catch (err) {
      // console.error("Fetch Error:", err);
      // setError(err.message || "An error occurred while fetching data.");
      setError( "Oops! No content available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 w-full">
      <StatCard
        icon={<AiOutlineFileText />}
        title="Total Posts"
        value={posts}
      />
      <StatCard
        icon={<AiOutlineFundProjectionScreen />}
        title="Total Views"
        value={views}
      />
      <StatCard icon={<FiHeart />} title="Total Likes" value={likes} />
      <StatCard
        icon={<AiOutlineComment />}
        title="Total Comments"
        value={comments}
      />
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-tertiary transition-shadow duration-300 ease-in-out hover:shadow-xl">
    <div className="text-2xl text-primary mr-3">{icon}</div>
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-lg text-gray-600">{value}</p>
    </div>
  </div>
);

export default BlogPostCount;
