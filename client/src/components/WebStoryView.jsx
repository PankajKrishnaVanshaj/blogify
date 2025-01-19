"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LuRefreshCcwDot } from "react-icons/lu";
import { FaPause, FaPlay } from "react-icons/fa";
import WebStorySuggestion from "./WebStorySuggestion";
import { getWebStoryById } from "@/api/webStory.api";

const WebStoryView = ({ params }) => {
  const [story, setStory] = useState({
    title: "",
    description: "",
    coverImage: "",
    category: "",
    tags: [],
  });

  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [isLastSlideComplete, setIsLastSlideComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch web story data from the API
  useEffect(() => {
    const fetchWebStory = async () => {
      try {
        
        const webStory = await getWebStoryById(params.creator)

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

    if (params.creator) {
      fetchWebStory();
    }
  }, [params.creator]);

  // Logic to handle slide transitions based on duration and progress
  useEffect(() => {
    if (slides.length === 0 || isPaused) return;

    const currentSlide = slides[currentSlideIndex];
    const slideDuration = currentSlide?.duration * 1000;

    if (currentSlideIndex === slides.length - 1) {
      // Show restart button only after last slide's duration ends
      const lastSlideTimer = setTimeout(() => {
        setIsLastSlideComplete(true);
      }, slideDuration);

      return () => clearTimeout(lastSlideTimer);
    }

    const slideTimer = setTimeout(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, slideDuration);

    return () => {
      clearTimeout(slideTimer);
    };
  }, [currentSlideIndex, slides, isPaused]);

  // Restart the web story from the first slide
  const restartStory = () => {
    setCurrentSlideIndex(0);
    setIsLastSlideComplete(false);
  };

  const goToPreviousSlide = () => {
    setCurrentSlideIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handleImageClick = (event) => {
    const imageWidth = event.target.width;
    const clickPosition = event.nativeEvent.offsetX;

    if (clickPosition < imageWidth / 2) {
      setShowLeftButton(true);
      setShowRightButton(false);
    } else {
      setShowLeftButton(false);
      setShowRightButton(true);
    }
  };

  const togglePause = () => {
    setIsPaused((prevState) => !prevState);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-screen m-0.5 md:m-1 ">
      {/* Left Ad Section */}
      <div className="hidden md:flex col-span-3 items-center justify-center text-white text-sm md:text-base p-4 rounded-md shadow-md">
        <p className="text-center">Ad Space - Left</p>
      </div>

      {/* Main Story Section */}
      <div className="col-span-1 md:col-span-6 relative">
        {slides.length > 0 && (
          <div className="relative w-full h-full">
            {slides[currentSlideIndex]?.media && (
              <div
                className="w-full h-full relative rounded-md shadow-lg overflow-hidden cursor-pointer group"
                onClick={handleImageClick}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/${slides[currentSlideIndex].media}`}
                  alt={`Slide ${currentSlideIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={currentSlideIndex === 0}
                  style={{
                    objectFit: "cover",
                  }}
                  className="absolute top-0 left-0"
                />

                <div className="absolute bottom-2 right-0 w-fit rounded-md font-semibold bg-white bg-opacity-60 mx-2 px-3 py-1 shadow-sm">
                  <p
                    className="text-primary leading-5 "
                    dangerouslySetInnerHTML={{
                      __html: slides[currentSlideIndex]?.content,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={togglePause}
                className="p-2 bg-opacity-60 text-primary rounded-full shadow-lg hover:bg-primary hover:text-white transition"
              >
                {isPaused ? <FaPlay size={20} /> : <FaPause size={20} />}
              </button>
            </div>

            {/* Show Left Button if clicked on left side */}
            {showLeftButton && (
              <div className="absolute inset-y-1/2 left-5 z-10 transform -translate-y-1/2">
                <button
                  onClick={goToPreviousSlide}
                  className="p-3 text-primary  rounded-full shadow-md hover:bg-primary hover:text-white transition"
                >
                  <FaChevronLeft size={20} />
                </button>
              </div>
            )}

            {/* Show Right Button if clicked on right side */}
            {showRightButton && (
              <div className="absolute inset-y-1/2 right-5 z-10 transform -translate-y-1/2">
                <button
                  onClick={goToNextSlide}
                  className="p-3 text-primary  rounded-full shadow-md hover:bg-primary hover:text-white transition"
                >
                  <FaChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Show Restart Button only after the last slide's duration ends */}
            {isLastSlideComplete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={restartStory}
                  className="p-2 bg-primary text-white rounded-full shadow-lg hover:bg-pink-700 transition"
                >
                  <LuRefreshCcwDot size={24} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Ad Section */}
      {/* <div className="hidden md:flex col-span-3 items-center justify-center text-white text-sm md:text-base p-4 rounded-md shadow-md">
        <WebStorySuggestion category={story.category} />
      </div> */}
    </div>
  );
};

export default WebStoryView;
