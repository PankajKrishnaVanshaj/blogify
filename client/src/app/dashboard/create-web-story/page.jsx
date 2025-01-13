'use client'
import { useState } from "react";
import WebStorySidebar from "./_components/WebStorySidebar";
import WebStoryPreview from "./_components/WebStoryPreview";
import WebStoryEditor from "./_components/WebStoryEditor";


const CreateWebStory = () => {
  const [pages, setPages] = useState([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState(null);

  const addPage = (title) => {
    const newPage = { title, content: "" };
    setPages([...pages, newPage]);
    setSelectedPageIndex(pages.length); // Select the newly added page
  };

  const editPage = (updatedPage) => {
    const updatedPages = [...pages];
    updatedPages[selectedPageIndex] = updatedPage;
    setPages(updatedPages);
  };

  return (
    <div className="min-h-screen bg-gray-100 grid grid-cols-7 gap-1 ">
      {/* Sidebar */}
      <div className="col-span-2 bg-white p-4 rounded shadow">
        <WebStorySidebar onAddPage={addPage} />
      </div>

      {/* Preview */}
      <div className="col-span-3 bg-white p-6 rounded shadow">
        {selectedPageIndex !== null ? (
          <WebStoryPreview page={pages[selectedPageIndex]} />
        ) : (
          <div className="text-center">Select or Add a Page to Preview</div>
        )}
      </div>

      {/* Editor */}
      <div className="col-span-2 bg-white p-4 rounded shadow">
        {selectedPageIndex !== null ? (
          <WebStoryEditor
            page={pages[selectedPageIndex]}
            onEditPage={editPage}
          />
        ) : (
          <div className="text-center">Select or Add a Page to Edit</div>
        )}
      </div>
    </div>
  );
};

export default CreateWebStory;
