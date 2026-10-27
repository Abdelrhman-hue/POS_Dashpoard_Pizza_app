"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/FormatCurrency";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/actions/admin-actions";

type CategoryItem = {
  id: string;
  name: string;
};

type ProductItem = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
};

export default function ProductsManager({
  initialProducts,
  categories,
}: {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
}) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: categories[0]?.id || "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      !selectedCategory || p.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      basePrice: "",
      categoryId: categories[0]?.id || "",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    });
    setError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice.toString(),
      categoryId: product.categoryId,
      image: product.image,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        categoryId: formData.categoryId,
        image: formData.image,
      };

      if (editingProduct) {
        const res = await updateProductAction(editingProduct.id, payload);
        if (!res.success || !res.product) {
          setError(res.message || "Failed to update product");
          setLoading(false);
          return;
        }

        const categoryObj = categories.find((c) => c.id === payload.categoryId)!;
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? { ...res.product!, category: categoryObj }
              : p
          )
        );
      } else {
        const res = await createProductAction(payload);
        if (!res.success || !res.product) {
          setError(res.message || "Failed to create product");
          setLoading(false);
          return;
        }

        const categoryObj = categories.find((c) => c.id === payload.categoryId)!;
        setProducts((prev) => [
          { ...res.product!, category: categoryObj },
          ...prev,
        ]);
      }

      setModalOpen(false);
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await deleteProductAction(id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert(res.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & New Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Products & Menu Items
          </h2>
          <p className="text-xs text-slate-500">
            Total {products.length} products on the menu
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-600/30 transition hover:bg-orange-700 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or description..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs font-medium text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-sm"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 outline-none shadow-sm cursor-pointer"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500 text-sm">
          No matching products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md"
            >
              <div>
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-orange-50">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
                    {p.category.name}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                    {p.name}
                  </h3>
                  <span className="shrink-0 font-black text-orange-600 text-base">
                    {formatCurrency(p.basePrice)}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                  {p.description}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  title="Delete product"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-slate-900">
              {editingProduct ? "Edit Product" : "Add New Menu Item"}
            </h3>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Truffle Mushroom Pizza"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, categoryId: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, basePrice: e.target.value }))
                    }
                    placeholder="12.99"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Fresh ingredients, house-made tomato sauce, mozzarella..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-slate-700">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, image: e.target.value }))
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-orange-500"
                />

                {formData.image && (
                  <div className="mt-3 relative h-28 w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-200">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-2xl bg-orange-600 py-3 text-sm font-bold text-white shadow-md shadow-orange-600/30 hover:bg-orange-700 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  ) : editingProduct ? (
                    "Save Changes"
                  ) : (
                    "Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
