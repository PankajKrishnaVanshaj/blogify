"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SiCircuitverse } from "react-icons/si";

const AIChatBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const AIChatBarRef = useRef(null);
  const router = useRouter();

  const toggleSearchBar = () => {
    setIsOpen(!isOpen);
  };

  const closeSearchBar = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      router.push(`/chat-with-ai?query=${encodeURIComponent(inputValue)}`);
      closeSearchBar();
    }
    setInputValue("");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        AIChatBarRef.current &&
        !AIChatBarRef.current.contains(event.target)
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

  return (
    <div ref={AIChatBarRef} className="flex justify-center">
      <button onClick={toggleSearchBar} aria-label="ai chat ">
        <SiCircuitverse className="text-2xl" />
      </button>
      {isOpen && (
        <div className="absolute top-full w-1/2 left-1/2 transform -translate-x-1/2 mt-0.5 bg-white border border-dashed pl-0.5 border-primary rounded-md shadow-lg z-50">
          <div className="flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-2 border-b outline-none focus:border-primary transition duration-150"
              placeholder="Chat With AI..."
            />
            <button
              onClick={handleSubmit}
              className="px-3 py-2 bg-primary text-white font-semibold rounded-r-md hover:bg-primary-dark transition duration-150"
            >
              <SiCircuitverse size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBar;
