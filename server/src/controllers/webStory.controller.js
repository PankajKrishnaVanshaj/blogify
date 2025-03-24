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

// Get a single Web Story by ID or Slug
export const getWebStoryByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Validate if identifier is a valid MongoDB ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);

    // Construct query based on identifier type
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    // Use findOneAndUpdate to increment views
    const webStory = await WebStory.findOneAndUpdate(
      query,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!webStory) {
      return res.status(404).json({ message: "Web story not found." });
    }

    res.status(200).json(webStory);
  } catch (error) {
    console.error("Error fetching web story:", error);
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
  const { page = 1, limit = 10 } = req.query; // default to page 1 and limit 10

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is missing or invalid.",
    });
  }

  try {
    // Query the database for web stories created by the user with pagination
    const webStories = await WebStory.find({ createdBy: userId })
      .skip((page - 1) * limit) // Skip the previous pages
      .limit(parseInt(limit)) // Limit the number of results per page
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .lean();

    // Get the total count of web stories for pagination
    const totalCount = await WebStory.countDocuments({ createdBy: userId });

    // If no web stories are found, return a 404 response
    if (!webStories || webStories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No web stories found for the authenticated user.",
      });
    }

    // Return the fetched web stories and pagination info
    return res.status(200).json({
      success: true,
      message: "Web stories retrieved successfully.",
      data: webStories,
      totalCount, // Send total count for pagination
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / limit), // Calculate the total number of pages
    });
  } catch (error) {
    console.error("Error in getWebStoryByCreator:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error in fetching web stories.",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const getSitemapWebStories = async (req, res) => {
  try {
    const webStories = await WebStory.find().sort({ createdAt: -1 }).lean();
    if (!webStories.length) {
      return res.status(404).json({ message: "No web-stories found." });
    }

    return res.status(200).json(webStories);
  } catch (error) {
    console.error("Error fetching web-stories for sitemap:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
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
