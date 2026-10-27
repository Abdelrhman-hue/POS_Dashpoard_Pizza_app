"use client";

import React, { useState } from "react";
import { Plus, Trash2, Layers, Loader2 } from "lucide-react";
import {
  createCategoryAction,
  deleteCategoryAction,
} from "@/actions/admin-actions";

type CategoryWithCount = {
  id: string;
  name: string;
  order: number;
  _count: {
    products: number;
  };
};

export default function CategoriesManager({
  initialCategories,
}: {
  initialCategories: CategoryWithCount[];
}) {
  const [categories, setCategories] =
    useState<CategoryWithCount[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(
    null
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await createCategoryAction(newCategoryName);
      if (!res.success || !res.category) {
        setMessage({ text: res.message || "Failed to create category", error: true });
        return;
      }

      setCategories((prev) => [
        ...prev,
        { ...res.category!, _count: { products: 0 } },
      ]);
      setNewCategoryName("");
      setMessage({ text: res.message || "Category created successfully!" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, productCount: number) => {
    if (productCount > 0) {
      alert(
        `Cannot delete this category because it has ${productCount} assigned products. Reassign or delete those products first.`
      );
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) return;

    setActionLoadingId(id);
    try {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setMessage({ text: "Category deleted successfully" });
      } else {
        setMessage({ text: res.message || "Failed to delete", error: true });
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900">
          Categories Management
        </h2>
        <p className="text-xs text-slate-500">
          Organize menu items into customer-friendly categories
        </p>
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 text-xs font-semibold ${
            message.error
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add New Category Form */}
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Layers
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            required
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New Category Name (e.g. Beverages, Gourmet Pizzas)..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-600/30 transition hover:bg-orange-700 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Plus size={18} />
              <span>Add Category</span>
            </>
          )}
        </button>
      </form>

      {/* Categories List */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-base font-bold text-slate-900">
            Existing Categories ({categories.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold text-sm">
                  #{c.order}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                  <p className="text-xs text-slate-400">
                    {c._count.products} assigned product
                    {c._count.products !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(c.id, c._count.products)}
                disabled={actionLoadingId === c.id}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40 cursor-pointer"
                title={
                  c._count.products > 0
                    ? "Category has products. Reassign before deleting."
                    : "Delete category"
                }
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
