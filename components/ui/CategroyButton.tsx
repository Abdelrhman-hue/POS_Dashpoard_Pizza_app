"use client";

import { useState } from "react";

const categories = [
  { id: "", name: "All" },
  { id: "4bda492a-bc89-42d5-84e8-cafa5a5549d8", name: "Pizza" },
  { id: "9e331fb0-3a47-4510-bca2-7646f64c6c9c", name: "Burger" },
  { id: "f5f31222-ec47-4cd8-a313-a49c8cce4a0e", name: "Pasta" },
  { id: "efa9b8c6-c4d5-42b8-a64c-6be8ea7a6fb2", name: "Salads" },
  { id: "08ea0b6a-c708-4574-80fe-22f53083aab4", name: "Desserts" },
];

function CategoryButton() {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`rounded-full px-5 py-2 font-medium transition-all duration-300 ${
            selectedCategory === category.id
              ? "bg-orange-600 text-white shadow-lg"
              : "border border-slate-300 bg-white text-slate-700 hover:border-orange-600 hover:bg-orange-50 hover:text-orange-600"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryButton;