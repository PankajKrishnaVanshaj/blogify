import React, { useState } from "react";
import MediaTab from "../../media/_components/MediaTab";
import { TbImageInPicture } from "react-icons/tb";

const WebStorySlideEditor = ({ slides, setSlides, currentIndex, setCurrentIndex }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentSlide = slides[currentIndex] || {};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedSlides = [...slides];
    updatedSlides[currentIndex] = { ...currentSlide, [name]: value };
    setSlides(updatedSlides);
  };

  const handleSelectMedia = (media) => {
    const updatedSlides = [...slides];
    updatedSlides[currentIndex] = { ...currentSlide, media };
    setSlides(updatedSlides);
    setIsOpen(false);
  };

  const toggleMediaTab = () => {
    setIsOpen((prev) => !prev);
  };

  const addSlide = () => {
    const newSlide = { content: "", duration: 5, media: null };
    setSlides((prev) => [...prev, newSlide]);
    setCurrentIndex(slides.length); // Navigate to the new slide
  };

  const removeSlide = () => {
    if (slides.length > 1) {
      const updatedSlides = slides.filter((_, index) => index !== currentIndex);
      setSlides(updatedSlides);
      setCurrentIndex(Math.max(0, currentIndex - 1)); // Adjust index
    }
  };

  // Slide Navigation Handlers
  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="p-4 bg-gray-100 h-full">
      {/* Slide Count and Current Index */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Web Story Slide Editor</h2>
        <p className="text-gray-700">
          Slide {currentIndex + 1} of {slides.length}
        </p>
      </div>

      {/* Slide Navigation */}
      <div className="flex justify-between mb-4">
        <button
          className={`px-4 py-2 rounded ${currentIndex === 0 ? "bg-gray-300 text-gray-500" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          onClick={goToPreviousSlide}
          disabled={currentIndex === 0}
        >
          Previous Slide
        </button>
        <button
          className={`px-4 py-2 rounded ${currentIndex === slides.length - 1 ? "bg-gray-300 text-gray-500" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          onClick={goToNextSlide}
          disabled={currentIndex === slides.length - 1}
        >
          Next Slide
        </button>
      </div>

      {/* Slide Content Input */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Slide Content</label>
        <textarea
          name="content"
          value={currentSlide.content || ""}
          onChange={handleInputChange}
          placeholder="Enter slide content"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Slide Duration Input */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Duration (seconds)</label>
        <input
          type="number"
          name="duration"
          value={currentSlide.duration || 5}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Buttons for Media, Add, Remove */}
      <div className="flex space-x-2 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={toggleMediaTab}
        >
          <TbImageInPicture className="inline-block mr-2" />
          Add Media
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={addSlide}
        >
          Add Slide
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={removeSlide}
          disabled={slides.length === 1} // Prevent removing the last slide
        >
          Remove Slide
        </button>
      </div>

      {/* Media Tab */}
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
