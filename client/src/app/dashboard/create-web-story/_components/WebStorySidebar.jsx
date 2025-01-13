import { useState } from "react";

const WebStorySidebar = ({ onAddPage }) => {
  const [pageTitle, setPageTitle] = useState("");

  const handleAddPage = () => {
    onAddPage(pageTitle);
    setPageTitle("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Web Story Sidebar</h2>
      <input
        type="text"
        placeholder="Enter page title"
        value={pageTitle}
        onChange={(e) => setPageTitle(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleAddPage}
        className="bg-primary text-white p-2 rounded w-full"
      >
        Add Page
      </button>
    </div>
  );
};

export default WebStorySidebar;
