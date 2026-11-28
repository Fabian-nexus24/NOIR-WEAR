import { SITE_CONFIG } from "@/lib/site-config";

export const PRODUCT_CATEGORIES = ["Shoes", "T-Shirts", "Hoodies", "Accessories"] as const;

export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Ready for Pickup",
  "Out for Delivery",
  "Completed",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type FulfillmentMethod = "Thika Pickup" | "Delivery";

export interface AdminOrderItem {
  name: string;
  size: string;
  quantity: number;
}

export interface AdminOrder {
  id: string;
  customer: string;
  items: AdminOrderItem[];
  total: number;
  fulfillment: FulfillmentMethod;
  status: OrderStatus;
  createdAt: string;
}

export interface StoreSettings {
  location: string;
  hours: string;
  whatsappNumber: string;
  announcement: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  location: SITE_CONFIG.pickupAddress,
  hours: SITE_CONFIG.storeHours,
  whatsappNumber: SITE_CONFIG.whatsappNumber,
  announcement: "New arrivals, everyday essentials. Find your next NOIR favourite.",
};
