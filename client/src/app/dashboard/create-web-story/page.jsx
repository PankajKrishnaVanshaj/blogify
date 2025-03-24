"use client";
import React, { useState } from "react";
import WebStoryEditor from "./_components/WebStoryEditor";
import WebStoryPreview from "./_components/WebStoryPreview";
import WebStorySlideEditor from "./_components/WebStorySlideEditor";
import WebStorySlidePreview from "./_components/WebStorySlidePreview";
import { createWebStory } from "@/api/webStory.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateWebStory = () => {
  const router = useRouter();

  const [story, setStory] = useState({
    title: "",
    description: "",
    coverImage: "",
    category: "",
    tags: [],
  });

  const [slides, setSlides] = useState([
    { content: "", media: "", duration: 5 },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSlideEditing, setIsSlideEditing] = useState(false);

  const validateStoryDetails = () => {
    if (!story.title.trim()) return "Title is required.";
    if (!story.description.trim()) return "Description is required.";
    if (story.tags.length === 0) return "At least one tag is required.";
    if (!story.category.trim()) return "Category is required.";
    return null;
  };

  const handleNext = () => {
    const errorMessage = validateStoryDetails();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }
    setIsSlideEditing(true);
  };

  const handleSubmit = async () => {
    if (!slides.length) {
      toast.error("Please add at least one slide to your story.");
      return;
    }

    const webStory = {
      ...story,
      slides,
    };

    const formData = new FormData();
    formData.append("title", webStory.title);
    formData.append("description", webStory.description);
    formData.append("coverImage", webStory.coverImage); // Ensure this is a file or valid URL.
    formData.append("category", webStory.category);
    formData.append("tags", JSON.stringify(webStory.tags));
    formData.append("storySlides", JSON.stringify(webStory.slides));

    try {
      const response = await createWebStory(formData);
      toast.success("Web Story submitted successfully!");
      router.push("/dashboard/all-web-stories");

      // console.log("Response:", response.data);
    } catch (error) {
      // console.error("Error submitting web story:", error);
      toast.error("An error occurred while submitting the web story.");
    }
  };

  return (
    <div className="flex h-screen flex-wrap">
      {isSlideEditing ? (
        <>
          <div className="w-full md:w-1/2 flex flex-col p-4">
            <button
              className="mb-4 bg-primary text-white py-2 px-4 rounded hover:bg-pink-600 self-start"
              onClick={handleSubmit}
              aria-label="Submit Web Story"
            >
              Submit Web Story
            </button>
            <div className="flex-1 flex flex-col">
              <WebStorySlideEditor
                slides={slides}
                setSlides={setSlides}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col p-4">
            <div className="flex-1 flex flex-col">
              <WebStorySlidePreview
                slides={slides}
                currentIndex={currentIndex}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full md:w-1/2 flex flex-col p-4">
            <button
              className="mb-4 bg-secondary text-white py-2 px-4 rounded hover:bg-blue-600 self-start"
              onClick={handleNext}
              aria-label="Proceed to Edit Slides"
            >
              Next
            </button>
            <div className="flex-1 flex flex-col">
              <WebStoryEditor story={story} setStory={setStory} />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col p-4">
            <div className="flex-1 flex flex-col">
              <WebStoryPreview story={story} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateWebStory;
