import React from "react";
import { prisma } from "@/utils/prisma";
import ProductsManager from "@/components/admin/ProductsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products Management | Pizza Dashboard Admin",
};

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { order: "asc" },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return <ProductsManager initialProducts={products} categories={categories} />;
}
