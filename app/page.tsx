import ProductCard from "@/components/home/ProductCard";
import rawProducts from "@/data/products.json";
import { Product } from "@/types/product";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const products = rawProducts as Product[];
const featuredProducts = products.filter((product) => [7, 12, 1, 16].includes(product.id));

const categories = [
  {
    number: "01",
    name: "MEN",
    description: "Everyday pieces. A stronger point of view.",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=85&w=1100&auto=format&fit=crop",
  },
  {
    number: "02",
    name: "WOMEN",
    description: "Easy layers. Individual expression.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=85&w=1100&auto=format&fit=crop",
  },
];

export default function Home() {
  return (
    <div className="noir-home">
      {/* Hero campaign */}
      <section className="noir-hero" aria-labelledby="hero-title">
        <div className="noir-hero-image" role="img" aria-label="Streetwear fashion campaign featuring contemporary urban styling" />
        <div className="noir-hero-shade" />
        <div className="noir-hero-content">
          <p className="noir-eyebrow">NOIR URBAN WEAR · THE EVERYDAY EDIT</p>
          <h1 id="hero-title">
            STYLE WITHOUT
            <br />
            <span>BOUNDARIES.</span>
          </h1>
          <p className="noir-hero-copy">
            A considered mix of streetwear and everyday essentials. Find your fit, define your style, and make every day your own.
          </p>
          <Link href="/shop" className="noir-button noir-button-light">
            EXPLORE THE SHOP <ArrowRight size={16} />
          </Link>
        </div>
        <div className="noir-hero-index">NOIR / 001</div>
        <div className="noir-hero-scroll"><ArrowDownRight size={15} /> SCROLL TO EXPLORE</div>
      </section>

      {/* Brand introduction */}
      <section className="noir-intro section-shell">
        <p className="noir-eyebrow">MORE THAN WHAT YOU WEAR</p>
        <div className="noir-intro-row">
          <h2>YOUR STYLE.<br /><em>YOUR RULES.</em></h2>
          <p>
            NOIR brings streetwear and everyday essentials together. Discover
            versatile pieces made to move with you, wherever the day takes you.
          </p>
        </div>
      </section>

      {/* Men and women campaign tiles */}
      <section className="noir-category-section section-shell">
        <div className="noir-section-heading">
          <div>
            <p className="noir-eyebrow">FIND YOUR FIT</p>
            <h2>THE COLLECTIONS</h2>
          </div>
          <Link href="/shop" className="noir-text-link">VIEW ALL PRODUCTS <ArrowRight size={15} /></Link>
        </div>
        <div className="noir-category-grid">
          {categories.map((category) => (
            <Link href="/shop" className="noir-category-card" key={category.name}>
              <div
                className="noir-category-image"
                style={{ backgroundImage: `url('${category.image}')` }}
              />
              <div className="noir-category-overlay" />
              <div className="noir-category-meta">
                <span>{category.number} / NOIR COLLECTION</span>
                <ArrowDownRight size={20} />
              </div>
              <div className="noir-category-title">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured sample products */}
      <section className="noir-featured-section">
        <div className="section-shell">
          <div className="noir-section-heading">
            <div>
              <p className="noir-eyebrow">A FIRST LOOK AT NOIR</p>
              <h2>SELECTED PIECES</h2>
              <p className="noir-section-subtitle">A preview of the shopping experience. Product images and details are samples for this demonstration.</p>
            </div>
            <Link href="/shop" className="noir-text-link">SHOP EVERYTHING <ArrowRight size={15} /></Link>
          </div>
          <div className="noir-product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} className="noir-product-card" />
            ))}
          </div>
        </div>
      </section>

      {/* Black brand statement */}
      <section className="noir-statement">
        <div className="noir-statement-inner">
          <p className="noir-eyebrow">NOIR URBAN WEAR · EST. FOR EVERYDAY</p>
          <h2>NOT JUST FASHION.<br /><span>IT&apos;S EXPRESSION.</span></h2>
          <p>Wear what moves you. Make the everyday your own.</p>
          <Link href="/shop" className="noir-button noir-button-outline">
            DISCOVER NOIR <ArrowRight size={16} />
          </Link>
        </div>
        <div className="noir-statement-mark" aria-hidden="true">N.</div>
      </section>

      {/* Simple service strip */}
      <section className="noir-service-strip section-shell">
        <div><span>01</span><strong>MADE FOR EVERYDAY</strong><p>Versatile style for your rotation.</p></div>
        <div><span>02</span><strong>SHOP WITH EASE</strong><p>A simple, straightforward experience.</p></div>
        <div><span>03</span><strong>KENYA</strong><p>Designed for a local shopping experience.</p></div>
      </section>
    </div>
  );
}
