import { fetchSitemapPosts } from "@/api/blogPost.api";
import { fetchSitemapWebStories } from "@/api/webStory.api";

// Generic URL generator for posts/stories
const generateUrls = (items, pathPrefix, options) => {
  return items
    .map((item) => {
      if (!item?.slug) return null;

      // Parse last modified date
      const lastModified = item.updatedAt || item.createdAt;
      if (!lastModified) return null;

      return {
        url: `https://blogify.pankri.com/${item.slug.toString()}/${pathPrefix}`,
        lastModified: new Date(lastModified).toISOString(),
        ...options,
      };
    })
    .filter(Boolean);
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
