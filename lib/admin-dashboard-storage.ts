import catalogue from "@/data/products.json";
import { SITE_CONFIG } from "@/lib/site-config";
import type { Product } from "@/types/product";

export const ADMIN_PRODUCTS_KEY = "noir_admin_products_v1";
export const CUSTOM_PRODUCTS_KEY = "bloom_custom_products";
export const ADMIN_ORDERS_KEY = "noir_admin_orders_v1";
export const ADMIN_SETTINGS_KEY = "noir_admin_settings_v1";
export const CATALOGUE_UPDATED_EVENT = "noir-catalogue-updated";

export const PRODUCT_CATEGORIES = ["Shoes", "T-Shirts", "Hoodies", "Accessories"] as const;

export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Ready for Pickup",
  "Completed",
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

const SAMPLE_ORDERS: AdminOrder[] = [
  {
    id: "NW-1048",
    customer: "Amani Mwangi",
    items: [{ name: "AirFlex Runner", size: "42", quantity: 1 }],
    total: 3500,
    fulfillment: "Thika Pickup",
    status: "Pending",
    createdAt: "28 Nov 2026",
  },
  {
    id: "NW-1047",
    customer: "Njeri Wanjiku",
    items: [
      { name: "Core Logo Tee", size: "M", quantity: 2 },
      { name: "Everyday Cap", size: "One size", quantity: 1 },
    ],
    total: 3900,
    fulfillment: "Delivery",
    status: "Confirmed",
    createdAt: "27 Nov 2026",
  },
  {
    id: "NW-1046",
    customer: "Brian Kamau",
    items: [{ name: "Urban Street Pro", size: "43", quantity: 1 }],
    total: 3800,
    fulfillment: "Thika Pickup",
    status: "Ready for Pickup",
    createdAt: "26 Nov 2026",
  },
  {
    id: "NW-1045",
    customer: "Zawadi Muli",
    items: [{ name: "Classic Hoodie", size: "L", quantity: 1 }],
    total: 4200,
    fulfillment: "Delivery",
    status: "Completed",
    createdAt: "25 Nov 2026",
  },
];

function readArray<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
    return Array.isArray(value) ? (value as T[]) : [];
  } catch {
    return [];
  }
}

export function readAdminProducts(): Product[] {
  const bundledProducts = catalogue as Product[];
  const legacyProducts = readArray<Product>(CUSTOM_PRODUCTS_KEY);

  try {
    const stored: unknown = JSON.parse(localStorage.getItem(ADMIN_PRODUCTS_KEY) ?? "null");
    if (Array.isArray(stored)) {
      const currentProducts = stored as Product[];
      const currentIds = new Set(currentProducts.map((product) => product.id));
      return [
        ...currentProducts,
        ...legacyProducts.filter((product) => !currentIds.has(product.id)),
      ];
    }
  } catch {
    // Keep the bundled catalogue available if saved browser data is malformed.
  }

  const bundledIds = new Set(bundledProducts.map((product) => product.id));
  return [
    ...bundledProducts,
    ...legacyProducts.filter((product) => !bundledIds.has(product.id)),
  ];
}

export function writeAdminProducts(products: Product[]) {
  // Replace this browser-only adapter with authenticated Supabase reads and writes when the store backend is connected.
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));

  const bundledIds = new Set((catalogue as Product[]).map((product) => product.id));
  localStorage.setItem(
    CUSTOM_PRODUCTS_KEY,
    JSON.stringify(products.filter((product) => !bundledIds.has(product.id))),
  );
  window.dispatchEvent(new Event(CATALOGUE_UPDATED_EVENT));
}

export function readAdminOrders(): AdminOrder[] {
  const orders = readArray<AdminOrder>(ADMIN_ORDERS_KEY);
  return orders.length ? orders : SAMPLE_ORDERS;
}

export function writeAdminOrders(orders: AdminOrder[]) {
  localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event(CATALOGUE_UPDATED_EVENT));
}

export function readStoreSettings(): StoreSettings {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(ADMIN_SETTINGS_KEY) ?? "null");
    if (stored && typeof stored === "object") {
      return { ...DEFAULT_STORE_SETTINGS, ...(stored as Partial<StoreSettings>) };
    }
  } catch {
    // Fall back to the store's configured contact details.
  }
  return DEFAULT_STORE_SETTINGS;
}

export function writeStoreSettings(settings: StoreSettings) {
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(CATALOGUE_UPDATED_EVENT));
}
