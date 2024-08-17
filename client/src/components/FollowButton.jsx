import axios from "axios";
import { ImUserCheck } from "react-icons/im";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const FollowButton = ({
  user = {},
  followers,
  isFollowing,
  handleFollowToggle,
}) => {
  const [localFollowers, setLocalFollowers] = useState(followers);
  const [localIsFollowing, setLocalIsFollowing] = useState(isFollowing);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!user._id) {
        console.error("User ID is not available");
        return;
      }

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:55555/api/v1/users/user/${user._id}/followers-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLocalIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetchFollowStatus();
  }, [token, user._id]);

  const toggleFollowUnfollow = async () => {
    if (!user._id) {
      console.error("User ID is not available");
      return;
    }

    if (!token) {
      toast.error("Login First");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:55555/api/v1/users/user/${user._id}/toggle-follow-unfollow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const newIsFollowing = !localIsFollowing;
        const newFollowersCount = newIsFollowing
          ? localFollowers + 1
          : localFollowers - 1;

        setLocalIsFollowing(newIsFollowing);
        setLocalFollowers(newFollowersCount);

        // Display success toast message
        toast(
          `Successfully ${newIsFollowing ? "followed" : "unfollowed"} ${
            user.username
          }`
        );

        // Call the parent handler if provided
        if (handleFollowToggle) {
          handleFollowToggle(newIsFollowing, newFollowersCount);
        }
      }
    } catch (error) {
      console.error("Error toggling follow/unfollow:", error);

      // Display error toast message
      toast.error("Failed to follow/unfollow. Please try again.");
    }
  };

  return (
    <div className="flex items-center flex-col">
      <div className="flex items-center text-sm font-semibold text-gray-600 font-mono gap-1">
        <ImUserCheck size={14} />
        {localFollowers}
      </div>
      <button
        className="px-2 border rounded-full text-sm font-light"
        onClick={toggleFollowUnfollow}
      >
        {localIsFollowing ? "UnFollow" : "Follow"}
      </button>
    </div>
  );
};

export default FollowButton;
