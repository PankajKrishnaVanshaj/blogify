import { fetchAllPosts } from "@/api/blogPost.api";

export default async function sitemap() {
  const posts = await fetchAllPosts();

  const postUrls = posts.map((post) => {
    // Ensure that the date is valid before calling toISOString()
    const lastModifiedDate = new Date(post.date);
    const lastmod = !isNaN(lastModifiedDate)
      ? lastModifiedDate.toISOString()
      : new Date().toISOString();

    return {
      loc: `https://blogify.pankri.com/${post._id.toString()}/post`, // URL of the post
      lastmod, // ISO 8601 format, or fallback to current date
      changefreq: "daily", // Frequency of updates
      priority: 0.6, // Default priority
    };
  });

  return postUrls; // For dynamic sitemap generation tools like next-sitemap
}
