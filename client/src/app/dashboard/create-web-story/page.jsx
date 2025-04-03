"use client";
import React, { useState } from "react";
import { createWebStory } from "@/api/webStory.api";
import { useRouter } from "next/navigation";
import WebStoryForm from "./_components/WebStoryForm";

const CreateWebStory = () => {
  const router = useRouter();
  const [story, setStory] = useState({
    title: "",
    description: "",
    coverImage: "", // Assuming this worked as a string/URL in your original code
    category: "",
    tags: [],
  });
  const [slides, setSlides] = useState([{ content: "", media: "", duration: 5 }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSlideEditing, setIsSlideEditing] = useState(false);

  const handleSubmit = async (formData) => {
    const response = await createWebStory(formData);
    router.push("/dashboard/all-web-stories");
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
    />
  );
};

export default CreateWebStory;