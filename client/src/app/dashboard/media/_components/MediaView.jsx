import React, { useEffect, useRef, useState } from "react";
import MediaCard from "./MediaCard";
import { fetchCreatorMediaAPI } from "@/api/media.api";

const MediaView = ({ onSelectMedia }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const loadMoreTriggerRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchMedia = async () => {
    if (isFetchingRef.current || page > totalPages) return;

    try {
      setIsLoading(true);
      isFetchingRef.current = true;

      const response = await fetchCreatorMediaAPI(page, limit);
      if (response && response.medias) {
        setMedia((prevMedia) => {
          const newMedia = response.medias.filter(
            (item) => !prevMedia.some((mediaItem) => mediaItem._id === item._id)
          );
          return [...prevMedia, ...newMedia];
        });
        setTotalPages(response.totalPages);
      } else {
        setError("No media found.");
      }
    } catch (err) {
      setError("Failed to fetch medias.");
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
        if (entry.isIntersecting && !isFetchingRef.current && page < totalPages) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the trigger element is visible
    );

    const trigger = loadMoreTriggerRef.current;
    if (trigger) observer.observe(trigger);

    return () => {
      if (trigger) observer.unobserve(trigger);
    };
  }, [totalPages]); // Re-run if totalPages changes

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
        <div ref={loadMoreTriggerRef} className="w-full text-center mt-4">
          {isLoading && page > 1 ? <div>Loading more...</div> : null}
        </div>
      )}
    </div>
  );
};

export default MediaView;