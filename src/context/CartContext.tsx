import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, Product, ProductVariant } from "@/lib/products";

type CartContextValue = {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, variant: ProductVariant | null, quantity: number) => void;
  updateQty: (index: number, qty: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "pgrb-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [cart]);

  const addToCart = (product: Product, variant: ProductVariant | null, quantity: number) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.slug === product.slug && item.variant?.slug === variant?.slug
      );
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], quantity: next[existingIndex].quantity + quantity };
        return next;
      }
      return [...prev, { product, variant, quantity }];
    });
  };

  const updateQty = (index: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: qty };
      return next;
    });
  };

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, totalItems, totalPrice, addToCart, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
