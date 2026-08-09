"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  Settings,
  LogOut,
  Edit3,
  Camera,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { logout } from "@/actions/auth-actions";
import { useState } from "react";

type UserData = {
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

type Order = {
  id: string;
  date: string;
  status: "Delivered" | "Processing";
  total: string;
  items: number;
};

const orders: Order[] = [
  {
    id: "#ORD-1001",
    date: "Aug 5, 2026",
    status: "Delivered",
    total: "$42.99",
    items: 3,
  },
  {
    id: "#ORD-1002",
    date: "Aug 2, 2026",
    status: "Processing",
    total: "$28.50",
    items: 2,
  },
  {
    id: "#ORD-1003",
    date: "Jul 28, 2026",
    status: "Delivered",
    total: "$65.20",
    items: 5,
  },
];

export default function ProfileClient({ user }: { user: UserData }) {
  const [loading, setLoading] = useState(false);
  const address = [user.streetAddress, user.city, user.country]
    .filter(Boolean)
    .join(", ");

  async function handleLogout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    try {
      await logout();
      window.location.href = "/Auth/login";
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  }

  const fullAddress = [
    user.streetAddress,
    user.city,
    user.postalCode,
    user.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 px-3 py-6 sm:px-5 sm:py-8 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage your account and check your orders.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-5 md:gap-8 lg:grid-cols-3">
          {/* ================= PROFILE CARD ================= */}
          <motion.section
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white p-5 shadow-xl sm:p-6 lg:col-span-1"
          >
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="group relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-4xl font-bold text-white shadow-lg sm:h-32 sm:w-32 sm:text-5xl">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>

                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-orange-600 text-white transition hover:scale-110 hover:bg-orange-700 sm:h-10 sm:w-10"
                >
                  <Camera size={17} />
                </button>
              </div>

              <h2 className="mt-4 max-w-full truncate text-center text-xl font-bold text-gray-900 sm:mt-5 sm:text-2xl">
                {user.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">Customer</p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-100 sm:mt-6 sm:text-base"
              >
                <Edit3 size={18} />
                Edit Profile
              </motion.button>
            </div>

            {/* User Information */}
            <div className="mt-7 space-y-5 sm:mt-8">
              {/* Email */}
              <InfoItem
                icon={<Mail size={20} />}
                label="Email"
                value={user.email}
              />

              {/* Phone */}
              <InfoItem
                icon={<Phone size={20} />}
                label="Phone"
                value={user.phone || "Not provided"}
              />

              {/* Address */}
              <InfoItem
                icon={<MapPin size={20} />}
                label="Address"
                value={fullAddress || "Not provided"}
              />
            </div>

            {/* Logout */}
            <form onSubmit={handleLogout}>
              <button
                type="submit"
                disabled={loading}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
                    Logging out...
                  </>
                ) : (
                  <>
                    Logout
                    <LogOut size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.section>

          {/* ================= RIGHT SIDE ================= */}
          <div className="space-y-5 md:space-y-8 lg:col-span-2">
            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15,
              }}
              className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
            >
              <StatCard
                icon={<ShoppingBag size={22} />}
                title="Orders"
                value="12"
              />

              <StatCard
                icon={<Package size={22} />}
                title="Delivered"
                value="10"
              />

              <StatCard
                icon={<Heart size={22} />}
                title="Favorites"
                value="8"
              />

              <StatCard
                icon={<Settings size={22} />}
                title="Points"
                value="240"
              />
            </motion.div>

            {/* Recent Orders */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.25,
              }}
              className="rounded-3xl bg-white p-4 shadow-xl sm:p-6"
            >
              {/* Header */}
              <div className="mb-5 flex items-center justify-between sm:mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    Recent Orders
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Your latest orders
                  </p>
                </div>

                <button
                  type="button"
                  className="hidden items-center gap-1 text-sm font-semibold text-orange-600 transition hover:text-orange-700 sm:flex"
                >
                  View All
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Orders */}
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{
                      opacity: 0,
                      x: 30,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.35 + index * 0.1,
                    }}
                    whileHover={{
                      scale: 1.01,
                    }}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-orange-200 hover:bg-orange-50/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Order Info */}
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 sm:h-12 sm:w-12">
                        <Package size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                          {order.id}
                        </h3>

                        <p className="text-xs text-gray-500 sm:text-sm">
                          {order.date} • {order.items} items
                        </p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-6">
                      {/* Total */}
                      <div>
                        <p className="text-xs text-gray-400 sm:text-sm">
                          Total
                        </p>

                        <p className="text-sm font-bold text-gray-900 sm:text-base">
                          {order.total}
                        </p>
                      </div>

                      {/* Status */}
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold sm:px-3 sm:text-xs ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </span>

                      {/* Arrow */}
                      <button
                        type="button"
                        className="hidden rounded-full p-2 text-gray-400 transition hover:bg-white hover:text-orange-600 sm:block"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile View All */}
              <button
                type="button"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 sm:hidden"
              >
                View All Orders
                <ChevronRight size={18} />
              </button>
            </motion.section>

            {/* Quick Actions */}
            <motion.section
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.35,
              }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
            >
              <ActionCard
                icon={<Heart size={22} />}
                title="Favorites"
                description="View your favorite meals"
              />

              <ActionCard
                icon={<Settings size={22} />}
                title="Account Settings"
                description="Manage your account settings"
              />
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ================================= */
/* Info Item */
/* ================================= */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 sm:h-11 sm:w-11">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400">{label}</p>

        <p className="truncate text-sm font-medium text-gray-700 sm:text-base">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ================================= */
/* Statistics Card */
/* ================================= */

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="rounded-2xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-5"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600 sm:h-10 sm:w-10">
        {icon}
      </div>

      <p className="mt-3 text-xs text-gray-500 sm:mt-4 sm:text-sm">{title}</p>

      <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
        {value}
      </p>
    </motion.div>
  );
}

/* ================================= */
/* Action Card */
/* ================================= */

function ActionCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{
        y: -5,
      }}
      whileTap={{
        scale: 0.98,
      }}
      className="flex min-w-0 items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-lg transition hover:shadow-xl sm:gap-4 sm:p-5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 sm:h-12 sm:w-12">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-bold text-gray-900">{title}</h3>

        <p className="mt-1 truncate text-xs text-gray-500 sm:text-sm">
          {description}
        </p>
      </div>

      <ChevronRight
        size={18}
        className="shrink-0 text-gray-400 sm:h-5 sm:w-5"
      />
    </motion.button>
  );
}
