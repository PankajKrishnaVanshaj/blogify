import React, { useState, useEffect } from "react";
import { TbImageInPicture } from "react-icons/tb";
import MediaTab from "../../media/_components/MediaTab";

const categories = [
  "Technology & Innovation",
  "Health & Wellness",
  "Travel & Adventure",
  "Education & Learning",
  "Personal Development",
  "Finance & Investment",
  "Lifestyle & Fashion",
  "Food & Recipes",
  "Sports & Fitness",
  "Business & Entrepreneurship",
];

const WebStoryEditor = ({ story, setStory }) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [tags, setTags] = useState(story.tags || []); // Ensure tags are initialized correctly
  const [tagInput, setTagInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Update tags state whenever the story changes
  useEffect(() => {
    setTags(story.tags || []);
  }, [story]);

  const handleTagInputChange = (e) => setTagInput(e.target.value);

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        setStory((prev) => ({ ...prev, tags: updatedTags }));
      }
      setTagInput("");
      e.preventDefault();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    setStory((prev) => ({ ...prev, tags: updatedTags }));
  };

  const toggleMediaTab = () => {
    setIsOpen((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectMedia = (media) => {
    setStory((prev) => ({ ...prev, coverImage: media }));
    setIsOpen(false);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setStory((prev) => ({ ...prev, category }));
  };

  return (
    <div className="p-4 bg-gray-100 h-full">
      <h2 className="text-xl font-bold mb-4">Web Story Editor</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter story title"
          value={story.title || ""}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Enter story description"
          value={story.description || ""}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Category</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Tags</label>
        <div className="flex justify-between gap-2">
          <input
            type="text"
            placeholder="Enter tags and press Enter"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleAddTag}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-pink-600"
            onClick={toggleMediaTab}
          >
            <TbImageInPicture className="inline-block mr-2" />
          </button>
        </div>
        <div className="flex gap-2 flex-wrap mt-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-tertiary py-1 px-3 rounded-lg flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </span>
            ))
          ) : (
            <p className="text-gray-500">No tags added yet.</p>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="relative z-10">
          <div
            role="dialog"
            aria-labelledby="upload-form-title"
            aria-modal="true"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <MediaTab
              toggleMediaTab={toggleMediaTab}
              onSelectMedia={handleSelectMedia}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebStoryEditor;
