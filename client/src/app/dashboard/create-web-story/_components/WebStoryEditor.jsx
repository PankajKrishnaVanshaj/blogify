import { useState } from "react";

const WebStoryEditor = ({ page, onEditPage }) => {
  const [title, setTitle] = useState(page.title || "");
  const [content, setContent] = useState(page.content || "");

  const handleSave = () => {
    onEditPage({ ...page, title, content });
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Edit Page</h2>
      <input
        type="text"
        placeholder="Page Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <textarea
        placeholder="Page Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <button
        onClick={handleSave}
        className="bg-primary text-white p-2 rounded w-full"
      >
        Save
      </button>
    </div>
  );
};

export default WebStoryEditor;
