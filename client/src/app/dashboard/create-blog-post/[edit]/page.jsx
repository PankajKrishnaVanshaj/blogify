"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getPostById, updatePost } from "@/api/blogPost.api";
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

const EditPost = ({ params }) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(params.edit);
        setTitle(post.title);
        setContent(
          typeof post.content === "string"
            ? post.content
            : JSON.stringify(post.content)
        );
        setSelectedCategory(post.category);
        setTags(post.tags);
        setSelectedMedia(`${post.banner}`);
      } catch (error) {
        console.error("Error fetching post data:", error);
        toast.error("Failed to fetch post data.");
      }
    };

    if (params.edit) {
      fetchPost();
    } else {
      resetForm();
    }
  }, [params.edit]);

  const handleTagInputChange = (e) => setTagInput(e.target.value);
  // Calculate words
  const wordCount =
    content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
      }
      setTagInput("");
      e.preventDefault();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSelectMedia = (media) => {
    setSelectedMedia(media); // Update selected media text here
  };

  const toggleMediaTab = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !content) {
      toast.error("Title and content are required.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", selectedCategory);
    formData.append("tags", JSON.stringify(tags));
    formData.append("banner", selectedMedia);

    try {
      await updatePost(params.edit, formData);
      toast.success("Post updated successfully");
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-gray-50 shadow-xl rounded-lg border border-gray-200">
      <div>
        <div className="flex items-start space-x-6">
          <div className="flex-1">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Post Title"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-gray-700 p-4 border border-gray-300 rounded-lg text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-pink-600 transition duration-300 ease-in-out"
              />
            </div>
            <div className="flex justify-between items-center mb-6 gap-2">
              <div className="relative w-1/2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-600 transition duration-300 ease-in-out"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-3 border border-gray-300 rounded-lg text-lg text-gray-700">
                {wordCount}
              </div>
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Enter tags and press Enter"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleAddTag}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-600 transition duration-300 ease-in-out"
                />
              </div>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-pink-100 text-pink-800 py-1 px-3 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-pink-500 hover:text-pink-700 transition duration-300 ease-in-out"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div
            onClick={toggleMediaTab}
            className="relative w-44 h-44 border border-gray-300 bg-white rounded-lg overflow-hidden"
          >
            {selectedMedia && (
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/${selectedMedia}`}
                alt="Selected"
                className="object-cover w-full h-full"
              />
            )}
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

        <div className="mt-5 border border-gray-300 rounded-lg shadow-sm overflow-visible">
          <ReactQuill
            value={content}
            onChange={setContent}
            placeholder="Write your post content here..."
            className="min-h-[300px] border-none focus:outline-none focus:ring-2 focus:ring-pink-600 transition duration-300 ease-in-out"
            theme="snow"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-6 w-full py-3 px-4 font-bold rounded-lg focus:outline-none focus:ring-4 transition duration-300 ease-in-out ${
            loading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-pink-500 text-white hover:bg-pink-700 focus:ring-pink-300"
          }`}
        >
          {loading ? "Updating..." : "Update Post"}
        </button>
      </div>
    </div>
  );
};

export default EditPost;
