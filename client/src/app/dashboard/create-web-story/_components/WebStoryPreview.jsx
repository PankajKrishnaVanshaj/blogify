import React from "react";

const WebStoryPreview = ({ story }) => {
  return (
    <div className="p-4 bg-gray-50 h-full">
      <h2 className="text-xl font-bold mb-4">Web Story Preview</h2>
      <div className="border p-4 rounded shadow bg-white">
        <h3 className="text-lg font-bold mb-2">{story.title || "No Title"}</h3>
        {story.coverImage && (
          <div className="relative w-[200px] h-[355.55px] mb-2 rounded overflow-hidden ">
          <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${story.coverImage}`}
              alt="Cover"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        )}
        <p className="text-sm text-gray-600">
          {story.coverImage ? "Cover Image Previewed" : "No Cover Image"}
        </p>
        <p className="my-2">{story.description || "No Description"}</p>
        <p className="my-2">
          <strong>Category:</strong> {story.category || "No Category"}
        </p>
        <div className="my-2 flex flex-wrap">
          <strong>Tags:</strong>
          {story.tags && story.tags.length > 0 ? (
            <>
              {story.tags.map((tag) => (
                <span
                  className="bg-blue-100 text-blue-800 mx-0.5 px-2 rounded-lg flex items-center gap-1"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </>
          ) : (
            <p className="text-gray-500">No Tags</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebStoryPreview;
