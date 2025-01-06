import { fetchAllPosts } from "@/api/blogPost.api";

export default async function sitemap() {
  try {
    const posts = await fetchAllPosts();

    if (!posts || posts.length === 0) {
      console.log("No posts found");
      return []; // Return an empty array if no posts are found
    }

    const postUrls = posts.map((post) => ({
      url: `${"https://blogify.pankri.com"}/${post._id.toString()}/post`,
      lastModified: post.lastModified || new Date(), // Use actual lastModified if available
      changeFrequency: "daily",
      priority: 0.5,
    }));

    return [...postUrls];
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
    return []; // Return an empty array if an error occurs
  }
}
