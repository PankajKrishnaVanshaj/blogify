import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSearchSuggestions } from "@/api/search.api";
import { TbVirusSearch } from "react-icons/tb";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const SearchBarRef = useRef(null);
  const router = useRouter();

  const toggleSearchBar = () => {
    setIsOpen(!isOpen);
  };

  const closeSearchBar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      const results = await fetchSearchSuggestions(query);
      setSuggestions(results);
    };

    if (query) {
      fetchSuggestions();
    } else {
      setSuggestions([]); // Clear suggestions if query is empty
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
      <button onClick={toggleSearchBar} aria-label="Search">
        <TbVirusSearch className="text-2xl" />
      </button>
      {isOpen && (
        <div className="absolute top-full w-1/2 left-1/2 transform -translate-x-1/2 mt-0.5 bg-white border border-dashed pl-0.5 border-primary rounded-md shadow-lg z-50">
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
              className="px-3 py-2 bg-primary text-white font-semibold rounded-r-md hover:bg-primary-dark transition duration-150"
            >
              <TbVirusSearch size={24} />
            </button>
          </div>
          <ul className="max-h-60 overflow-y-auto border-gray-300">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
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
                {/* <p
                  className="text-sm text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html: suggestion.content,
                  }}
                /> */}
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
