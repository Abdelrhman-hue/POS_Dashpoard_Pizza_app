/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from "@/lib/generated/prisma/client";
import Image from "next/image";
import { formatCurrency } from "@/lib/FormatCurrency";
import  CategoryButton  from "@/components/ui/CategroyButton";

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: {
    category: true;
  };
}>;

async function MenuPage() {
  const data = await fetch("http://localhost:3000/api/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const products = await data.json();
  return (
    <section className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-slate-900">Our Menu</h1>
          <p className="mt-3 text-lg text-slate-500">
            Freshly prepared with premium ingredients 🍕
          </p>
        </div>

        {/* Search + Filter */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search pizza..."
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 outline-none transition focus:border-orange-500 md:max-w-md"
          />

          <CategoryButton />
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Card */}
          {products.map((item: ProductWithCategory) => {
            return (
              <div key={item.id} className="group rounded-3xl bg-white p-6 shadow transition hover:-translate-y-2 hover:shadow-xl">
                <div className="flex justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={176}
                    height={176}
                    className="h-44 w-44 rounded-3xl object-cover transition duration-500 group-hover:scale-110 group-hover:rotate-3 bg-orange-100"
                  />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold">{item.name}</h3>

                  <span className="font-bold text-orange-600">{formatCurrency(item.basePrice)}</span>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-5">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                    {item.category.name}
                  </span>
                </div>

                <button className="mt-8 w-full rounded-full bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700">
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MenuPage;
