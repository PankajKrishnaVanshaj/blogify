import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


const categories = [
  "All",
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

const Categories = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startIndex, setStartIndex] = useState(0);
  const [categoriesToShow, setCategoriesToShow] = useState(5); // Default to 5 until we can measure

  // Function to determine how many categories to show based on screen width
  function getCategoriesToShow() {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) return 2; // Mobile
      if (width < 768) return 3; // Tablet
      if (width < 1024) return 5; // Small desktop
      return 6; // Large desktop
    }
    return 5; // Default fallback
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category === "All" ? "" : category);
  };

  const handleNext = () => {
    if (startIndex + categoriesToShow < categories.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  // Update categoriesToShow on window resize and component mount
  useEffect(() => {
    // Set categories to show when the component mounts
    setCategoriesToShow(getCategoriesToShow());

    const handleResize = () => {
      setCategoriesToShow(getCategoriesToShow());
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex items-center justify-between w-full px-4 py-2">
      {/* Left Button */}
      {startIndex > 0 && (
        <button
          onClick={handlePrev}
          aria-label="Previous Categories"
          className="p-2 mr-4 rounded-lg bg-primary text-white hover:bg-pink-800 transition duration-300 ease-in-out"
        >
          <FaChevronLeft size={23} />
        </button>
      )}

      <div className="flex gap-4 overflow-hidden w-full">
        {categories
          .slice(startIndex, startIndex + categoriesToShow)
          .map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`py-2 px-4 rounded-lg transition duration-300 ${
                selectedCategory === category
                  ? "bg-pink-800 text-white"
                  : "bg-primary text-white hover:bg-pink-800"
              }`}
            >
              {category}
            </button>
          ))}
      </div>

      {/* Right Button */}
      {startIndex + categoriesToShow < categories.length && (
        <button
          onClick={handleNext}
          aria-label="Next Categories"
          className="p-2 ml-4 rounded-lg bg-primary text-white hover:bg-pink-800 transition duration-300 ease-in-out"
        >
          <FaChevronRight size={23} />
        </button>
      )}
    </div>
  );
};

export default Categories;
