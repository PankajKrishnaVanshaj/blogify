import Image from "next/image";
import React from "react";

const WebStoryPreview = ({ story }) => {
  return (
    <div className="p-6 pt-0 bg-gray-50 rounded-lg shadow-md h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Web Story Preview</h2>
      <div className="border border-gray-200 p-6 rounded-lg shadow-sm bg-white">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{story.title || "No Title"}</h3>
        {story.coverImage && (
          <div className="relative w-[200px] h-[355.55px] mb-4 rounded-lg overflow-hidden shadow-md">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${story.coverImage}`}
              alt="Cover"
              width={1200}
              height={675}
              priority={true}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        )}
        <p className="text-sm text-gray-600 mb-4">
          {story.coverImage ? "Cover Image Previewed" : "No Cover Image"}
        </p>
        <p className="text-gray-700 mb-4">{story.description || "No Description"}</p>
        <p className="text-gray-700 mb-4">
          <strong className="font-medium">Category:</strong> {story.category || "No Category"}
        </p>
        <div className="flex flex-wrap gap-2">
          <strong className="font-medium text-gray-700">Tags:</strong>
          {story.tags && story.tags.length > 0 ? (
            story.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {tag}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">No Tags</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebStoryPreview;