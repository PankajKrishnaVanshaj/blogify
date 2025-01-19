import { useState, useEffect } from "react";
import WebStoryCard from "./WebStoryCard";
import { useParams } from "next/navigation";
import axios from "axios"; // Import axios

const WebStorySuggestion = ({ category }) => {
  const { creator: webStoryId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webStories, setWebStories] = useState([]);

 
  return (
    <div className="p-2">
      {isLoading && <p>Loading suggestions...</p>}
      {!isLoading && !error && webStories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {webStories
            .filter((currentWebStory) => currentWebStory._id !== webStoryId) // Skip the web story with the matching ID
            .map((filteredWebStory) => (
              <WebStoryCard
                key={filteredWebStory._id}
                webStory={filteredWebStory}
              />
            ))}
        </div>
      ) : (
        !isLoading && !error && <p>No suggestions available.</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default WebStorySuggestion;
