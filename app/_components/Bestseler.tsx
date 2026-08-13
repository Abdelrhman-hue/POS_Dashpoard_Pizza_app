import React from "react";
import Heading from "@/components/ui/shere/Haeding";
import Image from "next/image";
import pizza from "@/public/pizza.png";
import { formatCurrency } from "@/lib/FormatCurrency";
import { Prisma } from "@/lib/generated/prisma/client";

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: {
    category: true;
  };
}>;

async function Bestsellers() {
  const data = await fetch("http://localhost:3000/api/products/Bast", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const bestsellers = await data.json();
  return (
    <section className="w-full bg-gradient-to-b from-white to-orange-50 py-24">
      <div className="container mx-auto">
        <Heading
          title="Best Sellers"
          subtitle="Check out our most popular pizzas!"
        />

        <ul className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          {bestsellers.map((item: ProductWithCategory) => (
            <li
              key={item.id}
              className="group flex h-full flex-col animate-fade-up overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-500 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="flex justify-center">
                <Image
                  src={item.image || pizza}
                  alt={item.name}
                  width={180}
                  height={180}
                  className="h-44 w-44 object-cover rounded-4xl transition duration-500 group-hover:scale-110 group-hover:rotate-3"
                />
              </div>

              {/* Name + Price */}
              <div className="mt-6 flex items-start justify-between gap-4">
                <h3 className="line-clamp-1 text-xl font-bold text-slate-900">
                  {item.name}
                </h3>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
                  {formatCurrency(item.basePrice, "en-US", "USD")}
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 line-clamp-2 text-sm leading-7 text-gray-500">
                {item.description}
              </p>

              {/* Category */}
              <div className="mt-5">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {item.category.name}
                </span>
              </div>

              {/* Button */}
              <div className="mt-auto pt-8">
                <button className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-700 hover:shadow-lg active:scale-95">
                  🛒 Add to Cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Bestsellers;
