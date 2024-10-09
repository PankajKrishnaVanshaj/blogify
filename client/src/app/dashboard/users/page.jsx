"use client";
import { useState } from "react";
import BlockedUserCard from "./_components/BlockedUserCard";
import FollowersUserCard from "./_components/FollowersUserCard";
import FollowingUserCard from "./_components/FollowingUserCard";

const Users = () => {
  const [activeTab, setActiveTab] = useState("following");

  return (
    <div className="bg-white rounded-xl shadow-md p-2">
      {/* Tab Navigation */}
      <div className="flex justify-around bg-white rounded-lg shadow-sm shadow-primary font-semibold">
        <button
          className={`p-1 ${
            activeTab === "following"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
        <button
          className={`p-1 ${
            activeTab === "followers"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
        </button>
        <button
          className={`p-1 ${
            activeTab === "blocked"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("blocked")}
        >
          Blocked Users
        </button>
      </div>

      {/* Conditional Rendering of User Cards in Three Columns */}
      <div className="mt-4">
        {activeTab === "following" && (
          <div className="w-full">
            <FollowingUserCard />
          </div>
        )}
        {activeTab === "followers" && (
          <div className="w-full">
            <FollowersUserCard />
          </div>
        )}
        {activeTab === "blocked" && (
          <div className="w-full">
            <BlockedUserCard />
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
