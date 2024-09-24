import Image from "next/image";
import React from "react";

const ProfileInfo = () => {
  return (
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
  );
};

export default ProfileInfo;
