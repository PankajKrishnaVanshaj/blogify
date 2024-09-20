import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ReactQuill from "react-quill";
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

const WritePost = () => {
  const { postId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [banner, setBanner] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:55555/api/v1/posts/post/${postId}`
        );
        const post = response.data;
        setTitle(post.title);
        setContent(
          typeof post.content === "string"
            ? post.content
            : JSON.stringify(post.content)
        );
        setSelectedCategory(post.category);
        setTags(post.tags);
        setBannerUrl(`${import.meta.env.VITE_BASE_URL}/${post.banner}`);
      } catch (error) {
        console.error("Error fetching post data:", error);
        toast.error("Failed to fetch post data.");
      }
    };

    if (postId) {
      fetchPost();
    } else {
      resetForm();
    }
  }, [postId]);

  const handleTagInputChange = (e) => setTagInput(e.target.value);

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

  const handleBannerChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // File validation: 2MB max size and image types
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (file.size > 2 * 1024 * 1024 || !validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (Max size: 2MB)");
        return;
      }

      setBanner(file);
      setBannerUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", selectedCategory);
    formData.append("tags", JSON.stringify(tags));
    if (banner) {
      formData.append("banner", banner);
    }

    const token = Cookies.get("token");

    try {
      const response = postId
        ? await axios.put(
            `http://localhost:55555/api/v1/posts/edit-post/${postId}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          )
        : await axios.post(
            "http://localhost:55555/api/v1/posts/create-post",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

      if (response.status === 201) {
        toast.success("Post submitted successfully");
        resetForm();
      } else if (response.status === 200) {
        toast.success("Post updated successfully");
      } else {
        toast.error("Error submitting post");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedCategory(categories[0]);
    setTags([]);
    setBanner(null);
    setBannerUrl(null);
  };

  return (
    <div className="p-5 bg-gray-50 shadow-xl rounded-lg border border-gray-200">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-6">
          <div className="flex-1">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Post Title"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-gray-700 p-4 border border-gray-300 rounded-lg text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out"
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-1/2 pr-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Enter tags and press Enter"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleAddTag}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out"
                />
              </div>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="relative w-44 h-44 border border-gray-300 bg-white rounded-lg overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              required
            />
            {bannerUrl && (
              <img
                src={bannerUrl}
                alt="Selected"
                className="object-cover w-full h-full"
              />
            )}
          </div>
        </div>

        <div className="mt-5">
          <ReactQuill
            value={content}
            onChange={setContent} // Directly set the content from ReactQuill
            placeholder="Write your post content here..."
            className="w-full h-96 p-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out resize-none"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out"
        >
          {postId ? "Update Post" : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default WritePost;
