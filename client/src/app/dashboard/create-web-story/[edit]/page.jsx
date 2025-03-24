"use client";
import React, { useEffect, useState } from "react";
import { getWebStoryById, updateWebStory } from "@/api/webStory.api";
import WebStorySlidePreview from "../_components/WebStorySlidePreview";
import WebStorySlideEditor from "../_components/WebStorySlideEditor";
import WebStoryPreview from "../_components/WebStoryPreview";
import WebStoryEditor from "../_components/WebStoryEditor";
import { toast } from "sonner";

const EditWebStory = ({ params }) => {
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
          setSlides(webStory.storySlides || []);
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

  const handleNext = () => {
    if (
      story.title.trim() &&
      story.description.trim() &&
      story.tags.length > 0 &&
      story.category.trim()
    ) {
      setIsSlideEditing(true);
    } else {
      toast.error("Please complete all Web Story details before proceeding.");
    }
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
    formData.append("coverImage", webStory.coverImage);
    formData.append("category", webStory.category);
    formData.append("tags", JSON.stringify(webStory.tags));
    formData.append("storySlides", JSON.stringify(webStory.slides));

    try {
      await updateWebStory(params?.edit, formData);
      toast.success("Web Story updated successfully!");
    } catch (error) {
      console.error("Error updating web story:", error);
      toast.error("An error occurred while updating the web story.");
    }
  };

  return (
    <div className="flex h-screen flex-wrap">
      {isSlideEditing ? (
        <>
          <div className="w-full md:w-1/2 p-4">
            <WebStorySlideEditor
              slides={slides}
              setSlides={setSlides}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </div>
          <div className="w-full md:w-1/2 p-4">
            <WebStorySlidePreview slides={slides} currentIndex={currentIndex} />
            <button
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              onClick={handleSubmit}
            >
              Submit Web Story
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="w-full md:w-1/2 flex flex-col p-4">
            <WebStoryEditor story={story} setStory={setStory} />
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 self-start"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
          <div className="w-full md:w-1/2 p-4">
            <WebStoryPreview story={story} />
          </div>
        </>
      )}
    </div>
  );
};

export default EditWebStory;
