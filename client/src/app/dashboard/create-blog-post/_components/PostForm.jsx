"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import MediaTab from "../../media/_components/MediaTab";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

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

const toolbarModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link"],
    ["code-block"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "script",
  "indent",
  "direction",
  "color",
  "background",
  "align",
  "link",
  "code-block",
];

const PostForm = ({ initialData = {}, onSubmit, isEditMode = false }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    content: initialData.content || "",
    category: initialData.category || categories[0],
    tags: initialData.tags || [],
    banner: initialData.banner || null,
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMediaTabOpen, setIsMediaTabOpen] = useState(false);

  useEffect(() => {
    setFormData({
      title: initialData.title || "",
      content: initialData.content || "",
      category: initialData.category || categories[0],
      tags: initialData.tags || [],
      banner: initialData.banner || null,
    });
  }, [JSON.stringify(initialData)]);

  const wordCount = formData.content
    ? formData.content.trim().split(/\s+/).length
    : 0;

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSelectMedia = (media) => {
    setFormData((prev) => ({ ...prev, banner: media }));
    setIsMediaTabOpen(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required.");
      return;
    }

    setIsSubmitting(true);
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, key === "tags" ? JSON.stringify(value) : value);
    });

    try {
      const result = await onSubmit(submitData);
      if (result.success) {
        toast.success(
          result.message ||
            (isEditMode
              ? "Post updated successfully!"
              : "Post created successfully!")
        );
        if (!isEditMode) {
          setFormData({
            title: "",
            content: "",
            category: categories[0],
            tags: [],
            banner: null,
          });
          setTagInput("");
          router.push("/dashboard/all-blog-posts");
        }
      } else {
        toast.error(
          result.message ||
            (isEditMode ? "Failed to update post." : "Failed to create post.")
        );
      }
    } catch (error) {
      toast.error(
        isEditMode
          ? "An error occurred while updating the post."
          : "An error occurred while creating the post."
      );
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onSubmit={handleFormSubmit}
      className="p-5 bg-gray-50 shadow-xl rounded-lg border border-gray-200"
    >
      <div className="flex items-start space-x-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Post Title"
            value={formData.title}
            onChange={(e) => handleChange("title")(e.target.value)}
            required
            className="w-full text-gray-700 p-4 border border-gray-300 rounded-lg text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-pink-600 transition duration-300 ease-in-out mb-6"
          />

          <div className="flex justify-between items-center mb-6 gap-2">
            <select
              value={formData.category}
              onChange={(e) => handleChange("category")(e.target.value)}
              className="w-1/2 p-3 border border-gray-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-600 transition duration-300 ease-in-out"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div className="p-3 border border-gray-300 rounded-lg text-lg text-gray-700">
              {wordCount}
            </div>

            <input
              type="text"
              placeholder="Enter tags and press Enter"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleAddTag}
              className="w-1/2 p-3 border border-gray-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-600 transition duration-300 ease-in-out"
            />
          </div>

          <div className="mt-1 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
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
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div
          onClick={() => setIsMediaTabOpen(true)}
          className="relative w-44 h-44 border border-gray-300 bg-white rounded-lg overflow-hidden cursor-pointer"
        >
          {formData.banner && (
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${formData.banner}`}
              alt="Selected banner"
              className="object-cover w-full h-full"
            />
          )}
        </div>

        {isMediaTabOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <MediaTab
              toggleMediaTab={() => setIsMediaTabOpen(false)}
              onSelectMedia={handleSelectMedia}
            />
          </div>
        )}
      </div>

      <div className="mt-5">
        <ReactQuill
          key={isEditMode ? "edit" : "create"}
          value={formData.content}
          onChange={handleChange("content")}
          placeholder="Write your post content here..."
          className="h-96 border-none"
          theme="snow"
          modules={toolbarModules}
          formats={formats}
        />
      </div>

      <button
      onClick={handleFormSubmit}
      disabled={isSubmitting}
        className={`mt-20 w-full py-3 px-4 font-bold rounded-lg transition duration-300 ease-in-out ${
          isSubmitting
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-pink-500 text-white hover:bg-pink-700 focus:ring-4 focus:ring-pink-300"
        }`}
      >
        {isSubmitting
          ? isEditMode
            ? "Updating..."
            : "Publishing..."
          : isEditMode
          ? "Update Post"
          : "Publish Post"}
      </button>
    </div>
  );
};

export default PostForm;