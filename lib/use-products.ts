"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { mapProduct, type ProductRow } from "@/lib/product-data";
import type { Product } from "@/types/product";
import useSWR from "swr";

async function loadProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,category,price_kes,original_price_kes,image_url,images,badge,rating,reviews_count,sizes,stock_quantity,in_stock,is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => mapProduct(row as ProductRow));
}

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>("noir-products", loadProducts, {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });
  return { products: data ?? [], error, isLoading, refresh: mutate };
}
