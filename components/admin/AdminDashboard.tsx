"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { Product } from "@/types/product";
import AdminOrdersPanel from "@/components/admin/AdminOrdersPanel";
import AdminOverviewPanel from "@/components/admin/AdminOverviewPanel";
import AdminProductsPanel from "@/components/admin/AdminProductsPanel";
import AdminStoreSettingsPanel from "@/components/admin/AdminStoreSettingsPanel";
import {
  ADMIN_ORDERS_KEY,
  ADMIN_PRODUCTS_KEY,
  ADMIN_SETTINGS_KEY,
  CATALOGUE_UPDATED_EVENT,
  CUSTOM_PRODUCTS_KEY,
  readAdminOrders,
  readAdminProducts,
  readStoreSettings,
  writeAdminOrders,
  writeAdminProducts,
  writeStoreSettings,
  type OrderStatus,
  type StoreSettings,
} from "@/lib/admin-dashboard-storage";

type Section = "overview" | "products" | "orders" | "settings";

function subscribeToAdminStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CATALOGUE_UPDATED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CATALOGUE_UPDATED_EVENT, callback);
  };
}

function getAdminStorageSnapshot() {
  return [ADMIN_PRODUCTS_KEY, CUSTOM_PRODUCTS_KEY, ADMIN_ORDERS_KEY, ADMIN_SETTINGS_KEY]
    .map((key) => localStorage.getItem(key) ?? "")
    .join("\u0000");
}

const sections: { id: Section; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "settings", label: "Store Settings" },
];

export default function AdminDashboard() {
  const [section, setSection] = useState<Section>("overview");
  const storageSnapshot = useSyncExternalStore(subscribeToAdminStorage, getAdminStorageSnapshot, () => "");
  const products = useMemo(
    () => storageSnapshot ? readAdminProducts() : [],
    [storageSnapshot],
  );
  const orders = useMemo(
    () => storageSnapshot ? readAdminOrders() : [],
    [storageSnapshot],
  );
  const settings = useMemo(
    () => storageSnapshot ? readStoreSettings() : {
      location: "",
      hours: "",
      whatsappNumber: "",
      announcement: "",
    },
    [storageSnapshot],
  );
  const [notice, setNotice] = useState("");

  const updateProducts = (nextProducts: Product[]) => {
    try {
      writeAdminProducts(nextProducts);
      setNotice("Product changes saved in this browser.");
    } catch {
      setNotice("Could not save product changes. Check this browser's available storage.");
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const nextOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order,
    );
    try {
      writeAdminOrders(nextOrders);
      setNotice(`Order ${orderId} updated to ${status}.`);
    } catch {
      setNotice("Could not save the order status in this browser.");
    }
  };

  const saveSettings = (nextSettings: StoreSettings) => {
    try {
      writeStoreSettings(nextSettings);
      setNotice("Store settings saved in this browser.");
      return true;
    } catch {
      setNotice("Could not save store settings in this browser.");
      return false;
    }
  };

  return (
    <div className="min-h-[70vh] bg-white text-[#0A0A0A]">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-neutral-500">NOIR URBAN WEAR</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {sections.find((item) => item.id === section)?.label}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">
              Manage the catalogue, sample orders, and storefront details.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600">
            <span className="size-2 rounded-full bg-neutral-400" aria-hidden="true" />
            Demo mode
          </span>
        </div>

        <div className="mb-6 border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-700" role="note">
          Product and settings changes stay in this browser. Orders shown here are sample records, not live customer orders.
        </div>

        <nav aria-label="Admin sections" className="mb-7 overflow-x-auto border-b border-neutral-200">
          <div className="flex min-w-max gap-1">
            {sections.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={section === item.id ? "page" : undefined}
                onClick={() => {
                  setSection(item.id);
                  setNotice("");
                }}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 ${
                  section === item.id
                    ? "border-[#0A0A0A] text-[#0A0A0A]"
                    : "border-transparent text-neutral-500 hover:text-[#0A0A0A]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {notice && (
          <p className="mb-5 border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700" role="status">
            {notice}
          </p>
        )}

        {section === "overview" && (
          <AdminOverviewPanel
            products={products}
            orders={orders}
            onNavigate={setSection}
          />
        )}
        {section === "products" && (
          <AdminProductsPanel products={products} onProductsChange={updateProducts} />
        )}
        {section === "orders" && (
          <AdminOrdersPanel
            orders={orders}
            whatsappNumber={settings.whatsappNumber}
            onStatusChange={updateOrderStatus}
          />
        )}
        {section === "settings" && (
          <AdminStoreSettingsPanel
            settings={settings}
            onSave={saveSettings}
          />
        )}
      </div>
    </div>
  );
}
