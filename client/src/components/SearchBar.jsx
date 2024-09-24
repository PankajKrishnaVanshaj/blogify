import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const SearchBarRef = useRef(null);
  const router = useRouter(); // Use Next.js's router

  const toggleSearchBar = () => {
    setIsOpen(!isOpen);
  };

  const closeSearchBar = () => {
    setIsOpen(false);
  };

  const fetchSuggestions = async (searchQuery) => {
    if (searchQuery.trim()) {
      try {
        const response = await axios.get(
          "http://localhost:55555/api/v1/search/suggestion",
          {
            params: { q: searchQuery },
          }
        );

        const data = response.data;

        // Ensure the data is an array
        if (Array.isArray(data)) {
          setSuggestions(data);
        } else {
          setSuggestions([]); // or handle the case where data is not an array
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]); // Set to an empty array in case of an error
      }
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (query) {
      fetchSuggestions(query);
    }
  }, [query]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        SearchBarRef.current &&
        !SearchBarRef.current.contains(event.target)
      ) {
        closeSearchBar();
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        closeSearchBar();
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

  const handleSubmit = (selectedQuery) => {
    const searchQuery = selectedQuery || query;
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      closeSearchBar();
      setQuery("");
      setSuggestions([]);
    }
  };

  return (
    <div ref={SearchBarRef} className="flex justify-center">
      <button
        onClick={toggleSearchBar}
        className="flex items-center gap-1 border rounded-full px-3 py-1 text-sm font-thin cursor-pointer"
      >
        <CiSearch className="text-2xl" />
        Search...
      </button>
      {isOpen && (
        <div className="absolute top-full w-1/2 left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 border-b outline-none focus:border-primary transition duration-150"
              placeholder="Search..."
            />
            <button
              onClick={() => handleSubmit()}
              className="px-3 py-2 bg-primary text-white font-semibold rounded-r-lg hover:bg-primary-dark transition duration-150"
            >
              <CiSearch size={24} />
            </button>
          </div>
          <ul className="max-h-60 overflow-y-auto mt-2 border-t border-gray-300">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setQuery(suggestion.title);
                  handleSubmit(suggestion.title);
                }}
              >
                <strong>
                  {suggestion.title.length > 57
                    ? suggestion.title.slice(0, 57) + "..."
                    : suggestion.title}
                </strong>
                <p
                  className="text-sm text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html: suggestion.content,
                  }}
                />
              </li>
            ))}
            {suggestions.length === 0 && query && (
              <li className="px-4 py-3 text-gray-500">No suggestions found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
