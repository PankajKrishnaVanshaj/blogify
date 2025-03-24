import React from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://server.logify.pankri.com";
const DEFAULT_IMAGE = "blogify.png";
const DEFAULT_TITLE = "PK Blogify Story";
const DEFAULT_DURATION = 5;

const WebStoryView = ({ webStory }) => {
  const slides = webStory?.storySlides || [];
  const storyTitle = webStory?.title || DEFAULT_TITLE;

  if (!slides.length) {
    return (
      <amp-story
        standalone=""
        title={storyTitle}
        publisher="PK Blogify"
        publisher-logo-src={`/${DEFAULT_IMAGE}`}
        poster-portrait-src={`/${DEFAULT_IMAGE}`}
      >
        <amp-story-page id="page-0">
          <amp-story-grid-layer template="fill">
            <amp-img
              src={`/${DEFAULT_IMAGE}`}
              width="720"
              height="1280"
              layout="responsive"
              alt="Default slide"
              crossorigin="anonymous"
            />
          </amp-story-grid-layer>
        </amp-story-page>
      </amp-story>
    );
  }

  return (
    <amp-story
      standalone=""
      title={storyTitle}
      publisher="PK Blogify"
      publisher-logo-src={`/blogify.png`}
      poster-portrait-src={`${BASE_URL}/${webStory?.coverImage || DEFAULT_IMAGE}`}
      poster-square-src={`${BASE_URL}/${webStory?.coverImage || DEFAULT_IMAGE}`}
      poster-landscape-src={`${BASE_URL}/${webStory?.coverImage || DEFAULT_IMAGE}`}
    >
      {slides.map((slide, index) => {
        // Fallback chain: slide.media -> webStory.coverImage -> DEFAULT_IMAGE
        const slideImage = slide.media || webStory?.coverImage || DEFAULT_IMAGE;
        const isLastSlide = index === slides.length - 1;

        return (
          <amp-story-page
            key={`page-${index}`}
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
                crossorigin="anonymous"
              />
            </amp-story-grid-layer>
            <amp-story-grid-layer template="vertical">
              <div>
                <div
                  animate-in="fly-in-bottom"
                  animate-in-duration="0.5s"
                  style={{ background: "rgba(255, 255, 255, 0.6)", padding: "8px", borderRadius: "4px" }}
                >
                  <p dangerouslySetInnerHTML={{ __html: slide.content || " " }} />
                  {isLastSlide && slide.link && (
                    <a href={slide.link} target="_blank" rel="noopener noreferrer">
                      Swipe Up to Learn More
                    </a>
                  )}
                </div>
              </div>
            </amp-story-grid-layer>
          </amp-story-page>
        );
      })}
    </amp-story>
  );
};

export default WebStoryView;
