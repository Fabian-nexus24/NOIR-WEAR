"use client";

import { useCart } from "@/context/CartContext";
import { formatKES } from "@/lib/utils";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    colour?: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <article className="noir-cart-item">
      <div className="noir-cart-item-image">
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 112px, 150px" className="object-cover" />
      </div>
      <div className="noir-cart-item-info">
        <div className="noir-cart-item-topline">
          <div>
            <p className="noir-cart-item-label">NOIR / SELECTED PIECE</p>
            <h3>{item.name}</h3>
          </div>
          <button
            type="button"
            className="noir-cart-remove"
            onClick={() => removeFromCart(item.id, item.size, item.colour)}
            aria-label={`Remove ${item.name} from bag`}
          ><X size={17} /></button>
        </div>
        <div className="noir-cart-variant">
          {item.size && <span>SIZE: {item.size}</span>}
          {item.colour && <span>COLOUR: {item.colour}</span>}
          {!item.size && !item.colour && <span>ONE SIZE / STANDARD</span>}
        </div>
        <div className="noir-cart-item-bottom">
          <div className="noir-cart-qty" aria-label={`Quantity ${item.quantity}`}>
            <button type="button" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.size, item.colour)} disabled={item.quantity <= 1} aria-label="Decrease quantity"><Minus size={13} /></button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.colour)} aria-label="Increase quantity"><Plus size={13} /></button>
          </div>
          <div className="noir-cart-price-block">
            <span>{formatKES(item.price)} each</span>
            <strong>{formatKES(item.price * item.quantity)}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}
