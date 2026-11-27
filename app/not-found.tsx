import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="noir-cart-page noir-empty-cart-page">
      <div className="noir-empty-cart">
        <p className="noir-cart-eyebrow">NOIR URBAN WEAR · 404</p>
        <div className="noir-empty-icon">
          <Compass size={30} strokeWidth={1.3} />
        </div>
        <p className="noir-empty-index">PAGE NOT FOUND.</p>
        <h1>
          Off the <em>map.</em>
        </h1>
        <p className="noir-empty-copy">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Return to the collection to keep exploring NOIR Urban Wear.
        </p>
        <Link href="/shop" className="noir-empty-cta">
          EXPLORE THE COLLECTION <ArrowRight size={15} />
        </Link>
        <span className="noir-empty-footnote">
          <Link href="/">RETURN TO HOMEPAGE</Link>
        </span>
      </div>
    </div>
  );
}
