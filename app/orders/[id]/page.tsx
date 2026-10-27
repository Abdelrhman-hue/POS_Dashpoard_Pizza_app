import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/utils/prisma";
import { formatCurrency } from "@/lib/FormatCurrency";
import { stripe } from "@/utils/stripe";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import PayNowButton from "@/components/orders/PayNowButton";

export const dynamic = "force-dynamic";

export default async function OrderPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string; payment?: string }>;
}) {
  const { id } = await props.params;
  const { session_id, payment } = await props.searchParams;

  let order = await prisma.order.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // If returning from Stripe Checkout: verify payment status with Stripe
  if (session_id && payment === "success" && !order.paid) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(session_id);
      if (stripeSession.payment_status === "paid") {
        order = await prisma.order.update({
          where: { id },
          data: { paid: true },
          include: {
            products: {
              include: {
                product: true,
              },
            },
          },
        });
      }
    } catch (e) {
      console.error("Failed to verify Stripe session:", e);
    }
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(order.createdAt));

  return (
    <main className="min-h-screen bg-slate-50 py-16 sm:py-20">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Success Card Header */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={44} />
          </div>

          <span className="mt-6 inline-block rounded-full bg-orange-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-orange-600">
            Order Confirmed
          </span>

          <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
            Thank you for your order!
          </h1>
          <p className="mt-2 text-slate-500">
            Your fresh food is being prepared with top-quality ingredients and will be delivered hot to your doorstep.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="rounded-xl bg-slate-100 px-3.5 py-1.5 font-mono text-slate-700 font-semibold">
              ID: {order.id.slice(0, 13)}...
            </span>
            <span className="flex items-center gap-1 rounded-xl bg-slate-100 px-3.5 py-1.5 text-slate-600 font-medium">
              <Clock size={15} />
              {formattedDate}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-bold ${
                order.paid
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {order.paid ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>Paid with Card (Stripe)</span>
                </>
              ) : (
                <>
                  <span>Cash On Delivery (Unpaid)</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Products List (2 cols) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
            <h2 className="text-lg font-black text-slate-900 mb-4">
              Ordered Items
            </h2>

            <div className="divide-y divide-slate-100">
              {order.products.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-orange-50">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Qty: {item.quantity} × {formatCurrency(item.product.basePrice)}
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-slate-800">
                    {formatCurrency(item.product.basePrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Breakdown */}
            <div className="mt-6 space-y-2 border-t border-slate-100 pt-6 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(order.subTotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-slate-900">
                  {order.deliveryFee === 0 ? "FREE" : formatCurrency(order.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-xl text-orange-600">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info (1 col) */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-4">
                Delivery Details
              </h2>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Address</strong>
                    <span>
                      {order.streetAddress}, {order.city}, {order.postalCode},{" "}
                      {order.country}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Phone</strong>
                    <span>{order.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Email</strong>
                    <span className="break-all">{order.userEmail}</span>
                  </div>
                </div>
              </div>

              {/* If unpaid, show Stripe Pay Now button */}
              {!order.paid && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-3 font-medium">
                    Want to pay online now instead of cash?
                  </p>
                  <PayNowButton orderId={order.id} />
                </div>
              )}
            </div>

            <div className="mt-8 space-y-3 pt-6 border-t border-slate-100">
              <Link
                href="/menu"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3 text-sm font-bold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-700"
              >
                <ShoppingBag size={16} />
                <span>Order Something Else</span>
              </Link>
              <Link
                href="/profile"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <span>View Order History</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
