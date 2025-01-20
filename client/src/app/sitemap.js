import { fetchSitemapPosts } from "@/api/blogPost.api";
import { fetchSitemapWebStories } from "@/api/webStory.api";

export default async function sitemap() {
  try {
    // Fetch blog posts
    const posts = await fetchSitemapPosts();

    // Check if posts is an array or contains a specific structure
    if (!posts || !Array.isArray(posts)) {
      return []; // Return empty sitemap if posts data is invalid
    }

    const postUrls = posts.map((post) => {

      if (!post._id || !post.updatedAt) {
        return null; // Skip invalid post data
      }

      // Ensure that dates are in a valid format
      const lastModified = new Date(post.updatedAt || post.createdAt);
      if (isNaN(lastModified)) {
        return null; // Skip posts with invalid date format
      }

      return {
        url: `https://blogify.pankri.com/${post._id.toString()}/post`, // Construct URL for post
        lastModified,
        changeFrequency: "daily", // Frequency of updates for search engines
        priority: 0.8, // Priority of the post
      };
    }).filter(Boolean); // Filter out any null values from invalid posts

    // Fetch web stories
    const webStories = await fetchSitemapWebStories();

    // Check if webStories is an array or contains a specific structure
    if (!webStories || !Array.isArray(webStories)) {
      return []; // Return empty sitemap if web stories data is invalid
    }

    const webStoryUrls = webStories.map((story) => {

      if (!story._id || !story.updatedAt) {
        return null; // Skip invalid web story data
      }

      // Ensure that dates are in a valid format
      const lastModified = new Date(story.updatedAt || story.createdAt);
      if (isNaN(lastModified)) {
        return null; // Skip web stories with invalid date format
      }

      return {
        url: `https://blogify.pankri.com/${story._id.toString()}/web-story`, // Construct URL for web story
        lastModified,
        changeFrequency: "weekly", // Frequency of updates for search engines
        priority: 0.6, // Priority of the web story
      };
    }).filter(Boolean); // Filter out any null values from invalid web stories

    // If either posts or web stories are empty or invalid, return empty sitemap
    if (postUrls.length === 0 && webStoryUrls.length === 0) {
      return []; // Return empty sitemap if no valid URLs found
    }

    // Return sitemap data for both posts and web stories
    // If returning an array of objects with path and urls doesn't work, let's try returning just the URLs
    const sitemap = [];
    
    // If postUrls exists, add it to sitemap
    if (postUrls.length > 0) {
      sitemap.push(...postUrls);
    }

    // If webStoryUrls exists, add it to sitemap
    if (webStoryUrls.length > 0) {
      sitemap.push(...webStoryUrls);
    }

    return sitemap;

  } catch (error) {
    return []; // Return an empty sitemap in case of errors
  }
}
