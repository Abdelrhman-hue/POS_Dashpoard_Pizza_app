import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/utils/prisma";
import CartView from "@/components/cart/CartView";

export const metadata = {
  title: "Shopping Cart | Pizza Dashboard",
  description: "Review your selected pizzas and complete your order.",
};

export default async function CartPage() {
  const session = await auth();

  let initialUser = null;
  if (session?.user?.id) {
    initialUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        name: true,
        phone: true,
        streetAddress: true,
        postalCode: true,
        city: true,
        country: true,
      },
    });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <CartView initialUser={initialUser} />
    </main>
  );
}
