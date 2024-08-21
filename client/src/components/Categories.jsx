import React, { useState } from "react";

const categories = ["ALL", "NEWS", "SPORTS", "CODING", "EDUCATION", "FASHION"];

const Categories = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category === "ALL" ? "" : category);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`py-2 px-4 rounded-lg transition duration-300 ${
            selectedCategory === category
              ? "bg-blue-600 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default Categories;
