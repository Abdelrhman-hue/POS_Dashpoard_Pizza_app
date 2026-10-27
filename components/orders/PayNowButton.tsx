"use client";

import React, { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { createStripeSessionAction } from "@/actions/order-actions";

export default function PayNowButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await createStripeSessionAction(orderId);
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        alert(res.message || "Failed to start payment.");
        setLoading(false);
      }
    } catch (err: unknown) {
      console.error(err);
      alert((err as Error).message || "An error occurred.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3 text-sm font-bold text-white shadow-md shadow-orange-600/30 transition hover:bg-orange-700 disabled:opacity-60 cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Connecting to Stripe...</span>
        </>
      ) : (
        <>
          <CreditCard size={16} />
          <span>Pay Now with Card (Stripe)</span>
        </>
      )}
    </button>
  );
}
