import React, { Suspense } from "react";
import Image from "next/image";
import { prisma } from "@/utils/prisma";
import { formatCurrency } from "@/lib/FormatCurrency";
import MenuFilters from "@/components/menu/MenuFilters";
import AddToCartButton from "@/components/cart/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function MenuPage(props: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const categoryId = searchParams.category || "";
  const query = searchParams.search || "";

  // Fetch categories
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  // Fetch products with filters
  const products = await prisma.product.findMany({
    where: {
      AND: [
        categoryId ? { categoryId } : {},
        query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    include: {
      category: true,
      sizes: true,
      extras: true,
    },
    orderBy: { order: "asc" },
  });

  return (
    <section className="min-h-screen bg-slate-50 py-16 sm:py-20">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mb-12 text-center">
          <span className="rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
            Freshly Made Everyday
          </span>
          <h1 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
            Explore Our Menu
          </h1>
          <p className="mt-3 text-base text-slate-500 sm:text-lg">
            Handcrafted with love, premium cheeses, and the freshest ingredients 🍕
          </p>
        </div>

        {/* Filters */}
        <Suspense fallback={<div className="h-14 mb-12" />}>
          <MenuFilters
            categories={categories}
            selectedCategoryId={categoryId}
            currentSearch={query}
          />
        </Suspense>

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <span className="text-5xl">🍽️</span>
            <h3 className="mt-4 text-xl font-bold text-slate-800">
              No delicious items found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search or category filter.
            </p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-orange-200"
              >
                <div>
                  {/* Image */}
                  <div className="relative flex justify-center overflow-hidden rounded-2xl bg-orange-50/50 p-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={180}
                      height={180}
                      className="h-44 w-44 rounded-2xl object-cover transition duration-500 group-hover:scale-110 group-hover:rotate-2"
                    />
                  </div>

                  {/* Header & Price */}
                  <div className="mt-5 flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition">
                      {item.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-sm font-black text-orange-600">
                      {formatCurrency(item.basePrice)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>

                  {/* Category Pill */}
                  <div className="mt-4">
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                      {item.category.name}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-6 pt-2">
                  <AddToCartButton product={item} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
