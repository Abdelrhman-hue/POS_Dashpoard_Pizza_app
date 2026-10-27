import React from "react";
import { prisma } from "@/utils/prisma";
import OrdersManager from "@/components/admin/OrdersManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Orders Management | Pizza Dashboard Admin",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      products: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              basePrice: true,
            },
          },
        },
      },
    },
  });

  return <OrdersManager initialOrders={orders} />;
}
