import { fetchAllPosts } from "@/api/blogPost.api";

export default async function sitemap() {
  const posts = await fetchAllPosts();

  const postUrls = posts.map((post) => ({
    url: `${"https://blogify.pankri.com"}/${post._id.toString()}/post`,
    lastModified: new Date(), // Use the post's last modified date
    changeFrequency: "daily", // Posts can change frequently
    priority: 0.5, // Default priority for posts
  }));

  return [...postUrls]; // Combine both post and media URLs
}
