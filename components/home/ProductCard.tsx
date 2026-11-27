"use client";

import { useCart } from "@/context/CartContext";
import { cn, formatKES } from "@/lib/utils";
import { Product } from "@/types/product";
import { ArrowUpRight, Check, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps { product: Product; className?: string; }

export default function ProductCard({ product, className }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();
  const isSoldOut = Boolean(product.isSoldOut);

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isSoldOut || isAdding) return;
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    setIsAdding(false);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className={cn("noir-product-card group", className)}>
      <div className="noir-product-media">
        <Link href={`/product/${product.id}`} className="noir-product-image-link" aria-label={`View ${product.name}`}>
          {!imageError ? <Image src={product.image} alt={product.name} width={600} height={750} sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 340px" className="noir-product-image" onError={() => setImageError(true)} /> :
            <div className="noir-product-image-fallback">NOIR / PRODUCT IMAGE</div>}
        </Link>
        {isSoldOut && <span className="noir-product-status">SOLD OUT</span>}
        {!isSoldOut && <button type="button" onClick={handleAddToCart} disabled={isAdding} aria-label={`Add ${product.name} to bag`} className={`noir-product-quickadd ${justAdded ? "added" : ""}`}>
          {isAdding ? <span className="noir-mini-spinner" /> : justAdded ? <Check size={17} /> : <><ShoppingBag size={15} /><Plus size={10} className="noir-product-plus" /></>}
        </button>}
        <Link href={`/product/${product.id}`} className="noir-product-view">VIEW ITEM <ArrowUpRight size={13} /></Link>
      </div>
      <div className="noir-product-info">
        <div className="noir-product-meta"><span>{product.category || "NOIR ESSENTIALS"}</span>{product.originalPrice && product.originalPrice > product.price && <span>SALE</span>}</div>
        <Link href={`/product/${product.id}`} className="noir-product-name">{product.name}</Link>
        <div className="noir-product-price-row"><strong>{formatKES(product.price).replace("KES", "KSh")}</strong>{product.originalPrice && product.originalPrice > product.price && <del>{formatKES(product.originalPrice).replace("KES", "KSh")}</del>}</div>
      </div>
    </article>
  );
}
