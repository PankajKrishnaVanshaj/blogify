"use client";
import React, { useEffect, useState } from "react";
import { getWebStoryById } from "@/api/webStory.api";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://blogify.pankri.com";
const DEFAULT_IMAGE = "blogify.png";
const DEFAULT_TITLE = "PK Blogify Story";
const DEFAULT_DURATION = 5;

const WebStoryView = ({ params, webStory: serverStory }) => {
  const [slides, setSlides] = useState(serverStory?.storySlides || []);

  useEffect(() => {
    if (!serverStory && params?.creator) {
      async function fetchWebStory() {
        try {
          const webStory = await getWebStoryById(params.creator);
          setSlides(webStory?.storySlides || []);
        } catch (error) {
          console.error("Failed to fetch web story:", error);
        }
      }
      fetchWebStory();
    }
  }, [params?.creator, serverStory]);

  const storyTitle = serverStory?.title || DEFAULT_TITLE;

  console.log("WebStoryView rendered on client"); // Debug log

  return (
    <amp-story
      standalone
      title={storyTitle}
      publisher="PK Blogify"
      publisher-logo-src={`${BASE_URL}/blogify.png`}
      poster-portrait-src={`${BASE_URL}/${
        serverStory?.coverImage || DEFAULT_IMAGE
      }`}
      poster-square-src={`${BASE_URL}/${
        serverStory?.coverImage || DEFAULT_IMAGE
      }`}
      poster-landscape-src={`${BASE_URL}/${
        serverStory?.coverImage || DEFAULT_IMAGE
      }`}
    >
      {slides.map((slide, index) => {
        const slideImage =
          slide.media !== undefined && slide.media !== null
            ? slide.media
            : serverStory?.coverImage || DEFAULT_IMAGE;
        const isLastSlide = index === slides.length - 1;

        return (
          <amp-story-page
            key={index}
            id={`page-${index}`}
            auto-advance-after={`${slide.duration || DEFAULT_DURATION}s`}
          >
            <amp-story-grid-layer template="fill">
              <amp-img
                src={`${BASE_URL}/${slideImage}`}
                width="720"
                height="1280"
                layout="responsive"
                alt={`Slide ${index + 1}`}
              />
            </amp-story-grid-layer>
            <amp-story-grid-layer template="fill">
              <amp-img
                src={`${BASE_URL}/${slideImage}`}
                width="720"
                height="1280"
                layout="responsive"
                alt={`Slide ${index + 1} blurred`}
                className="blur-overlay"
              />
            </amp-story-grid-layer>
            <amp-story-grid-layer template="vertical">
              <div className="absolute bottom-0.5 w-full text-center">
                <div className="bg-white bg-opacity-60 p-2 rounded-md">
                  <p
                    className="text-primary font-semibold"
                    dangerouslySetInnerHTML={{ __html: slide.content || "" }}
                  />
                  {isLastSlide && slide.link && (
                    <a
                      href={slide.link}
                      className="inline-block mt-2 bg-primary text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-pink-700 transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Swipe Up to Learn More
                    </a>
                  )}
                </div>
              </div>
            </amp-story-grid-layer>
          </amp-story-page>
        );
      })}
      {/* <amp-story-bookend src="/api/bookend" layout="nodisplay" /> */}
    </amp-story>
  );
};

export default WebStoryView;
