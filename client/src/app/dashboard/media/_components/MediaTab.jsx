import React, { useState } from "react";
import { CgCloseO } from "react-icons/cg";
import MediaView from "./MediaView";
import MediaUpload from "./MediaUpload";

const MediaTab = ({ toggleMediaTab, onSelectMedia }) => {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-2 mx-5">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-6 py-3 text-sm font-medium rounded-lg transition duration-200 ${activeTab === "upload" ? "bg-primary text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          Upload Media
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`px-6 py-3 text-sm font-medium rounded-lg transition duration-200 ${activeTab === "view" ? "bg-primary text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          View Uploaded Media
        </button>

        <button
          onClick={toggleMediaTab}
          className="text-primary ml-5 p-2 rounded-full transition duration-200 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <CgCloseO size={25} />
        </button>
      </div>

      <div className="w-full max-w-[58.5rem] max-h-[31rem] overflow-auto mt-2 border border-gray-300 rounded-lg">
        {activeTab === "upload" ? (
          <MediaUpload toggleMediaUpload={toggleMediaTab} />
        ) : (
          <MediaView onSelectMedia={onSelectMedia} />
        )}
      </div>
    </div>
  );
};

export default MediaTab;
