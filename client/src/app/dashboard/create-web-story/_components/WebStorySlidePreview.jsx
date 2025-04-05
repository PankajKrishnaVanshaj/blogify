import Image from "next/image";
import React from "react";

const WebStorySlidePreview = ({ slides, currentIndex }) => {
  const currentSlide = slides[currentIndex] || {};

  return (
    <div className="p-6 pt-0 bg-gray-50 rounded-lg shadow-md h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Web Story Slide Preview</h2>
      <div className="border border-gray-200 p-6 rounded-lg shadow-sm bg-white">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Slide Preview</h3>
        {currentSlide.media && (
          <div className="relative w-[200px] h-[355.55px] mb-4 rounded-lg overflow-hidden shadow-md flex justify-center items-center mx-auto">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${currentSlide.media}`}
              alt="Cover"
              width={1200}
              height={675}
              priority={true}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <p
          className="text-gray-700 mb-4"
          dangerouslySetInnerHTML={{
            __html: currentSlide.content || "No content",
          }}
        />
        <p className="text-gray-700">
          <strong className="font-medium">Duration:</strong> {currentSlide.duration || 5} seconds
        </p>
      </div>
    </div>
  );
};

export default WebStorySlidePreview;