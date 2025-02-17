import { fetchSitemapPosts } from "@/api/blogPost.api";

export default async function sitemap() {
  try {
    // Fetch the posts
    const pages = await fetchSitemapPosts();

    // Ensure the data is an array and contains the expected properties
    if (!Array.isArray(pages)) {
      throw new Error("Invalid data format: Expected an array");
    }

    // Map over each post to create the sitemap
    return pages.map((item) => ({
      url: `https://blogify.pankri.com/${item.slug}/post`, // Ensure `slug` is a valid property
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
