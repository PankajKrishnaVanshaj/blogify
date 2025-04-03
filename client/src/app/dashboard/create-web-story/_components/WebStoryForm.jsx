"use client";
import React, { useCallback } from "react";
import { toast } from "sonner";
import WebStorySlideEditor from "./WebStorySlideEditor";
import WebStorySlidePreview from "./WebStorySlidePreview";
import WebStoryEditor from "./WebStoryEditor";
import WebStoryPreview from "./WebStoryPreview";

const WebStoryForm = ({
  story,
  setStory,
  slides,
  setSlides,
  currentIndex,
  setCurrentIndex,
  isSlideEditing,
  setIsSlideEditing,
  onSubmit,
  isEditing = false,
}) => {
  const validateStoryDetails = useCallback(() => {
    if (!story.title.trim()) return "Title is required.";
    if (!story.description.trim()) return "Description is required.";
    if (story.tags.length === 0) return "At least one tag is required.";
    if (!story.category.trim()) return "Category is required.";
    return null;
  }, [story]);

  const handleNext = useCallback(() => {
    const errorMessage = validateStoryDetails();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }
    setIsSlideEditing(true);
  }, [validateStoryDetails, setIsSlideEditing]);

  const handleSubmit = useCallback(async () => {
    if (!slides.length) {
      toast.error("Please add at least one slide to your story.");
      return;
    }

    const webStory = { ...story, slides };
    const formData = new FormData();
    formData.append("title", webStory.title);
    formData.append("description", webStory.description);
    formData.append("coverImage", webStory.coverImage);
    formData.append("category", webStory.category);
    formData.append("tags", JSON.stringify(webStory.tags));
    formData.append("storySlides", JSON.stringify(webStory.slides));

    try {
      const response = await onSubmit(formData);
      toast.success(
        `Web Story ${isEditing ? "updated" : "submitted"} successfully!`
      );
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        `An error occurred while ${
          isEditing ? "updating" : "submitting"
        } the web story.`
      );
    }
  }, [story, slides, onSubmit, isEditing]);

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto overflow-hidden p-5 bg-gray-50 shadow-xl rounded-lg border border-gray-200">
      {isSlideEditing ? (
        <>
          <div className="w-full md:w-1/2  flex flex-col bg-gray-50">
            <button
              className="mx-5 my-1 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/85 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-200 shadow-md"
              onClick={handleSubmit}
              aria-label={`${isEditing ? "Update" : "Submit"} Web Story`}
            >
              {isEditing ? "Update" : "Submit"} Web Story
            </button>
            <div className="flex-1 overflow-y-auto">
              <WebStorySlideEditor
                slides={slides}
                setSlides={setSlides}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2  flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <WebStorySlidePreview
                slides={slides}
                currentIndex={currentIndex}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full md:w-1/2  flex flex-col bg-gray-50">
            <button
              className="mx-5 my-1 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/85 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-200 shadow-md"
              onClick={handleNext}
              aria-label="Proceed to Edit Slides"
            >
              Next
            </button>
            <div className="flex-1 overflow-y-auto">
              <WebStoryEditor story={story} setStory={setStory} />
            </div>
          </div>
          <div className="w-full md:w-1/2  flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <WebStoryPreview story={story} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WebStoryForm;
