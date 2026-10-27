"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { formatCurrency } from "@/lib/FormatCurrency";
import { toggleOrderPaidAction, deleteOrderAction } from "@/actions/order-actions";

type OrderItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    image: string;
    basePrice: number;
  };
};

type OrderData = {
  id: string;
  userEmail: string;
  phone: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  subTotal: number;
  deliveryFee: number;
  totalPrice: number;
  paid: boolean;
  createdAt: string | Date;
  products: OrderItem[];
};

export default function OrdersManager({
  initialOrders,
}: {
  initialOrders: OrderData[];
}) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PAID" | "UNPAID">("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "ALL"
        ? true
        : filter === "PAID"
        ? order.paid
        : !order.paid;

    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      order.id.toLowerCase().includes(query) ||
      order.userEmail.toLowerCase().includes(query) ||
      order.phone.toLowerCase().includes(query) ||
      order.city.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const handleTogglePaid = async (orderId: string) => {
    setLoadingActionId(orderId);
    try {
      const res = await toggleOrderPaidAction(orderId);
      if (res.success && res.paid !== undefined) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, paid: res.paid! } : o))
        );
      }
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Are you sure you want to permanently delete this order?")) {
      return;
    }

    setLoadingActionId(orderId);
    try {
      const res = await deleteOrderAction(orderId);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Orders Management
          </h2>
          <p className="text-xs text-slate-500">
            {orders.length} total orders recorded
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 rounded-2xl bg-white p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              filter === "ALL"
                ? "bg-orange-600 text-white shadow-sm"
                : "text-slate-600 hover:text-black"
            }`}
          >
            All ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("PAID")}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              filter === "PAID"
                ? "bg-green-600 text-white shadow-sm"
                : "text-slate-600 hover:text-black"
            }`}
          >
            Paid ({orders.filter((o) => o.paid).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("UNPAID")}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              filter === "UNPAID"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-600 hover:text-black"
            }`}
          >
            Unpaid ({orders.filter((o) => !o.paid).length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, email, city, or phone..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs font-medium text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-sm"
        />
      </div>

      {/* Orders List / Table */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500 text-sm">
            No matching orders found.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const isLoading = loadingActionId === order.id;
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(order.createdAt));

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition hover:border-orange-300"
              >
                {/* Main Row */}
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOrderId(isExpanded ? null : order.id)
                      }
                      className="mt-1 rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                    >
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={13} />
                          {formattedDate}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span className="font-medium flex items-center gap-1">
                          <Mail size={13} className="text-slate-400" />
                          {order.userEmail}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone size={13} className="text-slate-400" />
                          {order.phone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" />
                          {order.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right">
                      <p className="text-base font-black text-slate-900">
                        {formatCurrency(order.totalPrice)}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {order.products.reduce((s, p) => s + p.quantity, 0)} items
                      </p>
                    </div>

                    {/* Paid Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleTogglePaid(order.id)}
                      disabled={isLoading}
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                        order.paid
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                    >
                      {order.paid ? (
                        <>
                          <CheckCircle2 size={14} />
                          <span>Paid</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={14} />
                          <span>Unpaid (COD)</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/orders/${order.id}`}
                      target="_blank"
                      className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-orange-600"
                      title="View public invoice"
                    >
                      <ExternalLink size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(order.id)}
                      disabled={isLoading}
                      className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Delete order"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Order Details & Delivery Address
                    </h4>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                      <div className="space-y-1 text-slate-600">
                        <p>
                          <strong>Full Address:</strong> {order.streetAddress},{" "}
                          {order.city} {order.postalCode}, {order.country}
                        </p>
                        <p>
                          <strong>Phone:</strong> {order.phone}
                        </p>
                        <p>
                          <strong>Customer Email:</strong> {order.userEmail}
                        </p>
                      </div>

                      <div className="space-y-1 text-slate-600">
                        <p>
                          <strong>Subtotal:</strong>{" "}
                          {formatCurrency(order.subTotal)}
                        </p>
                        <p>
                          <strong>Delivery Fee:</strong>{" "}
                          {order.deliveryFee === 0
                            ? "FREE"
                            : formatCurrency(order.deliveryFee)}
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          <strong>Grand Total:</strong>{" "}
                          {formatCurrency(order.totalPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-200/70 pt-3">
                      <h5 className="text-xs font-bold text-slate-700 mb-2">
                        Purchased Items:
                      </h5>
                      <div className="divide-y divide-slate-200/60">
                        {order.products.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between py-2 text-xs text-slate-800"
                          >
                            <span className="font-medium">
                              {p.quantity} × {p.product.name}
                            </span>
                            <span className="font-bold">
                              {formatCurrency(p.product.basePrice * p.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
