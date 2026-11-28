"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  colour?: string;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, size?: string, colour?: string) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number, size?: string, colour?: string) => void;
}

const CART_KEY = "cart";
const CART_CHANGE_EVENT = "noir-cart-change";
const EMPTY_CART: CartItem[] = [];
let lastSerialized: string | null = null;
let cachedCart: CartItem[] = EMPTY_CART;

function getCartSnapshot() {
  if (typeof window === "undefined") return EMPTY_CART;
  let serialized = "[]";
  try {
    serialized = window.localStorage.getItem(CART_KEY) ?? "[]";
  } catch {
    return cachedCart;
  }
  if (serialized === lastSerialized) return cachedCart;
  lastSerialized = serialized;
  try {
    const parsed: unknown = JSON.parse(serialized);
    cachedCart = Array.isArray(parsed) ? parsed as CartItem[] : EMPTY_CART;
  } catch {
    cachedCart = EMPTY_CART;
  }
  return cachedCart;
}

function subscribeToCart(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CART_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CART_CHANGE_EVENT, callback);
  };
}

function writeCart(cart: CartItem[]) {
  const serialized = JSON.stringify(cart);
  try {
    window.localStorage.setItem(CART_KEY, serialized);
  } catch {
    // Keep the shopping bag usable when browser storage is unavailable.
  }
  lastSerialized = serialized;
  cachedCart = cart;
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const cart = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => EMPTY_CART);

  const addToCart = (item: CartItem) => {
    const current = getCartSnapshot();
    const existing = current.find((cartItem) => cartItem.id === item.id && cartItem.size === item.size && cartItem.colour === item.colour);
    if (existing) {
      writeCart(current.map((cartItem) =>
        cartItem.id === item.id && cartItem.size === item.size && cartItem.colour === item.colour
          ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
          : cartItem,
      ));
      return;
    }
    writeCart([...current, { ...item, quantity: item.quantity || 1 }]);
  };

  const removeFromCart = (id: number, size?: string, colour?: string) => {
    writeCart(getCartSnapshot().filter((item) => !(item.id === id && item.size === size && item.colour === colour)));
  };

  const clearCart = () => writeCart([]);

  const updateQuantity = (id: number, quantity: number, size?: string, colour?: string) => {
    writeCart(getCartSnapshot().map((item) =>
      item.id === id && item.size === size && item.colour === colour
        ? { ...item, quantity: Math.max(1, quantity) }
        : item,
    ));
  };

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
