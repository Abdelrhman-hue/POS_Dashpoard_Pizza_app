import React from "react";
import Link from "next/link";
import { prisma } from "@/utils/prisma";
import { formatCurrency } from "@/lib/FormatCurrency";
import {
  DollarSign,
  ShoppingBag,
  Pizza,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalOrders,
    paidOrdersCount,
    unpaidOrdersCount,
    totalProducts,
    totalCategories,
    totalUsers,
    orders,
    recentProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { paid: true } }),
    prisma.order.count({ where: { paid: false } }),
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        products: {
          include: { product: true },
        },
      },
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
  ]);

  // Aggregate revenue from paid orders
  const paidOrders = await prisma.order.findMany({
    where: { paid: true },
    select: { totalPrice: true },
  });
  const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      subtext: `${paidOrdersCount} paid orders`,
      icon: DollarSign,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      subtext: `${unpaidOrdersCount} pending payment`,
      icon: ShoppingBag,
      color: "bg-orange-500",
      lightColor: "bg-orange-50 text-orange-700",
    },
    {
      label: "Menu Products",
      value: totalProducts.toString(),
      subtext: `Across ${totalCategories} categories`,
      icon: Pizza,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 text-blue-700",
    },
    {
      label: "Registered Users",
      value: totalUsers.toString(),
      subtext: "Customers and staff",
      icon: Users,
      color: "bg-purple-500",
      lightColor: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  {stat.value}
                </h3>
                <p className="mt-1 text-xs text-slate-400">{stat.subtext}</p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.lightColor}`}
              >
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Orders & Quick Products */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Orders (2 cols) */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-500">
                Latest customer purchases in the system
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-sm">
              No orders placed yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400">
                    <th className="pb-3">Order</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => {
                    const formattedDate = new Intl.DateTimeFormat("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(order.createdAt));

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 font-mono text-xs font-bold text-slate-900">
                          #{order.id.slice(0, 8)}
                          <span className="block text-[11px] font-normal text-slate-400">
                            {formattedDate}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className="font-semibold text-slate-800 block text-xs">
                            {order.userEmail}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {order.city}, {order.phone}
                          </span>
                        </td>
                        <td className="py-3.5 font-bold text-slate-900">
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              order.paid
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.paid ? (
                              <>
                                <CheckCircle2 size={12} />
                                Paid
                              </>
                            ) : (
                              <>
                                <AlertCircle size={12} />
                                Unpaid
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            href={`/orders/${order.id}`}
                            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Menu Overview (1 col) */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Newest Products
                </h2>
                <p className="text-xs text-slate-500">Recently added menu items</p>
              </div>

              <Link
                href="/admin/products"
                className="text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                Manage
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {p.name}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      {p.category.name}
                    </span>
                  </div>
                  <span className="shrink-0 font-bold text-orange-600 text-sm">
                    {formatCurrency(p.basePrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Management Links */}
          <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg shadow-orange-600/20">
            <h3 className="text-lg font-black">Quick Actions</h3>
            <p className="mt-1 text-xs text-orange-100">
              Easily update your menu items and system settings.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                href="/admin/products"
                className="flex items-center justify-center rounded-xl bg-white/20 py-2.5 backdrop-blur-sm transition hover:bg-white hover:text-orange-600 text-center"
              >
                + Add Product
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center justify-center rounded-xl bg-white/20 py-2.5 backdrop-blur-sm transition hover:bg-white hover:text-orange-600 text-center"
              >
                + Add Category
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
