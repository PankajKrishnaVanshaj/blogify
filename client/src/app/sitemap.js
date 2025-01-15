import { fetchAllPosts } from "@/api/blogPost.api";
import { fetchAllMedias } from "@/api/media.api";

export default async function sitemap() {
  const posts = await fetchAllPosts();
  const medias = await fetchAllMedias();

  const postUrls = posts.map((post) => ({
    url: `${"https://blogify.pankri.com"}/${post._id.toString()}/post`, 
    lastModified: new Date(), // Use the post's last modified date
    changeFrequency: "daily", // Posts can change frequently
    priority: 0.5, // Default priority for posts
  }));

  const mediaUrls = medias.map((media) => ({
    url: `${"https://blogify.pankri.com"}/${media._id.toString()}/media`, 
    lastModified: new Date(), // Use the media's last modified date
    changeFrequency: "weekly", // Media might change less frequently
    priority: 0.7, // Higher priority for media
  }));

  return [...postUrls, ...mediaUrls]; // Combine both post and media URLs
}
