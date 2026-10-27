"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

type CategoryItem = {
  id: string;
  name: string;
};

type MenuFiltersProps = {
  categories: CategoryItem[];
  selectedCategoryId?: string;
  currentSearch?: string;
};

export default function MenuFilters({
  categories,
  selectedCategoryId = "",
  currentSearch = "",
}: MenuFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleCategoryChange = (catId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId) {
      params.set("category", catId);
    } else {
      params.delete("category");
    }
    startTransition(() => {
      router.push(`/menu?${params.toString()}`);
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    startTransition(() => {
      router.push(`/menu?${params.toString()}`);
    });
  };

  return (
    <div className="mb-12 space-y-6">
      {/* Search Input Centered */}
      <div className="relative mx-auto max-w-xl">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          defaultValue={currentSearch}
          onChange={handleSearchChange}
          placeholder="Search for your favorite pizza, burger, pasta..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-sm"
        />
      </div>

      {/* Category Pills Centered */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => handleCategoryChange("")}
          className={`rounded-full px-5 py-2 text-sm font-bold transition-all cursor-pointer ${
            !selectedCategoryId
              ? "bg-orange-600 text-white shadow-md shadow-orange-600/30 scale-105"
              : "border border-slate-200 bg-white text-slate-700 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
          }`}
        >
          All Items
        </button>

        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/30 scale-105"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
