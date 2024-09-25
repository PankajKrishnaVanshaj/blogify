"use client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import React from "react";

const ProfileInfo = () => {
  const { user } = useAuth();

  return (
    <div className="w-full mb-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Profile Info</h2>
      <div className="w-full bg-white rounded-xl shadow-md p-6 flex items-center">
        {/* Profile Image */}
        <div className="w-40 h-40 rounded-full overflow-hidden bg-white border border-primary">
          {user?.avatar && (
            <Image
              src={user?.avatar}
              width={100}
              height={100}
              priority={true}
              className="object-cover w-full h-full"
              alt="User Avatar"
            />
          )}
        </div>
        {/* Profile Info */}
        <div className="ml-6">
          <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
          <p className="text-gray-600">@{user?.username}</p>
          <p className="text-gray-600 font-mono">{user?.email}</p>
          <p className="mt-4 text-gray-700">{user?.bio} </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
