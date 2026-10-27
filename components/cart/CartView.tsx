"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  CreditCard,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/FormatCurrency";
import {
  createOrderAction,
  createStripeSessionAction,
} from "@/actions/order-actions";
import Alert from "@/components/ui/Alert";

type InitialUserData = {
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  streetAddress?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
};

export default function CartView({
  initialUser,
}: {
  initialUser?: InitialUserData | null;
}) {
  const router = useRouter();
  const {
    items,
    totalCount,
    subtotal,
    deliveryFee,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoaded,
  } = useCart();

  const [formData, setFormData] = useState({
    email: initialUser?.email || "",
    phone: initialUser?.phone || "",
    streetAddress: initialUser?.streetAddress || "",
    city: initialUser?.city || "",
    postalCode: initialUser?.postalCode || "",
    country: initialUser?.country || "Egypt",
    paymentMethod: "CARD" as "COD" | "CARD",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("payment") === "cancelled") {
        return {
          open: true,
          message:
            "Stripe payment was cancelled. You can try again or choose Cash on Delivery.",
          type: "error" as "error" | "success",
        };
      }
    }
    return {
      open: false,
      message: "",
      type: "error" as "error" | "success",
    };
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setAlert({
        open: true,
        message: "Your cart is empty!",
        type: "error",
      });
      return;
    }

    if (
      !formData.email ||
      !formData.phone ||
      !formData.streetAddress ||
      !formData.city ||
      !formData.postalCode
    ) {
      setAlert({
        open: true,
        message: "Please fill in all delivery details.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        email: formData.email,
        phone: formData.phone,
        streetAddress: formData.streetAddress,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };

      const result = await createOrderAction(orderPayload);

      if (!result.success || !result.orderId) {
        setAlert({
          open: true,
          message: result.message || "Failed to place order.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      // If Credit Card via Stripe chosen:
      if (formData.paymentMethod === "CARD") {
        setAlert({
          open: true,
          message: "Order placed! Redirecting to secure Stripe Checkout...",
          type: "success",
        });

        const stripeRes = await createStripeSessionAction(result.orderId);
        if (stripeRes.success && stripeRes.url) {
          clearCart();
          window.location.href = stripeRes.url;
          return;
        } else {
          setAlert({
            open: true,
            message:
              stripeRes.message || "Failed to initialize Stripe payment.",
            type: "error",
          });
          setLoading(false);
          return;
        }
      }

      // If Cash on Delivery (COD):
      setAlert({
        open: true,
        message: "Order placed successfully! Redirecting...",
        type: "success",
      });

      clearCart();

      setTimeout(() => {
        router.push(`/orders/${result.orderId}`);
      }, 700);
    } catch (err: unknown) {
      console.error(err);
      setAlert({
        open: true,
        message:
          (err as Error).message ||
          "An unexpected error occurred. Please try again.",
        type: "error",
      });
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-orange-100 text-5xl">
          🍕
        </div>
        <h1 className="mt-6 text-3xl font-black text-slate-900 sm:text-4xl">
          Your Cart is Empty
        </h1>
        <p className="mt-3 max-w-md mx-auto text-slate-500">
          Looks like you haven&apos;t added any delicious food yet. Explore our
          menu and satisfy your cravings!
        </p>
        <Link
          href="/menu"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-700 hover:scale-105 active:scale-95"
        >
          <span>Explore Menu</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const freeDeliveryThreshold = 50;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(
    100,
    (subtotal / freeDeliveryThreshold) * 100
  );

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      {/* Alert */}
      {alert.open && (
        <div className="mb-6">
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert((p) => ({ ...p, open: false }))}
          />
        </div>
      )}

      {/* Title */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            You have {totalCount} item{totalCount > 1 ? "s" : ""} in your cart
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-red-500 hover:text-red-700 transition cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Side: Items List (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          {/* Free delivery banner */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-800">
              <Truck size={18} className="text-orange-600 shrink-0" />
              {remainingForFreeDelivery > 0 ? (
                <span>
                  Add{" "}
                  <strong className="text-orange-600">
                    {formatCurrency(remainingForFreeDelivery)}
                  </strong>{" "}
                  more to get <strong>FREE Delivery</strong>!
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-green-700">
                  <CheckCircle2 size={16} />
                  You unlocked <strong>FREE Delivery</strong>! 🎉
                </span>
              )}
            </div>
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-orange-200">
              <div
                className="h-full bg-orange-600 transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Image + Info */}
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-orange-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-slate-500">
                      {item.size && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium">
                          Size: {item.size.name}
                        </span>
                      )}
                      {item.extras && item.extras.length > 0 && (
                        <span className="rounded-md bg-orange-50 px-2 py-0.5 font-medium text-orange-700">
                          +{item.extras.map((e) => e.name).join(", ")}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-700">
                      {formatCurrency(item.unitPrice)} each
                    </div>
                  </div>
                </div>

                {/* Stepper + Line Total + Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="rounded-lg p-1 text-slate-600 transition hover:bg-white hover:text-black cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-6 text-center text-sm font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="rounded-lg p-1 text-slate-600 transition hover:bg-white hover:text-black cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Total */}
                  <span className="min-w-16 text-right font-black text-slate-900">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              <span>← Continue Ordering More Items</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Order Summary & Checkout (5 cols) */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmitOrder}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-xl font-black text-slate-900">
              Delivery & Checkout
            </h2>

            {/* Price Summary */}
            <div className="mt-6 space-y-3 border-b border-slate-100 pb-6 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold uppercase text-xs">
                      FREE
                    </span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-slate-100 pt-3 text-base">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-orange-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            {/* Customer Information Inputs */}
            <div className="mt-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Delivery Address
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+20 100 000 0000"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  required
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="Apartment, Street Name"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Cairo"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="11511"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Egypt"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700">
                  Payment Method
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, paymentMethod: "CARD" }))
                    }
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition cursor-pointer relative ${
                      formData.paymentMethod === "CARD"
                        ? "border-orange-500 bg-orange-50/70 text-orange-700 ring-2 ring-orange-500/20 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <CreditCard size={22} className="text-orange-600" />
                    <span className="mt-1.5 text-xs font-bold">Credit Card</span>
                    <span className="mt-0.5 text-[10px] font-semibold text-slate-400">
                      Stripe Gateway
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, paymentMethod: "COD" }))
                    }
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition cursor-pointer ${
                      formData.paymentMethod === "COD"
                        ? "border-orange-500 bg-orange-50/70 text-orange-700 ring-2 ring-orange-500/20 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-2xl">💵</span>
                    <span className="mt-1.5 text-xs font-bold">
                      Cash on Delivery
                    </span>
                    <span className="mt-0.5 text-[10px] font-semibold text-slate-400">
                      Pay at doorstep
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-4 font-bold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-700 active:scale-98 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>
                    {formData.paymentMethod === "CARD"
                      ? "Launching Stripe Checkout..."
                      : "Processing Order..."}
                  </span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>
                    {formData.paymentMethod === "CARD"
                      ? `Pay with Card (${formatCurrency(totalPrice)})`
                      : `Confirm Order (${formatCurrency(totalPrice)})`}
                  </span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
              <ShieldCheck size={14} />
              <span>Secured by Stripe 256-bit SSL Encryption</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
