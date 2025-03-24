import React from "react";

const WebStorySlidePreview = ({ slides, currentIndex }) => {
  const currentSlide = slides[currentIndex] || {};

  return (
    <div className="p-4 bg-gray-50 h-full">
      <h2 className="text-xl font-bold mb-4">Web Story Slide Preview</h2>
      <div className="border p-4 rounded shadow bg-white">
        <h3 className="text-lg font-bold mb-2">Slide Preview</h3>
        {currentSlide.media && (
          <div className="relative w-[200px] h-[355.55px] mb-2 rounded overflow-hidden">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${currentSlide.media}`}
              alt="Cover"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        )}
        <p
          className="my-2"
          dangerouslySetInnerHTML={{
            __html: currentSlide.content || "No content",
          }}
        />
        <p className="my-2">
          <strong>Duration:</strong> {currentSlide.duration || 5} seconds
        </p>
      </div>
    </div>
  );
};

export default WebStorySlidePreview;
