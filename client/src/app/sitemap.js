import { fetchAllPosts } from "@/api/blogPost.api";

export default async function sitemap() {
  let posts;
  try {
    posts = await fetchAllPosts();
    // console.log("Fetched posts:", posts); // Log the fetched posts for debugging
  } catch (error) {
    console.error("Error fetching posts:", error);
    return []; // Return an empty array if there is an error fetching posts
  }

  if (!posts || posts.length === 0) {
    console.log("No posts found, returning empty sitemap.");
    return []; // Return an empty array if no posts are found
  }

  const postUrls = posts.map((post) => {
    const lastModifiedDate = new Date(post.date);
    const lastmod = !isNaN(lastModifiedDate)
      ? lastModifiedDate.toISOString()
      : new Date().toISOString();

    return {
      loc: `https://blogify.pankri.com/${post._id.toString()}/post`,
      lastmod,
      changefreq: "daily",
      priority: 0.6,
    };
  });

  return postUrls;
}
