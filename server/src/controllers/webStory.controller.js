import mongoose from "mongoose";
import { WebStory } from "../models/webStory.model.js";

// Create a new Web Story
export const createWebStory = async (req, res) => {
  try {
    const { title, description, coverImage, category, tags, storySlides } =
      req.body;
    const createdBy = req.user._id;
    const isCreator = req.user ? req.user.isCreator : false;

    if (!title || !description || !storySlides) {
      return res
        .status(400)
        .json({ message: "Bad Request. Required fields missing." });
    }
    if (!createdBy) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }
    if (!isCreator) {
      return res.status(403).json({
        message: "Forbidden. You are not authorized to create web stories.",
      });
    }

    const newWebStory = new WebStory({
      title,
      description,
      coverImage,
      storySlides: Array.isArray(storySlides)
        ? storySlides
        : JSON.parse(storySlides),
      category,
      tags: Array.isArray(tags) ? tags : JSON.parse(tags),
      createdBy,
    });

    const savedWebStory = await newWebStory.save();
    res.status(201).json({
      success: true,
      message: "Web story created successfully",
      data: savedWebStory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create web story",
      error: error.message,
    });
  }
};

// Get all Web Stories
export const getAllWebStories = async (req, res) => {
  try {
    const { page = 1, limit = 2, category } = req.query;
    const decodedCategory = category ? decodeURIComponent(category) : null;
    const query = decodedCategory ? { category: decodedCategory } : {};

    const webStories = await WebStory.find(query)
      .sort({ createdAt: -1 })
      .select("-tags -comments -likes")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate({ path: "createdBy", select: "_id name username avatar" });

    if (!webStories.length) {
      return res.status(404).json({ message: "No web stories found." });
    }

    const totalWebStories = await WebStory.countDocuments(query);
    const totalPages = Math.ceil(totalWebStories / limit);

    res.status(200).json({
      success: true,
      data: webStories,
      totalWebStories,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve web stories",
      error: error.message,
    });
  }
};

// Get a single Web Story by ID
export const getWebStoryById = async (req, res) => {
  try {
    const webStoryId = req.params.id;
    const webStory = await WebStory.findByIdAndUpdate(
      webStoryId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!webStory) {
      return res.status(404).json({ message: "Web story not found." });
    }

    res.status(200).json(webStory);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve web story",
      error: error.message,
    });
  }
};

// Get Web Stories by Creator
export const getWebStoryByCreator = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is missing or invalid.",
    });
  }

  try {
    // Query the database for web stories created by the user
    const webStories = await WebStory.find({ createdBy: userId }).lean();

    // If no web stories are found, return a 404 response
    if (!webStories || webStories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No web stories found for the authenticated user.",
      });
    }

    // Return the fetched web stories
    return res.status(200).json({
      success: true,
      message: "Web stories retrieved successfully.",
      data: webStories,
    });
  } catch (error) {
    console.error("Error in getWebStoryByCreator:", error);

    // Log the stack trace for better debugging
    console.error(error.stack);

    // Return a 500 error with details for debugging
    return res.status(500).json({
      success: false,
      message: "Internal server error in fetching web stories.",
      error: error.message,
      stack: error.stack, // Optionally include the stack trace in the response (for debugging purposes)
    });
  }
};

// Update a Web Story
export const updateWebStory = async (req, res) => {
  try {
    const webStoryId = req.params.id;
    const createdBy = req.user ? req.user._id : null;
    const { title, description, coverImage, category, tags, storySlides } =
      req.body;

    const webStory = await WebStory.findById(webStoryId);

    if (!webStory) {
      return res.status(404).json({ message: "Web story not found." });
    }
    if (webStory.createdBy.toString() !== createdBy.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this web story." });
    }

    webStory.title = title || webStory.title;
    webStory.coverImage = coverImage || webStory.coverImage;
    webStory.tags = tags
      ? Array.isArray(tags)
        ? tags
        : JSON.parse(tags)
      : webStory.tags;
    webStory.storySlides = storySlides
      ? Array.isArray(storySlides)
        ? storySlides
        : JSON.parse(storySlides)
      : webStory.storySlides;
    webStory.category = category || webStory.category;
    webStory.description = description || webStory.description;

    const updatedWebStory = await webStory.save();

    res.status(200).json({
      success: true,
      message: "Web story updated successfully",
      data: updatedWebStory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update web story",
      error: error.message,
    });
  }
};

// Delete a Web Story
export const deleteWebStory = async (req, res) => {
  try {
    const webStoryId = req.params.id;
    const userId = req.user._id;
    const webStory = await WebStory.findById(webStoryId);

    if (!webStory) {
      return res.status(404).json({ message: "Web story not found." });
    }
    if (webStory.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this web story." });
    }

    await WebStory.findByIdAndDelete(webStoryId);

    res.status(200).json({
      success: true,
      message: "Web story deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete web story",
      error: error.message,
    });
  }
};

export const suggestionWebStoryByCategory = async (req, res) => {
  try {
  } catch (error) {}
};