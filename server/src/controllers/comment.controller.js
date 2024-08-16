import { Posts } from "../models/post.model.js";

// Function to add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    console.log(postId, comment, userId);
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      user: userId,
      comment,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get comments with user details
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by its ID
    const post = await Posts.findById(postId).populate({
      path: "comments.user",
      select: "-password -email",
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Return the comments of the post with user details
    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to update a comment
export const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { comment } = req.body;

    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentToUpdate = post.comments.id(commentId);
    if (!commentToUpdate) {
      return res.status(404).json({ message: "Comment not found" });
    }

    commentToUpdate.comment = comment;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    // Find the post by ID
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment by ID
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if comment.user is defined
    if (!comment.user) {
      return res.status(400).json({ message: "Comment userId is not defined" });
    }

    // Check if the user is authorized to delete the comment
    if (comment.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    // Remove the comment from the comments array
    post.comments.pull(commentId);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: error.message });
  }
};
