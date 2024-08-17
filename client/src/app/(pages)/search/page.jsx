"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import BlogPostCard from "@/components/BlogPostCard";

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
        const response = await axios.get(
          "http://localhost:55555/api/v1/search",
          {
            params: { q: query }, // Pass the query to the API as a parameter
          }
        );
        setResults(response.data.posts);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults(); // Call the async function inside useEffect
  }, [query]); // The effect will run whenever the "query" changes

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <div className="flex justify-center my-4">Loading...</div>
      ) : (
        <div className="mt-4">
          {results.length > 0 ? (
            results.map((post, index) => (
              <BlogPostCard key={index} post={post} />
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
