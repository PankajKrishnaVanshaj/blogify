import { fetchSitemapPosts } from "@/api/blogPost.api";
import { fetchSitemapWebStories } from "@/api/webStory.api";

const BASE_URL = "https://blogify.pankri.com";
const DEFAULT_CHANGE_FREQ = "daily";
const POST_PRIORITY = 0.8;
const STORY_PRIORITY = 1.0;

export default async function sitemap() {
  // Utility function to get valid identifier
  const getIdentifier = (item) => {
    if (item.slug && typeof item.slug === "string" && item.slug.length > 0) {
      return item.slug;
    }
    if (item._id && typeof item._id === "string" && item._id.length > 0) {
      return item._id;
    }
    console.warn("Item missing valid slug or _id:", item);
    return null;
  };

  // Utility function to format sitemap entry
  const createEntry = (item, priority, path) => {
    const identifier = getIdentifier(item);
    if (!identifier) return null;
    return {
      url: `${BASE_URL}/${identifier}/${path}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date().toISOString(),
      changeFrequency: DEFAULT_CHANGE_FREQ,
      priority,
    };
  };

  // Fetch data with Promise.all for parallel execution
  const fetchData = async () => {
    const results = await Promise.allSettled([
      fetchSitemapPosts(),
      fetchSitemapWebStories(),
    ]);

    return {
      posts: results[0].status === "fulfilled" ? results[0].value : [],
      webStories: results[1].status === "fulfilled" ? results[1].value : [],
    };
  };

  try {
    let { posts, webStories } = await fetchData(); // Changed from const to let

    // Validate data types
    if (!Array.isArray(posts)) {
      console.warn("Posts data is not an array, skipping post entries");
      posts = [];
    }
    if (!Array.isArray(webStories)) {
      console.warn("Web Stories data is not an array, skipping story entries");
      webStories = [];
    }

    // Map entries with filtering for invalid items
    const postEntries = posts.length
      ? posts
          .map((item) => createEntry(item, POST_PRIORITY, "post"))
          .filter(Boolean)
      : [];

    const webStoryEntries = webStories.length
      ? webStories
          .map((story) => createEntry(story, STORY_PRIORITY, "web-story"))
          .filter(Boolean)
      : [];

    return [...postEntries, ...webStoryEntries];

  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return [];
  }
}