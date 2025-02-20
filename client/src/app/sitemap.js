import { fetchSitemapPosts } from "@/api/blogPost.api";
import { fetchSitemapWebStories } from "@/api/webStory.api";

export default async function sitemap() {
  const baseUrl = "https://blogify.pankri.com";
  let sitemapEntries = [];

  try {
    // Fetch posts
    const posts = await fetchSitemapPosts();
    if (!Array.isArray(posts)) {
      throw new Error("Invalid posts data format: Expected an array");
    }

    // Map posts to sitemap entries
    const postEntries = posts.map((item) => ({
      url: `${baseUrl}/${item.slug}/post`,
      lastModified: item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    sitemapEntries = sitemapEntries.concat(postEntries);
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
  }

  try {
    // Fetch Web Stories
    const webStories = await fetchSitemapWebStories();
    if (!Array.isArray(webStories)) {
      throw new Error("Invalid Web Stories data format: Expected an array");
    }

    // Map Web Stories to sitemap entries
    const webStoryEntries = webStories.map((story) => ({
      url: `${baseUrl}/${story.slug}/web-story`,
      lastModified: story.updatedAt ? new Date(story.updatedAt).toISOString() : new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0, // Higher priority for Web Stories
    }));

    sitemapEntries = sitemapEntries.concat(webStoryEntries);
  } catch (error) {
    console.error("Error fetching Web Stories for sitemap:", error);
  }

  return sitemapEntries;
}