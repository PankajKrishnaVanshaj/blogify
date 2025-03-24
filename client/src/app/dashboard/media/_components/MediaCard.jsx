import Image from "next/image";
import React, { useState } from "react";
import { BiEdit, BiSelectMultiple } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import MediaUpload from "./MediaUpload";
import { deleteMedia } from "@/api/media.api";
import { FaArrowsToEye } from "react-icons/fa6";
import Link from "next/link";

const MediaCard = ({ media, onSelectMedia, onDeleteMedia }) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMediaId, setEditingMediaId] = useState(null);

  const toggleMediaUpload = () => setIsModalOpen((prev) => !prev);
  const toggleActions = () => setIsActionsOpen((prev) => !prev);

  const handleSelectedMedia = () => {
    if (onSelectMedia) {
      onSelectMedia(media.media);
    }
  };

  const mediaUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${media.media}`;

  const handleDelete = async (mediaId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this media?"
    );
    if (!confirmDelete) return;
    try {
      await deleteMedia(mediaId);
      if (onDeleteMedia) {
        onDeleteMedia(mediaId); // Inform parent component to update state
      }
    } catch {
      alert("An error occurred while deleting the media.");
    }
  };

  const handleEditMedia = (mediaId) => {
    setEditingMediaId(mediaId);
    toggleMediaUpload(); // Open modal for editing
  };

  return (
    <div className="w-40 h-60">
      <div
        className="relative border border-dashed shadow-sm shadow-primary hover:shadow-primary rounded-lg hover:scale-105 hover:shadow-md cursor-pointer transition-all overflow-hidden w-full h-full"
        onClick={toggleActions}
        onDoubleClick={handleSelectedMedia}
      >
        {media ? (
          <Image
            src={mediaUrl}
            alt={media.title || "Media Image"}
            width={720}
            height={1280}
            loading="lazy"
            className="object-cover rounded-lg w-full h-full"
          />
        ) : (
          <p className="text-center text-gray-500">No media available</p>
        )}

        {isActionsOpen && (
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-40 rounded-full p-1">
          <Link
              href={`/${media._id}/media`}
              target="_blank"
              className="p-1 text-primary rounded-full shadow shadow-tertiary hover:bg-primary hover:text-white transition-all"
              aria-label="view"
            >
              <FaArrowsToEye size={20} />
            </Link>
            <button
              onClick={() => handleDelete(media._id)}
              className="p-1 text-primary rounded-full shadow shadow-tertiary hover:bg-primary hover:text-white transition-all"
              aria-label="Delete"
            >
              <MdDeleteOutline size={20} />
            </button>
            <button
              onClick={() => handleEditMedia(media._id)}
              className="p-1 text-primary rounded-full shadow shadow-tertiary hover:bg-primary hover:text-white transition-all"
              aria-label="Edit"
            >
              <BiEdit size={20} />
            </button>
            <button
              onClick={handleSelectedMedia}
              className="p-1 text-primary rounded-full shadow shadow-tertiary hover:bg-primary hover:text-white transition-all"
              aria-label="Select Multiple"
            >
              <BiSelectMultiple size={20} />
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          role="dialog"
          aria-labelledby="upload-form-title"
          aria-modal="true"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <MediaUpload
            toggleMediaUpload={toggleMediaUpload}
            mediaId={editingMediaId} // Pass mediaId here
          />
        </div>
      )}
    </div>
  );
};

export default MediaCard;
