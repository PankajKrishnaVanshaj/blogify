import { Posts } from "../models/post.model.js";
import Users from "../models/user.model.js";

// Suggestion API
export const searchSuggestion = async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    // Search for posts by title or content
    const posts = await Posts.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    }).select("title content");

    // Return the titles and content snippets as suggestions
    const suggestions = posts.map((post) => ({
      title: post.title,
      content:
        post.content.length > 100
          ? post.content.substring(0, 100) + "..."
          : post.content,
    }));

    res.status(200).json(suggestions); // Directly return the array
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Search API
export const searchPost = async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    // Search for posts by title or content
    const posts = await Posts.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    })
      .select("-likes -comments")
      .populate({
        path: "createdBy",
        select: "name username avatar _id",
        // Include all fields from the Users collection
      });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const suggestionPostsByCategory = async (req, res, next) => {
  try {
    // Extract category from request query
    const { category } = req.query;

    // Log the incoming category for debugging
    // console.log("Incoming category:", category);

    // Validate category
    if (!category || typeof category !== "string") {
      // Create and pass an error to the next middleware
      const error = new Error("Category is required and must be a string");
      error.status = 400; // Bad Request
      return next(error);
    }

    // Decode and sanitize the category string
    const decodedCategory = decodeURIComponent(category.trim());

    // Log the decoded category for debugging
    // console.log("Decoded category:", decodedCategory);

    // Create the query object to match the category
    const query = {
      category: decodedCategory, // Direct match without regex
    };

    // Log the query for debugging
    // console.log("Query object:", query);

    // Fetch posts based on the decoded category and populate the creator's name
    const posts = await Posts.find(query)
      .populate("createdBy", "name username avatar _id") // Populate with creator details
      .sort({ createdAt: -1 })
      .select("-likes -comments") // Exclude likes and comments
      .limit(6); // Limit to 6 posts


    // Log the fetched posts for debugging
    // console.log("Fetched posts:", posts);

    // Respond with the posts that match the category
    res.status(200).json({
      message: `Posts retrieved successfully for category: ${decodedCategory}`,
      posts,
    });
  } catch (err) {
    console.error("Error finding posts by category:", err);
    // Create and pass an error to the next middleware
    const error = new Error(
      "Error finding posts by category: " + (err.message || "Unknown error")
    );
    error.status = 500; // Internal Server Error
    return next(error);
  }
};
