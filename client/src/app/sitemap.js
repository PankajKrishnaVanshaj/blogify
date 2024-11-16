import { fetchAllPosts } from "@/api/blogPost.api";

export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
}

export default async function sitemap({ id }) {
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000;
  const end = start + 50000;

  // Fetch all posts
  const products = await fetchAllPosts();

  // Ensure you're mapping over the products array correctly
  return products.slice(start, end).map((product) => ({
    url: `${"https://blogify.pankri.com"}/${product._id.toString()}/post`, // Use product instead of post
    lastModified: product.date,
  }));
}
