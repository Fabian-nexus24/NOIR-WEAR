"use client";

import CartItemList from "@/components/cart/CartItemList";
import EmptyCart from "@/components/cart/EmptyCart";
import OrderSummary from "@/components/cart/OrderSummary";
import Recommendations from "@/components/cart/Recommendations";
import { useCart } from "@/context/CartContext";
import { SITE_CONFIG } from "@/lib/site-config";
import { ArrowLeft, ArrowRight, LockKeyhole, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Cart() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className="noir-cart-page">
      <div className="noir-cart-shell">
        <div className="noir-cart-breadcrumb">
          <Link href="/shop"><ArrowLeft size={14} /> Continue shopping</Link>
          <span><LockKeyhole size={12} /> THIKA PICKUP &amp; DELIVERY</span>
        </div>

        <header className="noir-cart-heading">
          <div>
            <p className="noir-cart-eyebrow">YOUR SELECTION</p>
            <h1>Shopping <em>bag.</em></h1>
            <p className="noir-cart-count">{itemCount} {itemCount === 1 ? "item" : "items"} selected for your next look</p>
          </div>
          <div className="noir-cart-step"><span className="active">01</span><i /> <span>02 CHECKOUT</span></div>
        </header>

        <div className="noir-cart-layout">
          <section className="noir-cart-items-panel" aria-label="Items in your shopping bag">
            <div className="noir-cart-panel-heading">
              <h2>YOUR ITEMS <span>({itemCount})</span></h2>
              <span>PRICE</span>
            </div>
            <CartItemList />
            <div className="noir-cart-bottom-note">
              <ShoppingBag size={17} />
              <p>Good style starts with the details. Review your sizes and quantities before checkout.</p>
            </div>
          </section>
          <aside className="noir-cart-summary-column">
            <OrderSummary />
            <div className="noir-cart-assurance">
              <span><LockKeyhole size={14} /> THIKA PICKUP &amp; DELIVERY</span>
              <p>Confirm sizing, pickup at {SITE_CONFIG.pickupAddress}, or delivery &amp; M-Pesa details.</p>
              <a href={SITE_CONFIG.storeDirectionsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex w-fit text-sm font-semibold underline underline-offset-4 hover:text-neutral-600">
                Get directions
              </a>
            </div>
          </aside>
        </div>

        <div className="noir-cart-back-shop">
          <Link href="/shop">KEEP EXPLORING <ArrowRight size={14} /></Link>
        </div>
        <Recommendations />
      </div>
    </div>
  );
}
