import { createClient } from "@/lib/supabase/client";
import { mapProduct, productToRow, type ProductRow } from "@/lib/product-data";
import { DEFAULT_STORE_SETTINGS, ORDER_STATUSES, type AdminOrder, type OrderStatus, type StoreSettings } from "@/lib/admin-dashboard-storage";
import type { Product } from "@/types/product";

const productColumns = "id,name,description,category,price_kes,original_price_kes,image_url,images,badge,rating,reviews_count,sizes,stock_quantity,in_stock,is_active";
const statusToDb: Record<OrderStatus, string> = {
  Pending: "pending", Confirmed: "confirmed", "Ready for Pickup": "ready_for_pickup",
  "Out for Delivery": "out_for_delivery", Completed: "completed", Cancelled: "cancelled",
};
const statusFromDb: Record<string, OrderStatus> = Object.fromEntries(ORDER_STATUSES.map((status) => [statusToDb[status], status])) as Record<string, OrderStatus>;

export async function loadAdminProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("products").select(productColumns).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => mapProduct(row as ProductRow));
}

export async function saveAdminProducts(previous: Product[], next: Product[]) {
  const supabase = createClient();
  const previousById = new Map(previous.map((product) => [product.id, product]));
  const nextIds = new Set(next.map((product) => product.id));
  for (const product of next) {
    const before = previousById.get(product.id);
    const payload = productToRow(product);
    if (!before) {
      const { error } = await supabase.from("products").insert(payload);
      if (error) throw error;
    } else if (JSON.stringify(before) !== JSON.stringify(product)) {
      const { error } = await supabase.from("products").update(payload).eq("id", product.id);
      if (error) throw error;
    }
  }
  const removedIds = previous.filter((product) => !nextIds.has(product.id)).map((product) => product.id);
  if (removedIds.length) {
    const { error } = await supabase.from("products").delete().in("id", removedIds);
    if (error) throw error;
  }
}

export async function loadAdminOrders(): Promise<AdminOrder[]> {
  const supabase = createClient();
  const { data: rows, error } = await supabase.from("orders").select("id,order_number,first_name,last_name,customer_email,phone,fulfillment_method,status,total_kes,created_at").order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  if (!rows?.length) return [];
  const { data: itemRows, error: itemsError } = await supabase.from("order_items").select("order_id,product_name,size,quantity").in("order_id", rows.map((row) => row.id));
  if (itemsError) throw itemsError;
  const itemsByOrder = new Map<string, AdminOrder["items"]>();
  for (const item of itemRows ?? []) {
    const current = itemsByOrder.get(item.order_id) ?? [];
    current.push({ name: item.product_name, size: item.size || "One size", quantity: Number(item.quantity) });
    itemsByOrder.set(item.order_id, current);
  }
  return rows.map((row) => ({
    id: row.order_number,
    customer: `${row.first_name} ${row.last_name}`.trim(),
    items: itemsByOrder.get(row.id) ?? [],
    total: Number(row.total_kes),
    fulfillment: row.fulfillment_method === "pickup" ? "Thika Pickup" : "Delivery",
    status: statusFromDb[row.status] ?? "Pending",
    createdAt: new Date(row.created_at).toLocaleDateString("en-KE", { dateStyle: "medium" }),
  }));
}

export async function saveAdminOrderStatus(orderNumber: string, status: OrderStatus) {
  const supabase = createClient();
  const { error } = await supabase.from("orders").update({ status: statusToDb[status] }).eq("order_number", orderNumber);
  if (error) throw error;
}

export async function loadStoreSettings(): Promise<StoreSettings> {
  const supabase = createClient();
  const { data, error } = await supabase.from("store_settings").select("id,location,hours,whatsapp_number,announcement").limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_STORE_SETTINGS;
  const row = data as Record<string, unknown>;
  return {
    location: String(row.location ?? DEFAULT_STORE_SETTINGS.location),
    hours: String(row.hours ?? DEFAULT_STORE_SETTINGS.hours),
    whatsappNumber: String(row.whatsapp_number ?? DEFAULT_STORE_SETTINGS.whatsappNumber),
    announcement: String(row.announcement ?? DEFAULT_STORE_SETTINGS.announcement),
  };
}

export async function saveStoreSettings(settings: StoreSettings) {
  const supabase = createClient();
  const { data, error: loadError } = await supabase.from("store_settings").select("id").limit(1).maybeSingle();
  if (loadError) throw loadError;
  const payload = {
    location: settings.location.trim(),
    hours: settings.hours.trim(),
    whatsapp_number: settings.whatsappNumber.replace(/\\D/g, ""),
    announcement: settings.announcement.trim(),
  };
  const query = data?.id == null
    ? supabase.from("store_settings").insert(payload)
    : supabase.from("store_settings").update(payload).eq("id", data.id);
  const { error } = await query;
  if (error) throw error;
}
