import React from "react";
import AccountCount from "./_components/AccountCount";
import BlogPostCount from "./_components/BlogPostCount";
import Image from "next/image";
import WebStoriesCount from "./_components/WebStoriesCount";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Profile Section */}
      <div className="w-full mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Profile Info</h2>
        <div className="w-full bg-white rounded-xl shadow-md p-6 flex items-center">
          {/* Profile Image */}
          <Image
            src={""}
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-primary object-cover"
          />
          {/* Profile Info */}
          <div className="ml-6">
            <h3 className="text-xl font-bold text-gray-900">John Doe</h3>
            <p className="text-gray-600">@johndoe</p>
            <p className="text-gray-600 font-mono">johndoe@example.com</p>
            <p className="mt-4 text-gray-700">
              A passionate developer and creator of high-quality web solutions.
            </p>
          </div>
        </div>
      </div>

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
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Post Stats
          </h2>
          <div className="bg-white rounded-xl shadow-md p-2">
            <BlogPostCount />
          </div>
        </div>
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
