import { fetchAllPosts } from "@/api/blogPost.api";

export default async function sitemap() {
  const posts = await fetchAllPosts();

  const postUrls = posts.map((post) => ({
    url: `${"https://blogify.pankri.com"}/${post._id.toString()}/post`, // Constructing the post URL
    lastModified: post.date, // Use the post's last modified date
    changeFrequency: "daily", // Posts can change frequently
    priority: 0.6, // Default priority for posts
  }));

  return [...postUrls];
}
