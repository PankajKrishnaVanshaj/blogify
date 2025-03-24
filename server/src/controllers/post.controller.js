import { Posts } from "../models/post.model.js";
import Users from "../models/user.model.js";
import mongoose from "mongoose";
import {
  deleteNotification,
  markNotificationAsRead,
  notifyFollowers,
} from "../services/notification.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const createdBy = req.user ? req.user._id : null;
    const isCreator = req.user ? req.user.isCreator : false;
    const { title, tags, category, content, banner } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Bad Request. Required fields missing." });
    }
    if (!createdBy) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    if (!isCreator) {
      return res.status(403).json({
        message: "Forbidden. You are not authorized to create posts.",
      });
    }

    const newPost = new Posts({
      title,
      banner,
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

    const { title, tags, category, content, banner } = req.body;

    // Update post fields
    post.title = title || post.title;
    post.banner = banner || post.banner;
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
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
    const skip = (page - 1) * limit;

    const posts = await Posts.find({ createdBy })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Posts.countDocuments({ createdBy });

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this user." });
    }

    res.status(200).json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching posts by user:", err);
    res.status(500).json({ message: "Error fetching posts." });
  }
};

// Get post by ID with user details
export const getPostByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Validate if identifier is a valid MongoDB ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);

    // Construct query based on identifier type
    const query = isObjectId
      ? { _id: new mongoose.Types.ObjectId(identifier) }
      : { slug: identifier };

    // Find post and increment views in one query
    const post = await Posts.findOneAndUpdate(
      query,
      { $inc: { views: 1 } }, // Increment views
      { new: true } // Return updated document
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Fetch user details for the post creator
    const user = await Users.findById(post.createdBy).select("-password -email");

    // Return the post with user details
    res.status(200).json({ ...post.toObject(), user });
  } catch (err) {
    console.error("Error fetching post by ID or slug:", err);
    res.status(500).json({ message: "Error fetching post." });
  }
};


export const getSitemapPosts = async (req, res) => {
  try {
    const posts = await Posts.find().sort({ createdAt: -1 }).lean();
    if (!posts.length) {
      return res.status(404).json({ message: "No posts found." });
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// Get all posts with user details, pagination, and category filtering
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    // Decode the category if it exists
    const decodedCategory = category ? decodeURIComponent(category) : null;

    // Build query based on the decoded category
    const query = decodedCategory ? { category: decodedCategory } : {};

    const posts = await Posts.find(query)
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .select("-tags -comments -likes")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate({
        path: "createdBy",
        select: "_id name username avatar",
      });

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found." });
    }

    const totalPosts = await Posts.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      posts,
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

    // Delete the post
    await Posts.findByIdAndDelete(postId);
    await deleteNotification(postId);
    // Remove postId from all users' book mark
    await Users.updateMany(
      { "bookMarks.postId": postId },
      { $pull: { bookMarks: { postId: postId } } }
    );

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
