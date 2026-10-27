"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Package,
  LogOut,
  Edit3,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { logout } from "@/actions/auth-actions";
import { useState } from "react";
import { formatCurrency } from "@/lib/FormatCurrency";

export type UserData = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  streetAddress: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
};

export type RealOrderData = {
  id: string;
  createdAt: Date | string;
  totalPrice: number;
  paid: boolean;
  products: {
    id: string;
    quantity: number;
    product: {
      name: string;
    };
  }[];
};

export default function ProfileClient({
  user,
  orders = [],
}: {
  user: UserData;
  orders?: RealOrderData[];
}) {
  const [loading, setLoading] = useState(false);
  const address = [user.streetAddress, user.city, user.country]
    .filter(Boolean)
    .join(", ");

  async function handleLogout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await logout();
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-orange-50/20 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Manage your account settings and check your order history.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* User Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div>
              {/* Avatar + Name */}
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-3xl font-bold text-white shadow-xl shadow-orange-500/20 ring-4 ring-orange-50">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={112}
                        height={112}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              {/* Info List */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3.5 text-sm text-gray-700">
                  <Mail size={18} className="text-orange-600 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3.5 text-sm text-gray-700">
                  <Phone size={18} className="text-orange-600 shrink-0" />
                  <span>{user.phone || "No phone added"}</span>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-3.5 text-sm text-gray-700">
                  <MapPin size={18} className="text-orange-600 shrink-0 mt-0.5" />
                  <span>{address || "No address added yet"}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
              <Link
                href="/profile/edit-profile"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3 text-sm font-bold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-700"
              >
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </Link>

              <form onSubmit={handleLogout}>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>{loading ? "Signing out..." : "Sign Out"}</span>
                </button>
              </form>
            </div>
          </motion.div>

          {/* Orders Section (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    Order History
                  </h2>
                  <p className="text-sm text-gray-500">
                    All your past and active orders
                  </p>
                </div>

                <Link
                  href="/menu"
                  className="flex items-center gap-1.5 text-sm font-bold text-orange-600 transition hover:text-orange-700"
                >
                  <ShoppingBag size={16} />
                  <span>Order Again</span>
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-2xl">
                    📦
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-800">
                    No orders placed yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Craving delicious pizza? Make your first order today!
                  </p>
                  <Link
                    href="/menu"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-700"
                  >
                    <span>Browse Menu</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => {
                    const formattedDate = new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(order.createdAt));

                    const totalItems = order.products.reduce(
                      (sum, p) => sum + p.quantity,
                      0
                    );

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                        className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition hover:border-orange-200 hover:bg-orange-50/30 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                            <Package size={22} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-mono text-sm font-bold text-gray-900 truncate">
                              #{order.id.slice(0, 8)}
                            </h3>
                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                              <span>{formattedDate}</span>
                              <span>•</span>
                              <span>
                                {totalItems} item{totalItems > 1 ? "s" : ""}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div>
                            <p className="text-[11px] text-gray-400">Total</p>
                            <p className="text-sm font-black text-gray-900">
                              {formatCurrency(order.totalPrice)}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              order.paid
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.paid ? "Paid" : "Cash On Delivery"}
                          </span>

                          <Link
                            href={`/orders/${order.id}`}
                            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-orange-500 hover:text-orange-600"
                            title="View details"
                          >
                            <ChevronRight size={18} />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
