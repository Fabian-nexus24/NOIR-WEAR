import { ArrowRight, ArrowUpRight, ShieldCheck, Shirt, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatKES } from "@/lib/utils";
import { Product } from "@/types/product";

interface HomeHeroProps {
  products: Product[];
}

export default function HomeHero({ products }: HomeHeroProps) {
  const apparel = products.find((product) => product.id === 8);
  const sneakers = products.find((product) => product.id === 1);
  const cap = products.find((product) => product.id === 17);
  const featuredProducts = [apparel, sneakers, cap].filter(
    (product): product is Product => Boolean(product),
  );

  return (
    <section className="noir-hero" aria-labelledby="hero-title">
      <div className="noir-hero-copy-panel">
        <div className="noir-hero-copy-inner">
          <p className="noir-hero-kicker">
            <span aria-hidden="true" /> NOIR — COLLECTION 001
          </p>
          <h1 id="hero-title">
            <span className="noir-hero-title-first">STYLE&nbsp;WITHOUT</span>
            <span className="noir-hero-title-limit">LIMITS.</span>
          </h1>
          <p className="noir-hero-copy">
            Premium streetwear for your everyday vibe.
            <br />
            Bold. Modern. Timeless.
          </p>
          <div className="noir-hero-actions">
            <Link href="/shop" className="noir-hero-shop-button">
              SHOP NOW <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <span className="noir-hero-action-note">WEAR THE NOIR VIBE</span>
          </div>
        </div>

        <div className="noir-hero-benefits" aria-label="Shopping benefits">
          <div className="noir-hero-benefit">
            <Truck size={30} strokeWidth={1.8} aria-hidden="true" />
            <span>
              <strong>Fast Delivery</strong>
              <small>Across Kenya</small>
            </span>
          </div>
          <div className="noir-hero-benefit">
            <ShieldCheck size={30} strokeWidth={1.8} aria-hidden="true" />
            <span>
              <strong>Secure Checkout</strong>
              <small>Shop with Confidence</small>
            </span>
          </div>
          <div className="noir-hero-benefit">
            <Shirt size={30} strokeWidth={1.8} aria-hidden="true" />
            <span>
              <strong>Trendy Styles</strong>
              <small>Always in Vogue</small>
            </span>
          </div>
        </div>
      </div>

      <div className="noir-hero-stage" role="group" aria-label="Featured NOIR collection">
        <span className="noir-hero-stage-wordmark" aria-hidden="true">
          NOIR
        </span>
        <div className="noir-hero-stage-label">
          <span>THE NOIR EDIT</span>
          <span>THIKA · KENYA</span>
        </div>

        {featuredProducts.map((product, index) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className={`noir-hero-product noir-hero-product-${index + 1}`}
            aria-label={`Shop ${product.name}`}
          >
            <div className="noir-hero-product-image">
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized
                sizes="(max-width: 767px) 45vw, (max-width: 1100px) 32vw, 400px"
              />
              <span className="noir-hero-product-open" aria-hidden="true">
                <ArrowUpRight size={16} />
              </span>
            </div>
            <span className="noir-hero-product-caption">
              <span>
                <small>{product.category} / NOIR ESSENTIALS</small>
                <strong>{product.name}</strong>
              </span>
              <b>{formatKES(product.price).replace("KES", "KSh")}</b>
            </span>
          </Link>
        ))}

        <div className="noir-hero-stage-index" aria-hidden="true">
          01 <span>/</span> 03
        </div>
      </div>
    </section>
  );
}
