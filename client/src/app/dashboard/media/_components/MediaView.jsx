import React, { useEffect, useState } from "react";
import MediaCard from "./MediaCard";
import { fetchCreatorMediaAPI } from "@/api/media.api";

const MediaView = ({ onSelectMedia }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetchCreatorMediaAPI();
        if (response && response.length > 0) {
          setMedia(response);
        } else {
          setError("No media found.");
        }
      } catch (err) {
        setError("No medias found for this user.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const handleDeleteMedia = (mediaId) => {
    setMedia((prevMedia) => prevMedia.filter((item) => item._id !== mediaId));
  };

  
  return (
    <div className="flex flex-wrap justify-center items-center gap-5 my-5">
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : media.length > 0 ? (
        media.map((item) => (
          <MediaCard
            key={item._id}
            media={item}
            onSelectMedia={onSelectMedia}
            onDeleteMedia={handleDeleteMedia} // Pass the delete handler
          />
        ))
      ) : (
        <div>No media available.</div>
      )}
    </div>
  );
};

export default MediaView;

