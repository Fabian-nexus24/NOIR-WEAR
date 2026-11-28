"use client";

import ProductNotFound from "@/components/product/ProductNotFound";
import RelatedProducts from "@/components/product/RelatedProducts";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/lib/use-products";
import { formatKES } from "@/lib/utils";
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
import { useMemo, useState } from "react";

export default function ProductDetailPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params.productId) ? params.productId[0] : params.productId;

  const { products: allProducts, isLoading } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  const [prevProductId, setPrevProductId] = useState(productId);
  if (productId !== prevProductId) {
    setPrevProductId(productId);
    setCurrentImageIndex(0);
    setQuantity(1);
    setSelectedSize("");
    setJustAdded(false);
  }

  const product = allProducts.find((item) => item.id === Number(productId));
  const productImages = useMemo(
    () => product ? (product.images?.length ? product.images : [product.image]) : [],
    [product]
  );

  if (!product) return isLoading ? <main className="min-h-[60vh] px-4 py-16 text-center text-sm text-neutral-600">Loading product…</main> : <ProductNotFound />;

  const sizeOptions = product.sizes ?? [];
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
            <div className="noir-gallery-caption"><span>01 — PRODUCT DETAILS</span><span>NOIR URBAN WEAR</span></div>
          </section>

          <section className="noir-product-information">
            <div className="noir-product-category-row"><span>{product.category}</span><span className="noir-product-dot" />{isSoldOut ? <span className="noir-stock-out">Currently unavailable</span> : <span className="noir-stock-in">Available now</span>}</div>
            <p className="noir-product-kicker">THE NOIR EDIT / EVERYDAY COLLECTION</p>
            <h1>{product.name}</h1>
            <div className="noir-detail-price-row"><strong>{formatKES(product.price).replace("KES", "KSh")}</strong>{product.originalPrice && product.originalPrice > product.price && <del>{formatKES(product.originalPrice).replace("KES", "KSh")}</del>}{product.originalPrice && product.originalPrice > product.price && <span className="noir-sale-note">SALE</span>}</div>
            <p className="noir-product-description">{product.description}</p>

            {hasSize && <div className="noir-option-block">
              <div className="noir-option-heading"><label>SELECT SIZE</label><span>{selectedSize ? `Selected: ${selectedSize}` : "Choose your size"}</span></div>
              <div className="noir-size-options" role="group" aria-label="Select product size">
                {sizeOptions.map((size) => <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`noir-size-option ${selectedSize === size ? "active" : ""}`} aria-pressed={selectedSize === size}>{size}</button>)}
              </div>
              {!selectedSize && <p className="noir-selection-hint">Please select a size to continue.</p>}
            </div>}

            <div className="noir-option-block noir-quantity-block">
              <div className="noir-option-heading"><label>QUANTITY</label><span>Adjust the number of items</span></div>
              <div className="noir-quantity-control">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1} aria-label="Decrease quantity"><Minus size={15} /></button>
                <span aria-live="polite">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => Math.min(20, value + 1))} disabled={quantity >= 20} aria-label="Increase quantity"><Plus size={15} /></button>
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
              <div><Truck size={17} /><span><strong>DELIVERY IN KENYA</strong><small>Choose delivery or Thika pickup at checkout</small></span></div>
              <div><ShieldCheck size={17} /><span><strong>SECURE SHOPPING</strong><small>Order details are protected by your account</small></span></div>
            </div>
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
