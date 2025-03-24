import { useAuth } from "@/context/AuthContext";
import { toggleFollowingUnfollowing } from "@/api/user.api";
import Image from "next/image";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";

const FollowersUserCard = () => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState({});

  // Get the list of follower users
  const followerUsers = user?.followers || [];

  useEffect(() => {
    if (user?.following && followerUsers.length > 0) {
      const followingStatus = followerUsers.reduce(
        (acc, { user: followerUser }) => {
          const isFollowed = user.following.some(
            (f) => f.user._id.toString() === followerUser._id.toString()
          );
          acc[followerUser._id] = isFollowed;
          return acc;
        },
        {}
      );

      setIsFollowing(followingStatus);
    }
  }, [user, followerUsers]);

  const toggleFollowUnfollow = async (followerUser) => {
    try {
      await toggleFollowingUnfollowing(followerUser._id);
      setIsFollowing((prevStatus) => ({
        ...prevStatus,
        [followerUser._id]: !prevStatus[followerUser._id],
      }));

      toast.success(
        `${isFollowing[followerUser._id] ? "Unfollowed" : "Followed"} ${
          followerUser.name
        } successfully`
      );
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {followerUsers.length > 0 ? (
        followerUsers.map(({ user: followerUser }) => (
          <div
            key={followerUser._id}
            className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-sm transition-shadow duration-300 ease-in-out"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-300 shadow-lg">
              {followerUser?.avatar ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/${followerUser.avatar}`}
                  width={100}
                  height={100}
                  priority={true}
                  className="object-cover w-full h-full"
                  alt={`${followerUser.name}'s Avatar`}
                  onError={(e) => {
                    e.target.src = "/default-avatar.png"; // Fallback image on error
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span>No Image</span>
                </div>
              )}
            </div>
            <div className="px-2">
              <p className="text-base font-medium text-gray-800 dark:text-gray-200 leading-tight">
                {followerUser.name || "Unknown Name"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-none">
                @{followerUser.username || "Unknown Username"}
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                className={`text-primary border border-primary px-3 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors duration-300 ease-in-out ml-2 ${
                  isFollowing[followerUser._id] ? "bg-primary text-white" : ""
                }`}
                onClick={() => toggleFollowUnfollow(followerUser)}
              >
                {isFollowing[followerUser._id] ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No followers</p>
      )}
    </div>
  );
};

export default FollowersUserCard;
