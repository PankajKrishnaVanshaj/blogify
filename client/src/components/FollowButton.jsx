import axios from "axios";
import { ImUserCheck } from "react-icons/im";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { toast } from "sonner"; // Import toast from Sonner Toast
import { useAuth } from "@/context/AuthContext";

const FollowButton = ({ userId }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(userId?.followers?.length || 0); // Safe access and default value
  const token = Cookies.get("token");

  useEffect(() => {
    if (user?.following) {
      setIsFollowing(
        user.following.some((f) => f.user.toString() === userId._id.toString())
      );
    }
  }, [user, userId]);

  // useEffect(() => {
  //   const fetchFollowStatus = async () => {
  //     try {
  //       if (!token) {
  //         console.error("No token found");
  //         return;
  //       }

  //       const response = await axios.get(
  //         `http://localhost:55555/api/v1/users/user/${user._id}/followers-status`, // Use user._id for API call
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       setIsFollowing(response.data.isFollowing);
  //     } catch (error) {
  //       console.error("Error fetching follow status:", error);
  //     }
  //   };

  //   if (user && user._id) {
  //     fetchFollowStatus();
  //   }
  // }, [token, user]);

  const toggleFollowUnfollow = async () => {
    try {
      if (!token) {
        toast.error("Login first");
        return;
      }

      const response = await axios.post(
        `http://localhost:55555/api/v1/users/user/${userId._id}/toggle-follow-unfollow`, // Use user._id for API call
        {}, // body is empty
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the following status and follower count
        setIsFollowing(!isFollowing);
        setFollowers(isFollowing ? followers - 1 : followers + 1);

        // Show the correct toast message
        toast(`You ${isFollowing ? "unfollowed" : "followed"} ${userId.name}`);
      }
    } catch (error) {
      console.error("Error toggling follow/unfollow:", error);
    }
  };

  return (
    <div className="flex items-center flex-col">
      <div className="flex items-center text-sm font-semibold text-gray-600 font-mono gap-1">
        <ImUserCheck size={14} />
        {followers}
      </div>
      <button
        className="px-2 border rounded-full text-sm font-light"
        onClick={toggleFollowUnfollow}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default FollowButton;
