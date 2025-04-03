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
  const [tags, setTags] = useState(story.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleMediaTab = () => setIsOpen((prev) => !prev);

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
    <div className="p-6 bg-gray-50 rounded-lg shadow-md h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Web Story Editor
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="Enter story title"
          value={story.title || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Enter story description"
          value={story.description || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 resize-none"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 bg-white"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter tags and press Enter"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleAddTag}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
          />
          <button
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/85 transition duration-200"
            onClick={toggleMediaTab}
          >
            <TbImageInPicture className="mr-2" />
            Media
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">No tags added yet.</p>
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
