import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getMediaById, updateMedia, uploadMediaAPI } from "@/api/media.api";
import Image from "next/image";

const MediaUpload = ({ toggleMediaUpload, mediaId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [media, setMedia] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [mediaUrl, setMediaUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [fetchError, setFetchError] = useState(false);

  // Fetch media data for editing
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const mediaData = await getMediaById(mediaId);
        if (mediaData) {
          setTitle(mediaData.title);
          setTags(mediaData.tags);
          setDescription(mediaData.description);
          setMedia(mediaData.media);
          setMediaUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/${mediaData.media}`);
        } else {
          toast.error("Media not found.");
        }
      } catch (error) {
        setFetchError(true);
        toast.error("Failed to fetch media data.");
      }
    };

    if (mediaId) fetchPost();
  }, [mediaId]);

  const handleCancel = useCallback(() => {
    setTitle("");
    setMedia(null);
    setTags([]);
    setDescription("");
    setMediaUrl(null);
    toggleMediaUpload();
  }, [toggleMediaUpload]);

  const handleAddTag = useCallback(
    (e) => {
      if (e.key === "Enter" && tagInput.trim() !== "") {
        const newTag = tagInput.trim();
        if (!tags.includes(newTag)) {
          if (tags.length < 5) {
            setTags((prevTags) => [...prevTags, newTag]);
          } else {
            toast.error("You can only add up to 5 tags.");
          }
        }
        setTagInput("");
        e.preventDefault();
      }
    },
    [tagInput, tags]
  );

  const handleRemoveTag = useCallback((tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  }, []);

  const handleMediaChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (file.size > 5 * 1024 * 1024 || !validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (Max size: 5MB)");
        return;
      }
      setMedia(file);
      setMediaUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    setDescription(e.target.value);
  }, []);

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }
    if (tags.length === 0) {
      toast.error("At least one tag is required.");
      return;
    }
    if (!media) {
      toast.error("Media is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Description cannot be empty.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("tags", JSON.stringify(tags));
    formData.append("description", description);
    formData.append("media", media);

    try {
      let response;
      if (mediaId) {
        response = await updateMedia(mediaId, formData);
      } else {
        response = await uploadMediaAPI(formData);
      }

      if (response.status === 201 || response.status === 200) {
        toast.success(
          mediaId ? "Successfully updated." : "Successfully created."
        );
        resetForm();
        setIsLoading(false);
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Error uploading media.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setTags([]);
    setMedia(null);
    setMediaUrl(null);
    setDescription("");
  };

  return (
    <div className="relative rounded-lg w-full max-w-xl p-6 shadow-2xl transform transition-all duration-300 ease-in-out">
      {fetchError && (
        <div className="text-red-600 mb-4">
          <p>Failed to fetch media data. Please try again later.</p>
        </div>
      )}

      <div className="flex justify-center items-center gap-2 p-2">
        {/* Left Section */}
        <div className="p-2 rounded-lg shadow-lg text-primary bg-white">
          <label htmlFor="media" className="block text-sm font-semibold">
            Media
          </label>
          <div className="relative w-48 h-72 rounded-md bg-gray-200 overflow-hidden flex items-center justify-center">
            <input
              type="file"
              id="media"
              accept="image/*"
              onChange={handleMediaChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {mediaUrl && (
              <Image
                src={mediaUrl}
                alt="Selected"
                width={1200}
                height={675}
                priority={true}
                className="object-contain w-full h-full"
              />
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="p-2 rounded-lg shadow-lg text-primary bg-white">
          <div className="mb-2">
            <label htmlFor="title" className="block text-sm font-semibold">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="tags" className="block text-sm font-semibold">
              Tags/Keywords
            </label>
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full mt-1 p-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-1 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-pink-100 text-pink-800 px-1.5 rounded-full text-xs flex items-center space-x-0.5"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-pink-400 hover:text-primary transition duration-300 ease-in-out"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <label
              htmlFor="description"
              className="block text-sm font-semibold"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              maxLength={300}
              value={description}
              onChange={handleDescriptionChange}
              className="w-full mt-1 p-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={handleCancel}
          className="bg-gray-500 text-white rounded-md p-2 w-24"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          className="bg-primary text-white rounded-md p-2 w-24"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default MediaUpload;
