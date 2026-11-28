"use client";

import { useState } from "react";
import useSWR from "swr";
import type { Product } from "@/types/product";
import AdminOrdersPanel from "@/components/admin/AdminOrdersPanel";
import AdminOverviewPanel from "@/components/admin/AdminOverviewPanel";
import AdminProductsPanel from "@/components/admin/AdminProductsPanel";
import AdminStoreSettingsPanel from "@/components/admin/AdminStoreSettingsPanel";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useNoirSession } from "@/lib/use-noir-session";
import {
  loadAdminOrders,
  loadAdminProducts,
  loadStoreSettings,
  saveAdminOrderStatus,
  saveAdminProducts,
  saveStoreSettings,
} from "@/lib/admin-data";
import type { OrderStatus, StoreSettings } from "@/lib/admin-dashboard-storage";
import { DEFAULT_STORE_SETTINGS } from "@/lib/admin-dashboard-storage";

type Section = "overview" | "products" | "orders" | "settings";
const sections: { id: Section; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "settings", label: "Store Settings" },
];

export default function AdminDashboard() {
  const [section, setSection] = useState<Section>("overview");
  const [notice, setNotice] = useState("");
  const { session, isLoaded } = useNoirSession();
  const productsQuery = useSWR("noir-admin-products", loadAdminProducts, { shouldRetryOnError: false });
  const ordersQuery = useSWR("noir-admin-orders", loadAdminOrders, { shouldRetryOnError: false });
  const settingsQuery = useSWR("noir-store-settings", loadStoreSettings, { shouldRetryOnError: false });
  const products = productsQuery.data ?? [];
  const orders = ordersQuery.data ?? [];
  const settings = settingsQuery.data ?? DEFAULT_STORE_SETTINGS;

  const saveProducts = async (nextProducts: Product[]) => {
    try {
      await saveAdminProducts(products, nextProducts);
      await productsQuery.mutate();
      setNotice("Product changes saved.");
    } catch {
      setNotice("Product changes could not be saved. Check the product permissions and try again.");
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await saveAdminOrderStatus(orderId, status);
      await ordersQuery.mutate();
      setNotice(`Order ${orderId} updated to ${status}.`);
    } catch {
      setNotice("The order status could not be updated.");
    }
  };

  const saveSettings = async (nextSettings: StoreSettings) => {
    try {
      await saveStoreSettings(nextSettings);
      await settingsQuery.mutate();
      setNotice("Store settings saved.");
      return true;
    } catch {
      setNotice("Store settings could not be saved. The configured schema must include an admin-writable store_settings table.");
      return false;
    }
  };

  if (!isLoaded || !session?.isAdmin) {
    return <div className="min-h-[60vh]" aria-live="polite" />;
  }

  const loadError = productsQuery.error || ordersQuery.error;
  return (
    <div className="min-h-[70vh] bg-white text-[#0A0A0A]">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-neutral-500">NOIR URBAN WEAR</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{sections.find((item) => item.id === section)?.label}</h1>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">Manage products, customer orders, and storefront details.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600">
            <span className="size-2 rounded-full bg-emerald-600" aria-hidden="true" />Connected store data
          </span>
        </div>

        {loadError && <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">Some store data could not be loaded. Confirm the Supabase project configuration and admin RLS policies.</p>}
        {!isSupabaseConfigured() && <p className="mb-6 border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700" role="status">Supabase environment values are not available in this preview.</p>}
        {notice && <p className="mb-5 border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700" role="status">{notice}</p>}

        <nav aria-label="Admin sections" className="mb-7 overflow-x-auto border-b border-neutral-200">
          <div className="flex min-w-max gap-1">
            {sections.map((item) => <button key={item.id} type="button" aria-current={section === item.id ? "page" : undefined} onClick={() => { setSection(item.id); setNotice(""); }} className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 ${section === item.id ? "border-[#0A0A0A] text-[#0A0A0A]" : "border-transparent text-neutral-500 hover:text-[#0A0A0A]"}`}>{item.label}</button>)}
          </div>
        </nav>

        {(productsQuery.isLoading || ordersQuery.isLoading) ? <p className="py-10 text-center text-sm text-neutral-600">Loading store data…</p> : null}
        {!productsQuery.isLoading && !ordersQuery.isLoading && section === "overview" && <AdminOverviewPanel products={products} orders={orders} onNavigate={setSection} />}
        {!productsQuery.isLoading && section === "products" && <AdminProductsPanel products={products} onProductsChange={saveProducts} />}
        {!ordersQuery.isLoading && section === "orders" && <AdminOrdersPanel orders={orders} whatsappNumber={settings.whatsappNumber} onStatusChange={updateOrderStatus} />}
        {section === "settings" && <>
          {settingsQuery.error && <p className="mb-4 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="alert">The supplied database schema does not include store_settings. Store settings are read and saved only if that table is present with the expected columns.</p>}
          <AdminStoreSettingsPanel key={JSON.stringify(settings)} settings={settings} onSave={saveSettings} />
        </>}
      </div>
    </div>
  );
}
