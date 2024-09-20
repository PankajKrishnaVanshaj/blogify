import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import BlogPostCard from "./BlogPostCard";

const Suggestion = ({ category }) => {
  const { post: postId } = useParams(); // Use 'postId' for clarity
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!category) return; // Exit early if category is null or undefined

      try {
        const response = await axios.get(
          `http://localhost:55555/api/v1/search/suggestion-posts-by-category?category=${encodeURIComponent(
            category
          )}`
        );

        const data = response.data;

        // Log the full data for debugging
        // console.log("Response data:", data);

        // Check if data has 'posts' array
        if (!Array.isArray(data.posts)) {
          throw new Error("Received data is not in the expected format");
        }

        setPosts(data.posts);
        setIsLoading(false); // Set loading to false after successful fetch
        setError(null); // Clear any previous error
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message || "Failed to fetch posts");
        setIsLoading(false); // Set loading to false on error
      }
    };

    fetchPosts();
  }, [category]); // Refetch when the category changes

  return (
    <div className="p-2">
      {isLoading && <p>Loading suggestions...</p>}
      {!isLoading && !error && posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 max-w-7xl mx-auto mb-10">
          {posts
            .filter((currentPost) => currentPost._id !== postId) // Skip the post with the matching ID
            .map((filteredPost) => (
              <BlogPostCard key={filteredPost._id} post={filteredPost} />
            ))}
        </div>
      ) : (
        !isLoading && !error && <p>No suggestions available.</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Suggestion;
