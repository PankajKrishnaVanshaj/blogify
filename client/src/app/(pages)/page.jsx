"use client";
import { useEffect, useState, useRef } from "react";
import CarouselSection from "@/components/CarouselSection";
import BlogPostCard from "@/components/BlogPostCard";
import axios from "axios";
import Categories from "@/components/Categories";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("All");

  const loadMoreTriggerRef = useRef(null); // Reference for the load-more trigger element

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const categoryParam = category === "All" ? "" : `&category=${category}`;
        const response = await axios.get(
          `http://localhost:55555/api/v1/posts/get-all-posts?page=${page}&limit=10${categoryParam}`
        );
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]); // Append new posts
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
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
    setPage(1); // Reset to first page on category change
    setPosts([]); // Clear existing posts to fetch new ones
  };

  return (
    <main>
      <div>
        <CarouselSection />
      </div>
      <Categories onSelectCategory={handleCategoryChange} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          {posts.length > 0
            ? posts.map((post) => <BlogPostCard key={post._id} post={post} />)
            : !loading && (
                <p className="text-center text-gray-800 dark:text-gray-200 col-span-full">
                  No posts available.
                </p>
              )}
        </div>
        <div className="space-y-4">
          <div className="rounded-lg shadow-lg p-4">
            {/* <PopularPosts /> */}
            ADS
          </div>
          <div className="rounded-lg shadow-lg p-4">
            {/* <PopularCreator /> */}
            ADS
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <div
          ref={loadMoreTriggerRef}
          className="w-full h-1 bg-transparent" // Invisible element to trigger loading more posts
        />
      </div>
    </main>
  );
}
