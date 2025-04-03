"use client";
import React, { useEffect, useState } from "react";
import { getWebStoryById, updateWebStory } from "@/api/webStory.api";
import WebStoryForm from "../_components/WebStoryForm";

const EditWebStory = ({ params }) => {
  const [story, setStory] = useState({
    title: "",
    description: "",
    coverImage: "", 
    category: "",
    tags: [],
  });
  const [slides, setSlides] = useState([{ content: "", media: "", duration: 5 }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSlideEditing, setIsSlideEditing] = useState(false);

  useEffect(() => {
    const fetchWebStory = async () => {
      try {
        const webStory = await getWebStoryById(params?.edit);
        if (webStory) {
          setStory({
            title: webStory.title || "",
            description: webStory.description || "",
            coverImage: webStory.coverImage || "",
            category: webStory.category || "",
            tags: webStory.tags || [],
          });
          setSlides(webStory.storySlides || [{ content: "", media: "", duration: 5 }]);
        }
      } catch (error) {
        console.error("Error fetching web story data:", error);
        toast.error("Failed to fetch web story data.");
      }
    };

    if (params?.edit) {
      fetchWebStory();
    }
  }, [params?.edit]);

  const handleSubmit = async (formData) => {
    const response = await updateWebStory(params?.edit, formData);
    return response; // Return response for WebStoryForm to handle
  };

  return (
    <WebStoryForm
      story={story}
      setStory={setStory}
      slides={slides}
      setSlides={setSlides}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      isSlideEditing={isSlideEditing}
      setIsSlideEditing={setIsSlideEditing}
      onSubmit={handleSubmit}
      isEditing={true}
    />
  );
};

export default EditWebStory;