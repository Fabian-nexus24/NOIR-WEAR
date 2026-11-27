"use client";

import ProductNotFound from "@/components/product/ProductNotFound";
import RelatedProducts from "@/components/product/RelatedProducts";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import defaultProducts from "@/data/products.json";
import { formatKES } from "@/lib/utils";
import { Product } from "@/types/product";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const shoeSizes = ["39", "40", "41", "42", "43", "44"];
const sampleColours = [
  { name: "Black", value: "#171717" },
  { name: "Off-white", value: "#e9e5dc" },
  { name: "Stone", value: "#aaa49a" },
  { name: "Olive", value: "#62634d" },
];

export default function ProductDetailPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params.productId) ? params.productId[0] : params.productId;

  const [allProducts, setAllProducts] = useState<Product[]>(defaultProducts as Product[]);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColour, setSelectedColour] = useState("Black");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bloom_custom_products");
      if (stored) {
        const custom: Product[] = JSON.parse(stored);
        setAllProducts([...custom, ...(defaultProducts as Product[])]);
      }
    } catch {
      // Keep the default demonstration catalogue if browser storage is unavailable.
    }
  }, []);

  const [prevProductId, setPrevProductId] = useState(productId);
  if (productId !== prevProductId) {
    setPrevProductId(productId);
    setCurrentImageIndex(0);
    setQuantity(1);
    setSelectedSize("");
    setSelectedColour("Black");
    setJustAdded(false);
  }

  const product = allProducts.find((item) => item.id === Number(productId));
  const productImages = useMemo(
    () => product ? (product.images?.length ? product.images : [product.image]) : [],
    [product]
  );

  if (!product) return <ProductNotFound />;

  const isShoe = product.category.toLowerCase().includes("shoe");
  const isClothing = ["t-shirts", "hoodies"].some((category) => product.category.toLowerCase().includes(category));
  const sizeOptions = isShoe ? shoeSizes : isClothing ? clothingSizes : [];
  const hasSize = sizeOptions.length > 0;
  const isSoldOut = Boolean(product.isSoldOut);
  const canAdd = !isSoldOut && (!hasSize || Boolean(selectedSize));

  const changeImage = (direction: "previous" | "next") => {
    setCurrentImageIndex((current) => {
      if (direction === "previous") return current === 0 ? productImages.length - 1 : current - 1;
      return current === productImages.length - 1 ? 0 : current + 1;
    });
  };

  const addProductToBag = async () => {
    if (!canAdd || isAdding) return;
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 180));
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      ...(selectedSize ? { size: selectedSize } : {}),
      colour: selectedColour,
    });
    setIsAdding(false);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  const buyNow = () => {
    if (!canAdd) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      ...(selectedSize ? { size: selectedSize } : {}),
      colour: selectedColour,
    });
    router.push("/checkout");
  };

  return (
    <div className="noir-product-page">
      <div className="noir-product-shell">
        <div className="noir-product-topline">
          <Link href="/shop" className="noir-back-link"><ArrowLeft size={14} /> BACK TO SHOP</Link>
          <span>NOIR / PRODUCT {String(product.id).padStart(3, "0")}</span>
        </div>

        <div className="noir-product-detail-grid">
          <section className="noir-product-gallery" aria-label="Product images">
            <div className="noir-product-main-image">
              <Image
                src={productImages[currentImageIndex] || product.image}
                alt={`${product.name} product view ${currentImageIndex + 1}`}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 55vw"
                className="noir-product-main-photo"
              />
              <span className="noir-image-counter">{String(currentImageIndex + 1).padStart(2, "0")} / {String(productImages.length).padStart(2, "0")}</span>
              {productImages.length > 1 && <>
                <button type="button" onClick={() => changeImage("previous")} className="noir-gallery-arrow noir-gallery-prev" aria-label="Previous product image"><ChevronLeft size={20} /></button>
                <button type="button" onClick={() => changeImage("next")} className="noir-gallery-arrow noir-gallery-next" aria-label="Next product image"><ChevronRight size={20} /></button>
              </>}
            </div>
            {productImages.length > 1 && <div className="noir-product-thumbnails">
              {productImages.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setCurrentImageIndex(index)} className={`noir-product-thumb ${currentImageIndex === index ? "active" : ""}`} aria-label={`Show product image ${index + 1}`} aria-pressed={currentImageIndex === index}>
                <Image src={image} alt={`${product.name} thumbnail ${index + 1}`} fill sizes="100px" />
              </button>)}
            </div>}
            <div className="noir-gallery-caption"><span>01 — PRODUCT DETAILS</span><span>IMAGES FOR DEMONSTRATION</span></div>
          </section>

          <section className="noir-product-information">
            <div className="noir-product-category-row"><span>{product.category}</span><span className="noir-product-dot" />{isSoldOut ? <span className="noir-stock-out">Currently unavailable</span> : <span className="noir-stock-in">Available in sample catalogue</span>}</div>
            <p className="noir-product-kicker">THE NOIR EDIT / EVERYDAY COLLECTION</p>
            <h1>{product.name}</h1>
            <div className="noir-detail-price-row"><strong>{formatKES(product.price).replace("KES", "KSh")}</strong>{product.originalPrice && product.originalPrice > product.price && <del>{formatKES(product.originalPrice).replace("KES", "KSh")}</del>}{product.originalPrice && product.originalPrice > product.price && <span className="noir-sale-note">DEMO OFFER</span>}</div>
            <p className="noir-product-description">{product.description}</p>

            <div className="noir-demo-options-note">PRODUCT OPTIONS SHOWN FOR CLIENT DEMONSTRATION</div>

            {hasSize && <div className="noir-option-block">
              <div className="noir-option-heading"><label>SELECT SIZE</label><span>{selectedSize ? `Selected: ${selectedSize}` : "Choose your size"}</span></div>
              <div className="noir-size-options" role="group" aria-label="Select product size">
                {sizeOptions.map((size) => <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`noir-size-option ${selectedSize === size ? "active" : ""}`} aria-pressed={selectedSize === size}>{size}</button>)}
              </div>
              {!selectedSize && <p className="noir-selection-hint">Please select a size to continue.</p>}
            </div>}

            <div className="noir-option-block">
              <div className="noir-option-heading"><label>COLOUR</label><span>{selectedColour}</span></div>
              <div className="noir-colour-options" role="group" aria-label="Select sample colour">
                {sampleColours.map((colour) => <button key={colour.name} type="button" onClick={() => setSelectedColour(colour.name)} className={`noir-colour-option ${selectedColour === colour.name ? "active" : ""}`} aria-label={colour.name} aria-pressed={selectedColour === colour.name}>
                  <span style={{ backgroundColor: colour.value }} />
                </button>)}
              </div>
              <p className="noir-selection-hint">Sample colour choices — final options depend on the client&apos;s collection.</p>
            </div>

            <div className="noir-option-block noir-quantity-block">
              <div className="noir-option-heading"><label>QUANTITY</label><span>Adjust the number of items</span></div>
              <div className="noir-quantity-control">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1} aria-label="Decrease quantity"><Minus size={15} /></button>
                <span aria-live="polite">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus size={15} /></button>
              </div>
              <p className="noir-line-subtotal">SUBTOTAL <strong>{formatKES(product.price * quantity).replace("KES", "KSh")}</strong></p>
            </div>

            <div className="noir-product-actions">
              <Button type="button" onClick={addProductToBag} disabled={!canAdd || isAdding} className="noir-add-to-bag">
                {isAdding ? <span className="noir-mini-spinner" /> : justAdded ? <Check size={17} /> : <ShoppingBag size={17} />}
                {isAdding ? "ADDING TO BAG" : justAdded ? "ADDED TO BAG" : isSoldOut ? "CURRENTLY UNAVAILABLE" : "ADD TO BAG"}
                {!isAdding && !justAdded && <ArrowRight size={16} />}
              </Button>
              <Button type="button" onClick={buyNow} disabled={!canAdd} variant="outline" className="noir-buy-now">BUY IT NOW</Button>
            </div>
            <p className="noir-action-footnote">{hasSize && !selectedSize ? "Select a size before adding this item." : "Your selected options will appear in your shopping bag."}</p>

            <div className="noir-product-promises">
              <div><Truck size={17} /><span><strong>DELIVERY IN KENYA</strong><small>Delivery details confirmed at launch</small></span></div>
              <div><ShieldCheck size={17} /><span><strong>SECURE SHOPPING</strong><small>Payment integration to be configured</small></span></div>
            </div>
            <div className="noir-product-disclaimer">This is a demonstration product page. Product imagery, prices, sizes and colours are placeholders and will be replaced with the client&apos;s approved catalogue.</div>
          </section>
        </div>

        <section className="noir-product-story">
          <div><p className="noir-eyebrow">THE NOIR APPROACH</p><h2>MADE FOR<br /><span>YOUR EVERYDAY.</span></h2></div>
          <p>Streetwear attitude meets everyday versatility. Explore the NOIR edit and find pieces that move with your personal style.</p>
          <Link href="/shop" className="noir-story-link">DISCOVER MORE <ArrowRight size={15} /></Link>
        </section>

        <div className="noir-related-wrap"><RelatedProducts product={product} /></div>
      </div>
    </div>
  );
}
