import path from "path";
import { Posts } from "../models/post.model.js";
import { deleteFile } from "../utils/Files.js";
import Users from "../models/user.model.js";
import mongoose from "mongoose";
import {
  deleteNotification,
  markNotificationAsRead,
  notifyFollowers,
} from "../services/notification.js";

// Create a new post
export const createPost = async (req, res) => {
  let bannerFilename = null;

  try {
    const { title, tags, category, content } = req.body;
    const bannerPath = req.file ? req.file.path : null;
    bannerFilename = bannerPath ? path.basename(bannerPath) : null;
    const createdBy = req.user ? req.user._id : null;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Bad Request. Required fields missing." });
    }
    if (!createdBy) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    const newPost = new Posts({
      title,
      banner: bannerFilename,
      tags: tags ? JSON.parse(tags) : [],
      category,
      content,
      createdBy,
    });

    const savedPost = await newPost.save();
    await notifyFollowers(createdBy, savedPost._id);
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Post creation error:", err);

    if (bannerFilename) {
      deleteFile(bannerFilename, "uploads/banner");
    }

    res.status(500).json({ message: "Error creating post." });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const createdBy = req.user ? req.user._id : null;

  try {
    const post = await Posts.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.createdBy.toString() !== createdBy.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post." });
    }

    const { title, tags, category, content } = req.body;
    let bannerFilename = post.banner; // Default to existing banner filename

    if (req.file) {
      const bannerPath = req.file.path;
      bannerFilename = path.basename(bannerPath);

      // Handle old banner file
      if (post.banner) {
        deleteFile(post.banner, "uploads/banner");
      }
    }

    // Update post fields
    post.title = title || post.title;
    post.banner = bannerFilename;
    post.tags = tags ? JSON.parse(tags) : post.tags;
    post.category = category || post.category;
    post.content = content || post.content;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Post update error:", err);
    res
      .status(500)
      .json({ message: "Error updating post.", error: err.message });
  }
};

// Get posts by user
export const getPostsByUser = async (req, res) => {
  try {
    const createdBy = req.user._id;

    const posts = await Posts.find({ createdBy });

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this user." });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts by user:", err);
    res.status(500).json({ message: "Error fetching posts." });
  }
};

// Get post by ID with user details
export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    // Use findByIdAndUpdate to atomically increment the views count and retrieve the post
    const post = await Posts.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Fetch user details for the post creator
    const user = await Users.findById(post.createdBy).select(
      "-password -email"
    );

    // Return the post with user details
    res.status(200).json({ ...post.toObject(), user });
  } catch (err) {
    console.error("Error fetching post by ID:", err);
    res.status(500).json({ message: "Error fetching post." });
  }
};

// Get all posts with user details, pagination, and category filtering
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const query = category ? { category } : {};

    const posts = await Posts.find(query)
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .select("-tags -comments -likes")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found." });
    }

    const postsWithUserDetails = await Promise.all(
      posts.map(async (post) => {
        const user = await Users.findById(post.createdBy).select(
          "-password -email -following -followers -notifications"
        );
        return { ...post.toObject(), user };
      })
    );

    const totalPosts = await Posts.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      posts: postsWithUserDetails,
      totalPosts,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching all posts:", err);
    res.status(500).json({ message: "Error fetching posts." });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    // Find the post by ID
    const post = await Posts.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Check if the post was created by the user
    if (post.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post." });
    }

    // Delete the banner file if it exists
    if (post.banner) {
      deleteFile(post.banner, "uploads/banner");
    }

    // Delete the post
    await Posts.findByIdAndDelete(postId);
    await deleteNotification(postId);

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    console.error("Error deleting post:", err.message);
    res
      .status(500)
      .json({ message: "Error deleting post.", error: err.message });
  }
};

export const toggleLikeDislike = async (req, res) => {
  try {
    const postId = new mongoose.Types.ObjectId(req.params.id);
    const userId = new mongoose.Types.ObjectId(req.user._id); // Assuming user ID is available in the request

    // Find the post by ID
    const post = await Posts.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.some((like) => like.user.equals(userId));

    if (isLiked) {
      // If already liked, remove the like
      await Posts.updateOne(
        { _id: postId },
        { $pull: { likes: { user: userId } } }
      );
      return res.status(200).json({ message: "Post disliked" });
    } else {
      // If not liked, add the like
      await Posts.updateOne(
        { _id: postId },
        { $push: { likes: { user: userId } } }
      );
      return res.status(200).json({ message: "Post liked" });
    }
  } catch (error) {
    console.error("Error in like/dislike operation:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const LikesStatus = async (req, res) => {
  try {
    const postId = new mongoose.Types.ObjectId(req.params.id);
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const post = await Posts.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.some((like) => like.user.equals(userId));

    res.status(200).json({
      message: isLiked ? "Post is liked" : "Post is not liked",
      isLiked,
    });
  } catch (error) {
    console.error("Error fetching like status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    await markNotificationAsRead(userId, notificationId);

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification:", error);
    res.status(500).json({ error: "Error marking notification" });
  }
};
