import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { mapProduct, type ProductRow } from "@/lib/product-data";
import type { Product } from "@/types/product";

export async function getProducts() {
  if (!isSupabaseConfigured()) return [] as Product[];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,category,price_kes,original_price_kes,image_url,images,badge,rating,reviews_count,sizes,stock_quantity,in_stock,is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error("Products could not be loaded.");
  return (data ?? []).map((row) => mapProduct(row as ProductRow));
}
