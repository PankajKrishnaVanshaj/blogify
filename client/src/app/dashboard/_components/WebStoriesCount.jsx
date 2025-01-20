"use client";
import React, { useEffect, useState } from "react";
import {
  AiOutlineFundProjectionScreen,
  AiOutlineComment,
  AiOutlineFileText,
} from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { fetchSitemapWebStories } from "@/api/webStory.api"; // Ensure you have this API function

const WebStoriesCount = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storiesData, setStoriesData] = useState({
    stories: 0,
    views: 0,
    likes: 0,
    comments: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSitemapWebStories(); // Replace with actual API function to fetch web stories data
        const totalViews = data.reduce((acc, story) => acc + story.views, 0);
        const totalLikes = data.reduce((acc, story) => acc + story.likes, 0);
        const totalComments = data.reduce((acc, story) => acc + story.comments, 0);

        setStoriesData({
          stories: data.length,
          views: totalViews,
          likes: totalLikes,
          comments: totalComments,
        });
      } catch (err) {
        setError("Oops! No content available.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 w-full">
      <StatCard
        icon={<AiOutlineFileText />}
        title="Total Stories"
        value={storiesData.stories}
      />
      <StatCard
        icon={<AiOutlineFundProjectionScreen />}
        title="Total Views"
        value={storiesData.views}
      />
      <StatCard
        icon={<FiHeart />}
        title="Total Likes"
        value={storiesData.likes}
      />
      <StatCard
        icon={<AiOutlineComment />}
        title="Total Comments"
        value={storiesData.comments}
      />
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="flex items-center bg-white p-4 rounded-lg shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl">
    <div className="text-2xl text-primary mr-3">{icon}</div>
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-lg text-gray-600">{value}</p>
    </div>
  </div>
);

export default WebStoriesCount;
