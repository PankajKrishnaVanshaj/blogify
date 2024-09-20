import React, { useState } from "react";

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category === "All" ? "" : category);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`py-2 px-4 rounded-lg transition duration-300 ${
            selectedCategory === category
              ? "bg-pink-600 text-white"
              : "bg-primary text-white hover:bg-pink-600"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default Categories;
