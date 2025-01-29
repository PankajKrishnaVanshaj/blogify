import { fetchSitemapPosts } from "@/api/blogPost.api";
import { fetchSitemapWebStories } from "@/api/webStory.api";

// Generic URL generator for posts/stories
const generateUrls = (items, pathPrefix, options) => {
  return items
    .map((item) => {
      // Validate required fields
      if (!item?._id || (!item.updatedAt && !item.createdAt)) return null;

      // Parse last modified date
      const lastModified = new Date(item.updatedAt || item.createdAt);
      if (isNaN(lastModified)) return null;

      return {
        url: `https://blogify.pankri.com/${item._id.toString()}/${pathPrefix}`,
        lastModified,
        ...options,
      };
    })
    .filter(Boolean); // Remove null entries
};

export default async function sitemap() {
  try {
    // Fetch data
    const [posts, webStories] = await Promise.all([
      fetchSitemapPosts(),
      fetchSitemapWebStories(),
    ]);

    // Generate URLs
    const postUrls = generateUrls(posts, "post", {
      changeFrequency: "daily",
      priority: 0.8,
    });

    const webStoryUrls = generateUrls(webStories, "web-story", {
      changeFrequency: "weekly",
      priority: 0.6,
    });

    return [...postUrls, ...webStoryUrls];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [];
  }
}
