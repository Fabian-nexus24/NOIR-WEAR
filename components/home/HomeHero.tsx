import { ArrowRight, ShieldCheck, Shirt, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
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

      <div className="noir-hero-stage" role="group" aria-label="NOIR Collection 001 editorial">
        <Image
          src="/images/noir-hero-editorial.png"
          alt="A black hoodie, black-and-white high-top sneakers, and a black cap arranged on concrete plinths in a dark studio."
          fill
          priority
          sizes="(max-width: 767px) 100vw, 62vw"
          className="noir-hero-stage-image"
        />
        <div className="noir-hero-stage-shade" aria-hidden="true" />
        <span className="noir-hero-stage-wordmark" aria-hidden="true">
          NOIR
        </span>
        <div className="noir-hero-stage-label">
          <span>NOIR — COLLECTION 001</span>
          <span>THIKA · KENYA</span>
        </div>
        <div className="noir-hero-stage-index" aria-hidden="true">
          01 <span>/</span> NOIR ESSENTIALS
        </div>
      </div>
    </section>
  );
}
