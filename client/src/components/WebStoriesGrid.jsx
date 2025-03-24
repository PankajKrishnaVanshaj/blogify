import React, { useState, useEffect } from "react";
import WebStoryCard from "./WebStoryCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { fetchPaginatedWebStories } from "@/api/webStory.api";

const WebStoriesGrid = () => {
  const [webStories, setWebStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 2; 

  const fetchWebStories = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPaginatedWebStories(page, itemsPerPage);
      setWebStories(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err) {
      console.error("Error fetching web stories:", err);
      setError("Failed to fetch web stories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebStories(currentPage);
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      {error && <div className="text-red-500 text-center my-4">{error}</div>}
      {loading && <div className="text-center my-4">Loading...</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {webStories.map((story, index) => (
            <WebStoryCard key={story._id || index} webStory={story} />
          ))}
        </div>
      )}
      <div className="flex justify-between mx-3 bg-white shadow-inner py-2 px-5 mt-2 rounded-lg">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="py-1.5 px-6 rounded-lg bg-primary text-white hover:bg-pink-800"
          aria-label="left"
        >
          <FaChevronLeft size={23} />
        </button>
        <span className="px-4 py-1 text-xl">{currentPage}</span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="py-1.5 px-6 rounded-lg bg-primary text-white hover:bg-pink-800"
          aria-label="right"
        >
          <FaChevronRight size={23} />
        </button>
      </div>
    </div>
  );
};

export default WebStoriesGrid;
