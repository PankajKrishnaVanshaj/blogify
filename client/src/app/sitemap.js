import { fetchSitemapPosts } from "@/api/blogPost.api";
import { fetchSitemapWebStories } from "@/api/webStory.api";

const BASE_URL = "https://blogify.pankri.com";
const DEFAULT_CHANGE_FREQ = "daily";
const POST_PRIORITY = 0.8;
const STORY_PRIORITY = 1.0; // Higher priority for web stories to encourage indexing
const MIN_POSTS = 50;
const FALLBACK_IMAGE = "blogify.png";

export default async function sitemap() {
  // Utility to get valid identifier
  const getIdentifier = (item) => {
    if (item.slug && typeof item.slug === "string" && item.slug.trim().length > 0) {
      return item.slug.trim();
    }
    if (item._id && typeof item._id === "string" && item._id.trim().length > 0) {
      return item._id.trim();
    }
    console.warn("Item missing valid slug or _id:", item);
    return null;
  };

  // Utility to determine change frequency based on recency
  const getChangeFrequency = (lastModified) => {
    const now = new Date();
    const modified = new Date(lastModified);
    const diffDays = (now - modified) / (1000 * 60 * 60 * 24);
    if (diffDays <= 7) return "daily";
    if (diffDays <= 30) return "weekly";
    return "monthly";
  };

  // Utility to create sitemap entry with image support
  const createEntry = (item, priority, path) => {
    const identifier = getIdentifier(item);
    if (!identifier) return null;

    const lastModified = item.updatedAt || item.createdAt || new Date();
    const url = `${BASE_URL}/${identifier}/${path}`;
    const imageUrl = item.banner || item.coverImage || FALLBACK_IMAGE;

    const entry = {
      url,
      lastModified: new Date(lastModified).toISOString(),
      changeFrequency: getChangeFrequency(lastModified),
      priority,
      image: [
        {
          loc: `https://server.blogify.pankri.com/${imageUrl}`, // Consistent with BASE_URL
          title: item.title || `Untitled ${path}`,
          caption:
            item.excerpt ||
            item.description ||
            item.content?.replace(/<[^>]+>/g, "").slice(0, 100) ||
            "No description available",
        },
      ],
    };

    return entry;
  };

  // Fetch data with Promise.all for parallel execution
  const fetchData = async () => {
    const results = await Promise.allSettled([
      fetchSitemapPosts(),
      fetchSitemapWebStories(),
    ]);

    const posts = results[0].status === "fulfilled" ? results[0].value : [];
    const webStories = results[1].status === "fulfilled" ? results[1].value : [];

    return { posts, webStories };
  };

  try {
    let { posts, webStories } = await fetchData();

    // Validate and sanitize data
    posts = Array.isArray(posts) ? posts : [];
    webStories = Array.isArray(webStories) ? webStories : [];

    if (posts.length === 0) {
      console.warn("No posts retrieved for sitemap");
    }
    if (webStories.length === 0) {
      console.warn("No web stories retrieved for sitemap");
    }

    // Map entries with image support
    const postEntries = posts
      .map((item) => createEntry(item, POST_PRIORITY, "post"))
      .filter(Boolean);

    const webStoryEntries = webStories
      .map((story) => createEntry(story, STORY_PRIORITY, "web-story"))
      .filter(Boolean);

    // Static pages for completeness
    const staticEntries = [
      {
        url: BASE_URL,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 1.0,
      },
      
    ];

    const allEntries = [...staticEntries, ...postEntries, ...webStoryEntries];

    if (allEntries.length < MIN_POSTS) {
      console.warn("Sitemap has fewer than expected entries:", allEntries.length);
    }

    return allEntries;
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return [
      {
        url: BASE_URL,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 1.0,
      },
    ];
  }
}

export const revalidate = 86400; // Revalidate every 24 hours