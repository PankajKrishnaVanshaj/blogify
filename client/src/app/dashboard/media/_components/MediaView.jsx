import React, { useEffect, useRef, useState } from "react";
import MediaCard from "./MediaCard";
import { fetchCreatorMediaAPI } from "@/api/media.api";

const MediaView = ({ onSelectMedia }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const loadMoreTriggerRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchMedia = async () => {
    if (isFetchingRef.current || page > totalPages) {
      console.log("Fetch skipped:", { page, totalPages, isFetching: isFetchingRef.current });
      return;
    }

    try {
      setIsLoading(true);
      isFetchingRef.current = true;

      const response = await fetchCreatorMediaAPI(page, limit);
      console.log("FetchMedia:", {
        page,
        mediasFetched: response.medias.length,
        totalPages: response.totalPages,
        totalMedias: response.totalMedias,
      });

      if (response && response.medias) {
        // Append new media without filtering (trust backend to avoid duplicates)
        setMedia((prevMedia) => [...prevMedia, ...response.medias]);
        setTotalPages(response.totalPages);
      } else {
        setError("No media found.");
      }
    } catch (err) {
      setError("Failed to fetch medias.");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        console.log("Intersection:", {
          isIntersecting: entry.isIntersecting,
          page,
          totalPages,
          isFetching: isFetchingRef.current,
        });
        if (entry.isIntersecting && !isFetchingRef.current && page < totalPages) {
          setPage((prevPage) => {
            console.log("Incrementing page to:", prevPage + 1);
            return prevPage + 1;
          });
        }
      },
      { threshold: 0.5, rootMargin: "100px" }
    );

    const trigger = loadMoreTriggerRef.current;
    if (trigger) observer.observe(trigger);

    return () => {
      if (trigger) observer.unobserve(trigger);
    };
  }, [totalPages]);

  const handleDeleteMedia = (mediaId) => {
    setMedia((prevMedia) => prevMedia.filter((item) => item._id !== mediaId));
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-5 my-5">
      {isLoading && page === 1 ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : media.length > 0 ? (
        media.map((item) => (
          <MediaCard
            key={item._id}
            media={item}
            onSelectMedia={onSelectMedia}
            onDeleteMedia={handleDeleteMedia}
          />
        ))
      ) : (
        <div>No media available.</div>
      )}

      {page < totalPages && (
        <div ref={loadMoreTriggerRef} className="w-full text-center mt-4 h-10">
          {isLoading && page > 1 ? <div>Loading more...</div> : <span>Load more</span>}
        </div>
      )}
    </div>
  );
};

export default MediaView;