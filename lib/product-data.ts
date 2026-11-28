import type { Product } from "@/types/product";

export type ProductRow = {
  id: number;
  name: string;
  description: string;
  category: string;
  price_kes: number;
  original_price_kes: number | null;
  image_url: string;
  images: string[] | null;
  badge: string | null;
  rating: number | null;
  reviews_count: number;
  sizes: string[] | null;
  stock_quantity: number | null;
  in_stock: boolean;
  is_active: boolean;
};

export function mapProduct(row: ProductRow): Product {
  return {
    id: Number(row.id), name: row.name, description: row.description ?? "",
    category: row.category, price: Number(row.price_kes),
    ...(row.original_price_kes != null ? { originalPrice: Number(row.original_price_kes) } : {}),
    image: row.image_url ?? "", images: row.images ?? [],
    ...(row.badge ? { badge: row.badge } : {}),
    ...(row.rating != null ? { rating: Number(row.rating) } : {}),
    reviewsCount: Number(row.reviews_count ?? 0), sizes: row.sizes ?? [],
    inStock: row.in_stock, isSoldOut: !row.in_stock, isActive: row.is_active,
  };
}

export function productToRow(product: Product) {
  return {
    name: product.name,
    description: product.description ?? "",
    category: product.category,
    price_kes: Math.round(product.price),
    original_price_kes: product.originalPrice ?? null,
    image_url: product.image,
    images: product.images?.length ? product.images : [product.image],
    badge: product.badge ?? null,
    rating: product.rating ?? null,
    reviews_count: product.reviewsCount ?? 0,
    sizes: product.sizes ?? [],
    stock_quantity: product.inStock === false || product.isSoldOut ? 0 : null,
    is_active: product.isActive !== false,
  };
}
