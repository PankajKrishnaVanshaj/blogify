import mongoose from "mongoose";
import { Posts } from "../models/post.model.js";
import Users from "../models/user.model.js";

// Fetch user by ID or username and their posts
export const getUserByIdOrUsername = async (req, res) => {
  try {
    const { id } = req.params;

    let query = {};

    // Check if `id` is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id; // Search by _id if it's a valid ObjectId
    } else {
      query.username = id; // Otherwise, search by username
    }

    // Find the user by either ID or username, excluding sensitive fields
    const user = await Users.findOne(query).select(
      "-password -email -notifications -bookMarks -blockedUsers"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch posts by the user's ID
    const posts = await Posts.find({ createdBy: user._id });

    // Return the user with user details and posts
    res.status(200).json({ ...user.toObject(), posts });
  } catch (err) {
    console.error("Error fetching user by ID or username:", err);
    res.status(500).json({ message: "Error fetching user." });
  }
};

export const followersStatus = async (req, res) => {
  try {
    const userIdToFollow = new mongoose.Types.ObjectId(req.params.id);
    const userId = new mongoose.Types.ObjectId(req.user._id); // Assuming user ID is available in the request

    if (userId.equals(userIdToFollow)) {
      return res
        .status(400)
        .json({ message: "You cannot follow/unfollow yourself" });
    }

    const [user, userToFollow] = await Promise.all([
      Users.findById(userId),
      Users.findById(userIdToFollow),
    ]);

    if (!user || !userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing =
      Array.isArray(user.following) &&
      user.following.some((f) => f.user.equals(userIdToFollow));

    res.status(200).json({
      message: isFollowing ? "User is following" : "User is not following",
      isFollowing,
    });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Follow or unfollow a user
export const toggleFollowUnfollow = async (req, res) => {
  try {
    const userIdToFollow = new mongoose.Types.ObjectId(req.params.id);
    const userId = new mongoose.Types.ObjectId(req.user._id); // Assuming user ID is available in the request

    if (userId.equals(userIdToFollow)) {
      return res
        .status(400)
        .json({ message: "You cannot follow/unfollow yourself" });
    }

    const [user, userToFollow] = await Promise.all([
      Users.findById(userId),
      Users.findById(userIdToFollow),
    ]);

    if (!user || !userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing =
      Array.isArray(user.following) &&
      user.following.some((f) => f.user.equals(userIdToFollow));

    if (isFollowing) {
      // Unfollow the user
      await Promise.all([
        Users.updateOne(
          { _id: userId },
          { $pull: { following: { user: userIdToFollow } } }
        ),
        Users.updateOne(
          { _id: userIdToFollow },
          { $pull: { followers: { user: userId } } }
        ),
      ]);
      return res.status(200).json({ message: "User unfollowed" });
    } else {
      // Follow the user
      const now = new Date();
      await Promise.all([
        Users.updateOne(
          { _id: userId },
          { $push: { following: { user: userIdToFollow, createdAt: now } } }
        ),
        Users.updateOne(
          { _id: userIdToFollow },
          { $push: { followers: { user: userId, createdAt: now } } }
        ),
      ]);
      return res.status(200).json({ message: "User followed" });
    }
  } catch (error) {
    console.error("Error in follow/unfollow operation:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Block or unblock a user
export const toggleBlockUnblock = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the URL
    const userIdToBlock = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
    const userId = req.user?._id; // Assuming user ID is available in the request from middleware

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID missing." });
    }

    if (!userIdToBlock) {
      return res.status(400).json({ message: "Invalid user ID provided." });
    }

    if (userId.equals(userIdToBlock)) {
      return res
        .status(400)
        .json({ message: "You cannot block/unblock yourself." });
    }

    // Find both users
    const [user, userToBlock] = await Promise.all([
      Users.findById(userId),
      Users.findById(userIdToBlock),
    ]);

    if (!user) {
      return res.status(404).json({ message: "Your account not found." });
    }

    if (!userToBlock) {
      return res
        .status(404)
        .json({ message: "User to block/unblock not found." });
    }

    // Check if the user is already blocked
    const isBlocked =
      Array.isArray(user.blockedUsers) &&
      user.blockedUsers.some((f) => f.user.equals(userIdToBlock));

    if (isBlocked) {
      // Unblock the user
      await Users.updateOne(
        { _id: userId },
        { $pull: { blockedUsers: { user: userIdToBlock } } } // Removed `createdAt: now`
      );
      return res.status(200).json({ message: "User unblocked successfully." });
    } else {
      // Block the user
      const now = new Date(); // Defined only when blocking
      await Users.updateOne(
        { _id: userId },
        { $push: { blockedUsers: { user: userIdToBlock, createdAt: now } } }
      );
      return res.status(200).json({ message: "User blocked successfully." });
    }
  } catch (error) {
    console.error("Error in block/unblock operation:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
