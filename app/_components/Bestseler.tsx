import React from "react";
import Heading from "@/components/ui/shere/Haeding";
import Image from "next/image";
import pizza from "@/public/pizza.png";
import { formatCurrency } from "@/lib/FormatCurrency";
import { prisma } from "@/utils/prisma";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default async function Bestsellers() {
  const bestsellers = await prisma.product.findMany({
    take: 8,
    include: {
      category: true,
      sizes: true,
      extras: true,
    },
    orderBy: {
      order: "desc",
    },
  });

  return (
    <section className="w-full bg-gradient-to-b from-white to-orange-50/60 py-24">
      <div className="container mx-auto px-4">
        <Heading
          title="Best Sellers"
          subtitle="Check out our most popular, freshly-baked pizzas!"
        />

        <ul className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bestsellers.map((item) => (
            <li
              key={item.id}
              className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-500 hover:shadow-2xl"
            >
              <div>
                {/* Image */}
                <div className="flex justify-center overflow-hidden rounded-2xl bg-orange-50/40 p-4">
                  <Image
                    src={item.image || pizza}
                    alt={item.name}
                    width={180}
                    height={180}
                    className="h-44 w-44 object-cover rounded-2xl transition duration-500 group-hover:scale-110 group-hover:rotate-3"
                  />
                </div>

                {/* Name + Price */}
                <div className="mt-6 flex items-start justify-between gap-4">
                  <h3 className="line-clamp-1 text-xl font-bold text-slate-900 group-hover:text-orange-600 transition">
                    {item.name}
                  </h3>

                  <span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
                    {formatCurrency(item.basePrice)}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>

                {/* Category */}
                <div className="mt-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {item.category.name}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="mt-8 pt-2">
                <AddToCartButton product={item} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
