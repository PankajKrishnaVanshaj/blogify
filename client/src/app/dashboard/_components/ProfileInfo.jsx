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
        <div
          className="flex-shrink-0 w-40 h-40 rounded-full overflow-hidden bg-gray-200 border border-primary"
          style={{ minWidth: "10rem", minHeight: "10rem" }} // Fixed size
        >
          {user?.avatar ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${user.avatar}`}
              width={100}
              height={100}
              priority
              className="object-cover w-full h-full"
              alt={`${user?.name || "User"}'s Avatar`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Avatar
            </div>
          )}
        </div>
        {/* Profile Info */}
        <div className="ml-6 flex-grow">
          <h3 className="text-xl font-bold text-gray-900">{user?.name || "N/A"}</h3>
          <p className="text-gray-600">@{user?.username || "username"}</p>
          <p className="text-gray-600 font-mono">{user?.email || "No email provided"}</p>
          <p
            className="text-black mt-1 text-sm"
            dangerouslySetInnerHTML={{
              __html: user?.bio || "No bio available",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
