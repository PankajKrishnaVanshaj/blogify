"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchPosts } from "@/api/search.api";
import dynamic from "next/dynamic";
const BlogPostCard = dynamic(() => import("@/components/BlogPostCard"), {
  ssr: false,
});

const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return;
      setLoading(true);
      try {
        const posts = await searchPosts(query);
        setResults(posts);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto py-2">
      {loading ? (
        <div className="flex justify-center my-4">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
          {results.length > 0 ? (
            results.map((post) => <BlogPostCard key={post._id} post={post} />)
          ) : (
            <div className="text-center text-gray-500">
              No results found. Try a different query.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Search = () => (
  <Suspense fallback={<div>Loading search...</div>}>
    <SearchContent />
  </Suspense>
);

export default Search;
