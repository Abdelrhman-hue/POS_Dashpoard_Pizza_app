"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

export type SelectedSize = {
  id?: string;
  name: string;
  price: number;
};

export type SelectedExtra = {
  id?: string;
  name: string;
  price: number;
};

export type CartProductInput = {
  id: string;
  name: string;
  image: string;
  basePrice: number;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  basePrice: number;
  size?: SelectedSize;
  extras?: SelectedExtra[];
  unitPrice: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  addToCart: (
    product: CartProductInput,
    size?: SelectedSize,
    extras?: SelectedExtra[],
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isLoaded: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "pizza_dashboard_cart_v1";

const emptySubscribe = () => () => {};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const isLoaded = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  const generateCartItemId = (
    productId: string,
    size?: SelectedSize,
    extras?: SelectedExtra[]
  ) => {
    const sizePart = size?.name || "base";
    const extrasPart = (extras || [])
      .map((e) => e.name)
      .sort()
      .join("_");
    return `${productId}-${sizePart}-${extrasPart || "noextras"}`;
  };

  const calculateUnitPrice = (
    basePrice: number,
    size?: SelectedSize,
    extras?: SelectedExtra[]
  ) => {
    const sizePrice = size?.price || 0;
    const extrasPrice = (extras || []).reduce((acc, curr) => acc + curr.price, 0);
    return Number((basePrice + sizePrice + extrasPrice).toFixed(2));
  };

  const addToCart = (
    product: CartProductInput,
    size?: SelectedSize,
    extras?: SelectedExtra[],
    quantity = 1
  ) => {
    const cartItemId = generateCartItemId(product.id, size, extras);
    const unitPrice = calculateUnitPrice(product.basePrice, size, extras);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [
        ...prevItems,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          image: product.image,
          basePrice: product.basePrice,
          size,
          extras,
          unitPrice,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2)
  );
  // Free delivery over $50, else $5
  const deliveryFee = items.length === 0 ? 0 : subtotal >= 50 ? 0 : 5;
  const totalPrice = Number((subtotal + deliveryFee).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        deliveryFee,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
