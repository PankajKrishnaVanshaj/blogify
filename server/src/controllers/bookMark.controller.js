import mongoose from "mongoose";
import Users from "../models/user.model.js";

// Check the bookmark status of a post for the user
const BookMarkStatus = async (req, res) => {
  const postId = new mongoose.Types.ObjectId(req.params.postId);
  const userId = new mongoose.Types.ObjectId(req.user._id);
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Find the user by ID
    const user = await Users.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    // Convert postId to ObjectId
    const postObjectId = new mongoose.Types.ObjectId(postId);

    // Check if the post is already in the bookmarks
    const isInBookMark = user.bookMarks.some((item) =>
      item.postId.equals(postObjectId)
    );

    // Respond with the status
    res.status(200).json({
      message: isInBookMark
        ? "Post is in bookmarks"
        : "Post is not in bookmarks",
      isInBookMark,
    });
  } catch (error) {
    console.error("Error fetching bookmark status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Toggle bookmark for a post (add/remove)
const toggleBookMark = async (req, res) => {
  const postId = new mongoose.Types.ObjectId(req.params.postId);
  const userId = new mongoose.Types.ObjectId(req.user._id);
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Find the user by ID
    const user = await Users.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    // Convert postId to ObjectId
    const postObjectId = new mongoose.Types.ObjectId(postId);

    // Check if the post is already in the bookmarks
    const isInBookMark = user.bookMarks.some((item) =>
      item.postId.equals(postObjectId)
    );

    if (isInBookMark) {
      // Remove the post from the bookmarks
      user.bookMarks = user.bookMarks.filter(
        (item) => !item.postId.equals(postObjectId)
      );
    } else {
      // Add the post to the bookmarks
      user.bookMarks.push({ postId: postObjectId });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: isInBookMark
        ? "Post removed from bookmarks"
        : "Post added to bookmarks",
      isInBookMark: !isInBookMark,
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all bookmarks of the user
const getBookMark = async (req, res) => {
  try {
    // Ensure req.user exists and contains _id
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Find the user by ID and populate bookmarks
    const user = await Users.findById(userId)
      .populate({
        path: "bookMarks.postId", // Path to populate
        select: "_id banner title", // Fields to select
      })
      .exec();

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's bookmarks
    res.status(200).json({
      message: "Bookmarks fetched successfully",
      bookMarks: user.bookMarks,
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error.message || error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

export { toggleBookMark, BookMarkStatus, getBookMark };
