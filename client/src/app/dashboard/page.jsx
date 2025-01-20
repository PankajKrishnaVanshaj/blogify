"use client";
import AccountCount from "./_components/AccountCount";
import BlogPostCount from "./_components/BlogPostCount";
import WebStoriesCount from "./_components/WebStoriesCount";
import ProfileInfo from "./_components/ProfileInfo";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      {/* Profile Section */}
      <ProfileInfo />

      {/* Count Section */}
      <div className="w-full space-y-8">
        {/* Account Count */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Account Stats
          </h2>
          <div className="bg-white rounded-xl shadow-md p-2">
            <AccountCount />
          </div>
        </div>

        {/* Post Count */}
        {/* <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Post Stats
          </h2>
          <div className="bg-white rounded-xl shadow-md p-2">
            <BlogPostCount />
          </div>
        </div> */}
        {/* Web Stories Count */}
        {/* <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Web Stories Stats
          </h2>
          <div className="bg-white rounded-xl shadow-md p-2">
            <WebStoriesCount />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
