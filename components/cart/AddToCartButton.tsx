"use client";

import React, { useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import AddToCartModal from "./AddToCartModal";
import { CartProductInput } from "@/context/CartContext";

type AddToCartButtonProps = {
  product: CartProductInput & {
    description?: string;
    category?: { name: string };
    sizes?: { id: string; name: string; price: number }[];
    extras?: { id: string; name: string; price: number }[];
  };
  className?: string;
  label?: string;
};

export default function AddToCartButton({
  product,
  className,
  label = "Add to Cart",
}: AddToCartButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ||
          "flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 py-3 font-semibold text-white shadow-md shadow-orange-600/20 transition-all duration-300 hover:bg-orange-700 hover:shadow-lg active:scale-95 cursor-pointer"
        }
      >
        <BsCartPlus size={18} />
        <span>{label}</span>
      </button>

      {isOpen && (
        <AddToCartModal
          product={product}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
