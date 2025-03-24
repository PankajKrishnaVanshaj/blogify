"use client";
import { useEffect, useState, useRef } from "react";
import CarouselSection from "@/components/CarouselSection";
import Categories from "@/components/Categories";
import { fetchFilterPosts } from "@/api/blogPost.api";
import dynamic from "next/dynamic";
const BlogPostCard = dynamic(() => import("@/components/BlogPostCard"), {
  ssr: false,
});

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("All");

  const loadMoreTriggerRef = useRef(null); // Reference for the load-more trigger element
  const isFetchingRef = useRef(false); // To prevent multiple fetch triggers

  useEffect(() => {
    const fetchPostsData = async () => {
      if (isFetchingRef.current) return; // Avoid duplicate fetches
      isFetchingRef.current = true;

      setLoading(true);

      try {
        const data = await fetchFilterPosts(page, category);
        setPosts(
          (prevPosts) =>
            page === 1 ? data.posts : [...prevPosts, ...data.posts] // Avoid duplicate appending
        );
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        isFetchingRef.current = false; // Reset the fetch trigger
      }
    };

    fetchPostsData();
  }, [page, category]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    const triggerElement = loadMoreTriggerRef.current;
    if (triggerElement) {
      observer.observe(triggerElement);
    }

    return () => observer.disconnect();
  }, [loading, page, totalPages]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1); // Reset to the first page on category change
    setPosts([]); // Clear existing posts to fetch new ones
  };

  return (
    <main>
      <div>
        <CarouselSection />
      </div>
      <Categories onSelectCategory={handleCategoryChange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
        {posts.length > 0
          ? posts.map((post, index) => (
              <BlogPostCard key={`${post._id}-${index}`} post={post} />
            ))
          : !loading && (
              <p className="text-center text-gray-800 dark:text-gray-200 col-span-full">
                No posts available.
              </p>
            )}
      </div>

      <div className="flex justify-center mt-4">
        <div
          ref={loadMoreTriggerRef}
          className="w-full h-1 bg-transparent" // Invisible element to trigger loading more posts
        />
      </div>

      {loading && (
        <div className="text-center mt-4">
          <p className="text-gray-500 dark:text-gray-300">
            Loading more posts...
          </p>
        </div>
      )}

      {error && <div className="text-red-500">{error}</div>}
    </main>
  );
}
