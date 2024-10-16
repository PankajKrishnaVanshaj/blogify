"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BlogPostCard from "@/components/BlogPostCard";
import { searchPosts } from "@/api/search.api"; // Import the searchPosts function

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || ""; // Get the "query" parameter from the URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return; // If the query is empty, don't fetch data
      setLoading(true);
      try {
        const posts = await searchPosts(query); // Call the API function
        setResults(posts); // Set the results
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults(); // Call the async function inside useEffect
  }, [query]); // The effect will run whenever the "query" changes

  return (
    <div className="container mx-auto py-2">
      {loading ? (
        <div className="flex justify-center my-4">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
          {results.length > 0 ? (
            results.map((post) => (
              <BlogPostCard key={post._id} post={post} /> // Ensure the unique key is post._id
            ))
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

export default Search;
