import { Medias } from "../models/media.model.js";
import { deleteFile } from "../utils/Files.js";
import path from "path";

// Create a new media entry
const uploadMedia = async (req, res) => {
  let mediaFilename = null;

  try {
    const { title, tags, description } = req.body;
    const mediaPath = req.file ? req.file.path : null;
    mediaFilename = mediaPath ? path.basename(mediaPath) : null;
    const createdBy = req.user ? req.user._id : null;
    const isCreator = req.user ? req.user.isCreator : false;

    if (!title || !tags || !description) {
      return res
        .status(400)
        .json({ message: "Bad Request. Required fields missing." });
    }

    if (!createdBy) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    if (!isCreator) {
      if (mediaFilename) {
        deleteFile(mediaFilename, "uploads");
      }
      return res.status(403).json({
        message: "Forbidden. You are not authorized to upload media.",
      });
    }

    const newMedia = new Medias({
      title,
      media: mediaFilename,
      tags: tags ? JSON.parse(tags) : [],
      description,
      createdBy,
    });

    const savedMedia = await newMedia.save();
    res.status(201).json(savedMedia); // Ensure response with saved data
  } catch (error) {
    // console.error("media upload error:", error.message);

    if (mediaFilename) {
      deleteFile(mediaFilename, "uploads");
    }

    res.status(500).json({ message: "Error uploading media." });
  }
};

// Update media
const updateMedia = async (req, res) => {
  const mediaId = req.params.id;
  const createdBy = req.user ? req.user._id : null;

  try {
    const media = await Medias.findById(mediaId);

    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }

    if (media.createdBy.toString() !== createdBy.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this media." });
    }

    const { title, tags, description } = req.body;
    let mediaFilename = media.media;

    if (req.file) {
      const mediaPath = req.file.path;
      mediaFilename = path.basename(mediaPath);

      // Handle old media file
      if (media.media) {
        deleteFile(media.media, "uploads");
      }
    }

    // Update media fields
    media.title = title || media.title;
    media.media = mediaFilename || media.media;
    media.description = description || media.description;
    media.tags = tags ? JSON.parse(tags) : media.tags;

    const updatedMedia = await media.save();

    // Explicitly include a clear response structure
    res.status(200).json({
      status: "success",
      message: "Media updated successfully.",
      data: updatedMedia,
    });
  } catch (err) {
    // console.error("Media update error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Error updating media.",
      error: err.message,
    });
  }
};

// Get medias by user
const getMediasByCreator = async (req, res) => {
  try {
    const createdBy = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Calculate skip value
    const skip = (pageNum - 1) * limitNum;

    // Fetch medias
    const medias = await Medias.find({ createdBy })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const totalMedias = await Medias.countDocuments({ createdBy });

    // Debugging logs
    console.log({
      pageNum,
      limitNum,
      skip,
      totalMedias,
      mediasReturned: medias.length,
      totalPages: Math.ceil(totalMedias / limitNum),
    });

    if (!medias.length && totalMedias > 0 && skip < totalMedias) {
      return res.status(404).json({ message: "No more medias found for this page." });
    }

    if (!medias.length && totalMedias === 0) {
      return res.status(404).json({ message: "No medias found for this user." });
    }

    res.status(200).json({
      medias,
      totalPages: Math.ceil(totalMedias / limitNum),
      currentPage: pageNum,
      totalMedias,
    });
  } catch (err) {
    console.error("Error fetching medias by user:", err);
    res.status(500).json({ message: "Error fetching medias." });
  }
};


const getAllMedias = async (req, res) => {
  try {
    // Fetch all media records and populate the `createdBy` field
    const medias = await Medias.find().populate({
      path: "createdBy", // The reference field in the Medias model
      select: "_id name username avatar", // Exclude sensitive fields from the populated User
    });

    // If no media found, return a 404 status with a message
    if (!medias.length) {
      return res.status(404).json({ message: "No media found" });
    }

    // Return the media data with a 200 status code
    return res.status(200).json(medias);
  } catch (error) {
    // Handle any errors that might occur during the database query
    // console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMediaById = async (req, res) => {
  try {
    const mediaId = req.params.id;

    const media = await Medias.findByIdAndUpdate(mediaId);

    if (!media) {
      return res.status(404).json({ message: "Media not found." }); // Updated to "Media"
    }

    res.status(200).json(media);
  } catch (err) {
    // console.error("Error fetching media by ID:", err); // Updated error message for clarity
    res.status(500).json({ message: "Error fetching media." });
  }
};

// Delete media
const deleteMedia = async (req, res) => {
  try {
    const mediaId = req.params.id;
    const userId = req.user._id;

    const media = await Medias.findById(mediaId);

    if (!media) {
      return res.status(404).json({ message: "media not found." });
    }

    if (media.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this media." });
    }

    // Delete the media file if it exists
    if (media.media) {
      deleteFile(media.media, "uploads");
    }

    await Medias.findByIdAndDelete(mediaId);

    res.status(200).json({ message: "media deleted successfully." });
  } catch (err) {
    // console.error("Error deleting media:", err.message);
    res
      .status(500)
      .json({ message: "Error deleting media.", error: err.message });
  }
};

export default {
  uploadMedia,
  updateMedia,
  getMediasByCreator,
  getMediaById,
  deleteMedia,
  getAllMedias,
};
