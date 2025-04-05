import { useEffect, useRef, useState } from "react";
import { IoBookmarksOutline } from "react-icons/io5";
import { fetchBookmarks } from "@/api/bookMarks.api";
import Image from "next/image";
import Link from "next/link";

const Bookmark = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookmark, setBookmark] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
      window.addEventListener("keydown", handleKeyPress);

      const fetchUserBookmarks = async () => {
        setLoading(true);
        try {
          const bookmarks = await fetchBookmarks();
          setBookmark(bookmarks);
        } catch (error) {
          setError("Error fetching bookmarks");
        } finally {
          setLoading(false);
        }
      };

      fetchUserBookmarks();
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
        className="p-2 rounded-full text-primary hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition duration-150 ease-in-out"
      >
        <IoBookmarksOutline size={24} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-auto max-h-[calc(100vh-4rem)]">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : error ? (
            <div className="p-4 text-red-500 text-center">{error}</div>
          ) : bookmark.length > 0 ? (
            <ul className="p-1 space-y-1">
              {bookmark.map((item) => (
                <li
                  key={item.postId?._id || item._id}
                  className="flex items-center space-x-3 bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition duration-150 ease-in-out"
                >
                  {item.postId?.banner ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/${item.postId.banner}`}
                      alt={item.postId.title}
                      width={1200}
                      height={675}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <Link
                    href={`/${item.postId?._id || item._id}/post`}
                    className="text-primary text-sm hover:underline line-clamp-2"
                    onClick={closeMenu}
                  >
                    {item.postId?.title || "Untitled"}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center">No items in bookmark</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookmark;
