import { useAuth } from "@/context/AuthContext";
import { toggleUserBlock } from "@/api/user.api";
import Image from "next/image";
import { toast } from "sonner";
import React, { useState } from "react";

const BlockedUserCard = () => {
  const { user } = useAuth();
  const [blockedStatus, setBlockedStatus] = useState({}); // State to track blocked status for each user

  // Check if there are blocked users and map over them
  const blockedUsers = user?.blockedUsers || [];

  const toggleBlockUnblock = async (blockedUser) => {
    try {
      await toggleUserBlock(blockedUser._id);
      setBlockedStatus((prevStatus) => ({
        ...prevStatus,
        [blockedUser._id]: !prevStatus[blockedUser._id],
      }));
      toast.success(
        `${blockedStatus[blockedUser._id] ? "Blocked" : "Unblocked"}`
      );
    } catch (error) {
      toast.error("Failed to update block status");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {blockedUsers.length > 0 ? (
        blockedUsers.map(({ user: blockedUser }) => (
          <div
            key={blockedUser._id} // Using a unique identifier
            className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-sm hover:shadow-tertiary transition-shadow duration-300 ease-in-out mb-4"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-300 shadow-lg">
              {blockedUser?.avatar ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/${blockedUser.avatar}`}
                  width={100}
                  height={100}
                  priority={true}
                  className="object-cover w-full h-full"
                  alt={`${blockedUser.name}'s Avatar`} // More descriptive alt text
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }} // Handle error loading image
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span>No Image</span>
                </div>
              )}
            </div>
            <div className="px-2">
              {blockedUser?.name && (
                <p className="text-base font-medium text-gray-800 dark:text-gray-200 leading-tight">
                  {blockedUser.name}
                </p>
              )}
              {blockedUser?.username && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-none">
                  @{blockedUser.username}
                </p>
              )}
            </div>
            <div className="flex-1 flex justify-end">
              <div
                className="text-primary border border-primary px-3 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors duration-300 ease-in-out ml-2"
                onClick={() => toggleBlockUnblock(blockedUser)} // Pass blockedUser as an argument
              >
                {blockedStatus[blockedUser._id] ? "Block" : "Unblock "}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No blocked users</p>
      )}
    </div>
  );
};

export default BlockedUserCard;
