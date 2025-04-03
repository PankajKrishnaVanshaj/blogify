import { ImUserCheck } from "react-icons/im";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { toggleFollowingUnfollowing } from "@/api/user.api";

const FollowButton = ({ userId }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(userId?.followers?.length || 0);

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
      // Call the service function to toggle follow/unfollow
      const response = await toggleFollowingUnfollowing(userId._id);

      if (response.success) {
        setIsFollowing((prev) => !prev); // Toggle follow status
        setFollowers((prev) => (isFollowing ? prev - 1 : prev + 1)); // Update follower count
        // Use the API-provided message or fallback to a dynamic one
        const successMessage = response.message || `You ${isFollowing ? "unfollowed" : "followed"} ${userId.name}`;
        toast.success(successMessage);
      } else {
        // Show error message from API if success is false
        toast.error(response.message || "Failed to toggle follow/unfollow");
      }
    } catch (error) {
      // Handle unexpected errors (e.g., network issues)
      console.error("Unexpected error toggling follow/unfollow:", error);
      toast.error("An unexpected error occurred while toggling follow/unfollow");
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