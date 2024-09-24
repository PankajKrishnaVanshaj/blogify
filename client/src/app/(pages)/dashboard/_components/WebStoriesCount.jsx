"use client";
import React from "react";
import {
  AiOutlineFundProjectionScreen,
  AiOutlineComment,
  AiOutlineFileText,
} from "react-icons/ai";
import { FiHeart } from "react-icons/fi";

const WebStoriesCount = () => {
  // Dummy data
  const dummyData = {
    stories: 20,
    views: 1500,
    likes: 300,
    comments: 75,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 w-full">
      <StatCard
        icon={<AiOutlineFileText />}
        title="Total Stories"
        value={dummyData.stories}
      />
      <StatCard
        icon={<AiOutlineFundProjectionScreen />}
        title="Total Views"
        value={dummyData.views}
      />
      <StatCard
        icon={<FiHeart />}
        title="Total Likes"
        value={dummyData.likes}
      />
      <StatCard
        icon={<AiOutlineComment />}
        title="Total Comments"
        value={dummyData.comments}
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
