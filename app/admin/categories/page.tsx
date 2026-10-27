import React from "react";
import { prisma } from "@/utils/prisma";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Categories Management | Pizza Dashboard Admin",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return <CategoriesManager initialCategories={categories} />;
}
