import { ImUserCheck } from "react-icons/im";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { toggleFollowingUnfollowing } from "@/api/user.api";

const FollowButton = ({ userId }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(userId?.followers?.length || 0);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Check follow status on component mount or when user/userId changes
  useEffect(() => {
    if (user?.following?.length && userId) {
      const isFollowed = user.following.some(
        (f) => f.user._id === userId._id // Direct comparison of user IDs
      );
      setIsFollowing(isFollowed); // Set follow status correctly
    }
  }, [user, userId]);

  const toggleFollowUnfollow = async () => {
    try {
      if (!token) {
        toast.error("Please log in first");
        return;
      }

      // Call the service function to toggle follow/unfollow
      const response = await toggleFollowingUnfollowing(userId._id);

      if (response) {
        setIsFollowing((prev) => !prev); // Toggle follow status
        setFollowers((prev) => (isFollowing ? prev - 1 : prev + 1)); // Update follower count
        toast(`You ${isFollowing ? "unfollowed" : "followed"} ${userId.name}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex items-center flex-col">
      <div className="flex items-center text-sm font-semibold text-gray-600 font-mono gap-1">
        <ImUserCheck size={14} className="text-primary" />
        {followers}
      </div>
      <button
        className={`px-2 border rounded-full text-sm font-light ${
          isFollowing ? "border-red-500 text-red-500" : "border-primary"
        }`}
        onClick={toggleFollowUnfollow}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default FollowButton;
