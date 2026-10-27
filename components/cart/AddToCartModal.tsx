"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Check, ShoppingBag } from "lucide-react";
import {
  useCart,
  SelectedSize,
  SelectedExtra,
  CartProductInput,
} from "@/context/CartContext";
import { formatCurrency } from "@/lib/FormatCurrency";

export type ProductCustomizationProps = {
  product: CartProductInput & {
    description?: string;
    category?: { name: string };
    sizes?: { id: string; name: string; price: number }[];
    extras?: { id: string; name: string; price: number }[];
  };
  isOpen: boolean;
  onClose: () => void;
};

const DEFAULT_SIZES: SelectedSize[] = [
  { name: "SMALL", price: 0 },
  { name: "MEDIUM", price: 3.0 },
  { name: "LARGE", price: 6.0 },
];

const DEFAULT_EXTRAS: SelectedExtra[] = [
  { name: "CHEESE", price: 1.5 },
  { name: "BACON", price: 2.0 },
  { name: "TOMATO", price: 0.75 },
  { name: "ONION", price: 0.75 },
  { name: "PEPPER", price: 0.75 },
];

const emptySubscribe = () => () => {};

export default function AddToCartModal({
  product,
  isOpen,
  onClose,
}: ProductCustomizationProps) {
  const { addToCart } = useCart();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const availableSizes: SelectedSize[] =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : DEFAULT_SIZES;

  const availableExtras: SelectedExtra[] =
    product.extras && product.extras.length > 0
      ? product.extras
      : DEFAULT_EXTRAS;

  const [selectedSize, setSelectedSize] = useState<SelectedSize>(
    availableSizes[0] || { name: "SMALL", price: 0 }
  );
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const toggleExtra = (extra: SelectedExtra) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.name === extra.name);
      if (exists) {
        return prev.filter((e) => e.name !== extra.name);
      }
      return [...prev, extra];
    });
  };

  const unitPrice =
    product.basePrice +
    selectedSize.price +
    selectedExtras.reduce((sum, e) => sum + e.price, 0);

  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        basePrice: product.basePrice,
      },
      selectedSize,
      selectedExtras,
      quantity
    );

    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 500);
  };

  if (!isOpen || !isClient) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Full-screen Dark Blur Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Dialog Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 my-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-md backdrop-blur-sm transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left Column: Product Image & Info (2 cols on MD) */}
            <div className="md:col-span-2 relative bg-gradient-to-b from-orange-50/80 to-orange-100/40 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100">
              <div className="relative h-48 w-48 sm:h-52 sm:w-52 overflow-hidden rounded-3xl shadow-lg ring-4 ring-white">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {product.category?.name && (
                <span className="mt-4 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-600 shadow-sm">
                  {product.category.name}
                </span>
              )}

              <h2 className="mt-3 text-xl font-black text-slate-900 leading-snug">
                {product.name}
              </h2>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-xs line-clamp-3">
                {product.description}
              </p>

              <div className="mt-3 text-lg font-black text-orange-600">
                Base: {formatCurrency(product.basePrice)}
              </div>
            </div>

            {/* Right Column: Options & Controls (3 cols on MD) */}
            <div className="md:col-span-3 p-6 sm:p-7 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
              <div className="space-y-6">
                {/* 1. Pick Size */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2.5">
                    1. Choose Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSizes.map((size) => {
                      const isSelected = selectedSize.name === size.name;
                      return (
                        <button
                          key={size.name}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`flex flex-col items-center justify-center rounded-2xl border p-3 transition-all cursor-pointer ${
                            isSelected
                              ? "border-orange-500 bg-orange-50/80 text-orange-700 shadow-sm ring-2 ring-orange-500/20"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-xs font-bold uppercase">
                            {size.name}
                          </span>
                          <span className="mt-1 text-[11px] font-semibold text-slate-500">
                            {size.price > 0
                              ? `+${formatCurrency(size.price)}`
                              : "Standard"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Choose Extras */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2.5">
                    2. Extra Ingredients (Optional)
                  </label>
                  <div className="space-y-2">
                    {availableExtras.map((extra) => {
                      const isSelected = selectedExtras.some(
                        (e) => e.name === extra.name
                      );
                      return (
                        <button
                          key={extra.name}
                          type="button"
                          onClick={() => toggleExtra(extra)}
                          className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs transition cursor-pointer ${
                            isSelected
                              ? "border-orange-500 bg-orange-50/60 text-slate-900"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded-md border transition ${
                                isSelected
                                  ? "border-orange-600 bg-orange-600 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                            <span className="font-semibold capitalize">
                              Extra {extra.name.toLowerCase()}
                            </span>
                          </div>
                          <span className="font-bold text-orange-600">
                            +{formatCurrency(extra.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions: Stepper + Add Button */}
              <div className="mt-8 pt-5 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="rounded-lg p-1 text-slate-600 hover:bg-white hover:text-black transition"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="min-w-6 text-center text-sm font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="rounded-lg p-1 text-slate-600 hover:bg-white hover:text-black transition"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={addedAnimation}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:bg-orange-700 active:scale-98 disabled:bg-green-600 cursor-pointer"
                  >
                    {addedAnimation ? (
                      <>
                        <Check size={18} strokeWidth={3} />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={18} />
                        <span>Add to Cart</span>
                        <span className="ml-1 opacity-90">
                          ({formatCurrency(totalPrice)})
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
