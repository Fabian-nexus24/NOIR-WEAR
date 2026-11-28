import type { CartItem } from "@/context/CartContext";

export type OrderRpcInput = {
  p_first_name: string;
  p_last_name: string;
  p_phone: string;
  p_fulfillment_method: "pickup" | "delivery";
  p_payment_method: "mpesa" | "pay_on_delivery";
  p_items: Array<{ product_id: number; quantity: number; size: string; colour: string }>;
  p_county: string | null;
  p_town: string | null;
  p_estate: string | null;
  p_building: string | null;
  p_delivery_instructions: string | null;
};

export function toOrderItems(items: CartItem[]): OrderRpcInput["p_items"] {
  const combined = new Map<string, OrderRpcInput["p_items"][number]>();
  for (const item of items) {
    const size = item.size ?? "";
    const colour = item.colour ?? "";
    const key = `${item.id}:${size}:${colour}`;
    const existing = combined.get(key);
    if (existing) existing.quantity += item.quantity;
    else combined.set(key, { product_id: item.id, quantity: item.quantity, size, colour });
  }
  return [...combined.values()];
}
