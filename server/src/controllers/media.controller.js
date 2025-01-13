import { Medias } from "../models/media.model";


// Create a new media entry
export const createMedia = async (req, res) => {
  try {
    const { title, description, tags, altText, media, createdBy } = req.body;

    // Create a new media document
    const newMedia = new Medias({
      title,
      description,
      tags,
      altText,
      media,
      createdBy,
    });

    // Save the media document to the database
    const savedMedia = await newMedia.save();
    res.status(201).json({ message: "Media created successfully", media: savedMedia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating media", error: error.message });
  }
};

// Update an existing media entry
export const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, altText, media } = req.body;

    const updatedMedia = await Medias.findByIdAndUpdate(
      id,
      { title, description, tags, altText, media },
      { new: true }
    );

    if (!updatedMedia) {
      return res.status(404).json({ message: "Media not found" });
    }

    res.status(200).json({ message: "Media updated successfully", media: updatedMedia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating media", error: error.message });
  }
};

// Get all media entries
export const getAllMedia = async (req, res) => {
  try {
    const mediaList = await Medias.find().sort({ createdAt: -1 }); // Sorting by createdAt (descending)
    res.status(200).json({ media: mediaList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching media", error: error.message });
  }
};

// Get media by ID
export const getMediaById = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Medias.findById(id);

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    res.status(200).json({ media });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching media", error: error.message });
  }
};

// Delete media entry by ID
export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMedia = await Medias.findByIdAndDelete(id);

    if (!deletedMedia) {
      return res.status(404).json({ message: "Media not found" });
    }

    res.status(200).json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting media", error: error.message });
  }
};

// Search media entries (example of text search using the index)
export const searchMedia = async (req, res) => {
  try {
    const { query } = req.query; // query passed via the URL
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const mediaResults = await Medias.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10); // Limiting results for optimization

    res.status(200).json({ media: mediaResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching media", error: error.message });
  }
};
