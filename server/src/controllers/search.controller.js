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
    }).select("-likes -comments ");

    // Fetch user details for each post
    const postsWithUserDetails = await Promise.all(
      posts.map(async (post) => {
        try {
          const user = await Users.findById(post.createdBy).select(
            "name username _id avatar views"
          );
          return {
            _id: post._id, // Correctly retrieve the _id from the post object
            title: post.title,
            content: post.content,
            banner: post.banner,
            views: post.views,
            user: user || null,
          };
        } catch (userError) {
          console.error("Error fetching user details:", userError);
          return {
            _id: post._id, // Ensure the _id is still included even if user fetch fails
            title: post.title,
            content: post.content,
            banner: post.banner,
            views: post.views,
            user: null, // Handle the case where user details cannot be fetched
          };
        }
      })
    );

    res.status(200).json({ success: true, posts: postsWithUserDetails });
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
