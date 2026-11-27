import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="noir-cart-page noir-empty-cart-page">
      <div className="noir-empty-cart">
        <p className="noir-cart-eyebrow">NOIR / YOUR BAG</p>
        <div className="noir-empty-icon"><ShoppingBag size={30} strokeWidth={1.3} /></div>
        <p className="noir-empty-index">NOTHING IN HERE. YET.</p>
        <h1>Your bag is <em>waiting.</em></h1>
        <p className="noir-empty-copy">Find the pieces that feel like you. Explore everyday essentials and street-ready favourites from NOIR Urban Wear.</p>
        <Link href="/shop" className="noir-empty-cta">EXPLORE THE COLLECTION <ArrowRight size={15} /></Link>
        <span className="noir-empty-footnote">THIKA STORE · SAME-DAY DELIVERY</span>
      </div>
    </div>
  );
}
