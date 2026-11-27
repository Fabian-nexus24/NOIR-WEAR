"use client";

import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";
import CartItem from "./CartItem";

export default function CartItemList() {
  const { cart, clearCart } = useCart();

  return (
    <div className="noir-cart-item-list">
      <div className="noir-cart-clear-row">
        <span>PRODUCT DETAILS</span>
        <button type="button" onClick={clearCart} aria-label="Remove all items from bag">
          <Trash2 size={13} /> Clear bag
        </button>
      </div>
      {cart.map((item) => (
        <CartItem
          key={`${item.id}-${item.size || "one-size"}-${item.colour || "default"}`}
          item={item}
        />
      ))}
    </div>
  );
}
