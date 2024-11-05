import { useAuth } from "@/context/AuthContext";
import { toggleFollowingUnfollowing } from "@/api/user.api";
import Image from "next/image";
import { toast } from "sonner";
import React, { useState } from "react";

const FollowingUserCard = () => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState({}); // State to track follow/unfollow status for each user

  // Get the list of following users
  const followingUsers = user?.following || [];

  const toggleFollowUnfollow = async (followingUser) => {
    try {
      await toggleFollowingUnfollowing(followingUser._id);
      setIsFollowing((prevStatus) => ({
        ...prevStatus,
        [followingUser._id]: !prevStatus[followingUser._id],
      }));
      toast.success(
        `${isFollowing[followingUser._id] ? "Followed" : "Unfollowed"} ${
          followingUser.name
        } successfully`
      );
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {followingUsers.length > 0 ? (
        followingUsers.map(({ user: followingUser }) => (
          <div
            key={followingUser._id} // Using a unique identifier
            className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-sm transition-shadow duration-300 ease-in-out mb-4"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-300 shadow-lg">
              {followingUser?.avatar ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/${followingUser.avatar}`}
                  width={100}
                  height={100}
                  priority={true}
                  className="object-cover w-full h-full"
                  alt={`${followingUser.name}'s Avatar`}
                  onError={(e) => {
                    e.target.src = "/default-avatar.png"; // Handle error loading image
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span>No Image</span>
                </div>
              )}
            </div>
            <div className="px-2">
              {followingUser?.name && (
                <p className="text-base font-medium text-gray-800 dark:text-gray-200 leading-tight">
                  {followingUser.name}
                </p>
              )}
              {followingUser?.username && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-none">
                  @{followingUser.username}
                </p>
              )}
            </div>
            <div className="flex-1 flex justify-end">
              <div
                className={`text-primary border border-primary px-3 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors duration-300 ease-in-out ml-2 ${
                  isFollowing[followingUser._id] ? "bg-primary text-white" : ""
                }`}
                onClick={() => toggleFollowUnfollow(followingUser)}
              >
                {isFollowing[followingUser._id] ? "Follow" : "Unfollow"}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No following users</p>
      )}
    </div>
  );
};

export default FollowingUserCard;
