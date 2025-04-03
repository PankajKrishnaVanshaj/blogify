"use client";
import React, { useState, useEffect } from "react";
import MediaTab from "../../media/_components/MediaTab";
import { TbImageInPicture } from "react-icons/tb";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const WebStorySlideEditor = ({
  slides,
  setSlides,
  currentIndex,
  setCurrentIndex,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(slides[currentIndex] || {});

  useEffect(() => {
    setCurrentSlide(slides[currentIndex] || { content: "", duration: 5, media: null });
  }, [currentIndex, slides]);

  const handleContentChange = (value) => {
    const updatedSlides = [...slides];
    updatedSlides[currentIndex] = { ...currentSlide, content: value };
    setSlides(updatedSlides);
    setCurrentSlide({ ...currentSlide, content: value });
  };

  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value, 10) || 5;
    const updatedSlides = [...slides];
    updatedSlides[currentIndex] = { ...currentSlide, duration: value };
    setSlides(updatedSlides);
    setCurrentSlide({ ...currentSlide, duration: value });
  };

  const handleSelectMedia = (media) => {
    const updatedSlides = [...slides];
    updatedSlides[currentIndex] = { ...currentSlide, media };
    setSlides(updatedSlides);
    setCurrentSlide({ ...currentSlide, media });
    setIsOpen(false);
  };

  const toggleMediaTab = () => setIsOpen((prev) => !prev);

  const addSlide = () => {
    const newSlide = { content: "", duration: 5, media: null };
    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);
    setCurrentIndex(updatedSlides.length - 1);
  };

  const removeSlide = () => {
    if (slides.length > 1) {
      const updatedSlides = slides.filter((_, index) => index !== currentIndex);
      setSlides(updatedSlides);
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const goToPreviousSlide = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const formats = ["bold", "italic", "underline", "strike", "list", "bullet"];

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md h-full overflow-y-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Web Story Slide Editor</h2>
        <p className="text-sm text-gray-600">
          Slide {currentIndex + 1} of {slides.length}
        </p>
      </div>

      <div className="flex justify-between mb-6 gap-3">
        <button
          className={`flex-1 px-4 py-2 rounded-lg transition duration-200 shadow-md ${
            currentIndex === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/85"
          }`}
          onClick={goToPreviousSlide}
          disabled={currentIndex === 0}
        >
          Previous Slide
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded-lg transition duration-200 shadow-md ${
            currentIndex === slides.length - 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/85"
          }`}
          onClick={goToNextSlide}
          disabled={currentIndex === slides.length - 1}
        >
          Next Slide
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Slide Content</label>
        <ReactQuill
          value={currentSlide.content || ""}
          onChange={handleContentChange}
          placeholder="Enter slide content"
          modules={modules}
          formats={formats}
          className="bg-white border border-gray-300 rounded-lg shadow-sm"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
        <input
          type="number"
          name="duration"
          value={currentSlide.duration || 5}
          onChange={handleDurationChange}
          min="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
        />
      </div>

      <div className="flex gap-3">
        <button
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/85 transition duration-200 shadow-md flex items-center justify-center"
          onClick={toggleMediaTab}
        >
          <TbImageInPicture className="mr-2" />
          Add Media
        </button>
        <button
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/85 transition duration-200 shadow-md"
          onClick={addSlide}
        >
          Add Slide
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded-lg transition duration-200 shadow-md ${
            slides.length === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/85"
          }`}
          onClick={removeSlide}
          disabled={slides.length === 1}
        >
          Remove Slide
        </button>
      </div>

      {isOpen && (
        <div className="relative z-10">
          <div
            role="dialog"
            aria-labelledby="upload-form-title"
            aria-modal="true"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <MediaTab
              toggleMediaTab={toggleMediaTab}
              onSelectMedia={handleSelectMedia}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebStorySlideEditor;