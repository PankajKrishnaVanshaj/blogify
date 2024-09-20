import { useEffect, useRef, useState } from "react";
import { IoBookmarks } from "react-icons/io5";

const Bookmark = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookmark, setBookmark] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen]);

  return (
    <div className="relative z-10" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition duration-150 ease-in-out"
      >
        <IoBookmarks size={24} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-auto max-h-[calc(100vh-4rem)]">
          jkhjhjh
        </div>
      )}
    </div>
  );
};

export default Bookmark;
