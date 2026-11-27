"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatKES } from "@/lib/utils";
import { ArrowRight, LockKeyhole } from "lucide-react";
import Link from "next/link";

export default function OrderSummary() {
  const { cart } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="noir-order-summary">
      <p className="noir-summary-kicker">ALMOST YOURS</p>
      <h2>Order summary</h2>
      <div className="noir-summary-line"><span>Subtotal · {itemCount} {itemCount === 1 ? "item" : "items"}</span><strong>{formatKES(subtotal)}</strong></div>
      <div className="noir-summary-line"><span>Delivery · demo setting</span><strong className="noir-summary-muted">To be confirmed</strong></div>
      <div className="noir-summary-rule" />
      <div className="noir-summary-total"><span>Items subtotal</span><strong>{formatKES(subtotal)}</strong></div>
      <p className="noir-summary-disclaimer">Delivery charges and payment options are demonstration settings and will be confirmed by the store owner.</p>
      <Button asChild className="noir-checkout-button">
        <Link href="/checkout">CONTINUE TO CHECKOUT <ArrowRight size={15} /></Link>
      </Button>
      <div className="noir-summary-secure"><LockKeyhole size={14} /><span>Secure checkout experience</span></div>
      <div className="noir-summary-payment"><span>PAYMENT OPTIONS TO BE CONFIRMED</span><div><b>M-PESA</b><b>VISA</b><b>MC</b></div></div>
    </section>
  );
}
