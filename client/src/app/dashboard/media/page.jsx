"use client";
import { useState } from "react";
import MediaUpload from "./_components/MediaUpload";
import { MdOutlineCloudUpload } from "react-icons/md";
import MediaView from "./_components/MediaView";

const Media = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the modal visibility
  const toggleMediaUpload = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="container ">
     <div className="flex items-center justify-between px-4 bg-gray-100 rounded-lg shadow-md">
  <h2 className="text-2xl font-semibold text-gray-800">Media</h2>
  <button
    onClick={toggleMediaUpload}
    aria-label="Upload Media"
    className="text-primary hover:text-white hover:bg-primary p-1 rounded-full transition duration-300 ease-in-out"
  >
    <MdOutlineCloudUpload size={35} />
  </button>
</div>

      <div className="overflow-x-auto w-full h-screen shadow-lg rounded-lg">
        {/* MediaUpload Modal */}
        {isOpen && (
          <div className="relative z-10">
            <div
              role="dialog"
              aria-labelledby="upload-form-title"
              aria-modal="true"
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <MediaUpload toggleMediaUpload={toggleMediaUpload} />
            </div>
          </div>
        )}

        {/* MediaView Component */}
        <MediaView />
      </div>
    </div>
  );
};

export default Media;
