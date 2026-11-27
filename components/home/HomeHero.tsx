"use client";

import { ArrowLeft, ArrowRight, ShieldCheck, Shirt, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const slidePositions = ["center center", "right center", "58% center"];

export default function HomeHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const changeSlide = (direction: -1 | 1) => {
    setActiveSlide((current) => (current + direction + slidePositions.length) % slidePositions.length);
  };

  return (
    <section className="noir-fullbleed-hero" aria-labelledby="hero-title">
      <Image
        src="/images/hero-noir-art.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="noir-fullbleed-artwork"
        style={{ objectPosition: slidePositions[activeSlide] }}
      />
      <div className="noir-fullbleed-wash" aria-hidden="true" />
      <div className="noir-fullbleed-top-wash" aria-hidden="true" />
      <div className="noir-fullbleed-content">
        <div className="noir-fullbleed-copy">
          <p className="noir-fullbleed-kicker">
            <span aria-hidden="true" /> NOIR — COLLECTION 001
          </p>
          <h1 id="hero-title">
            <span>STYLE WITHOUT</span>
            <em>LIMITS.</em>
          </h1>
          <p className="noir-fullbleed-description">
            Premium streetwear for your everyday vibe.
            <br />
            Bold. Modern. Timeless.
          </p>
          <div className="noir-fullbleed-actions">
            <Link href="/shop" className="noir-fullbleed-shop-button">
              SHOP NOW <ArrowRight size={19} aria-hidden="true" />
            </Link>
            <span>WEAR THE NOIR VIBE</span>
          </div>
        </div>
      </div>

      <div className="noir-fullbleed-footer">
        <div className="noir-fullbleed-benefits" aria-label="Shopping benefits">
          <div className="noir-fullbleed-benefit">
            <Truck aria-hidden="true" />
            <span><strong>Fast Delivery</strong><small>Across Kenya</small></span>
          </div>
          <div className="noir-fullbleed-benefit">
            <ShieldCheck aria-hidden="true" />
            <span><strong>Secure Checkout</strong><small>Shop with Confidence</small></span>
          </div>
          <div className="noir-fullbleed-benefit">
            <Shirt aria-hidden="true" />
            <span><strong>Trendy Styles</strong><small>Always in Vogue</small></span>
          </div>
        </div>
        <div className="noir-fullbleed-controls" aria-label="Hero artwork controls">
          <span aria-live="polite">0{activeSlide + 1} <span>/</span> 03</span>
          <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous hero view">
            <ArrowLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={() => changeSlide(1)} aria-label="Next hero view">
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
