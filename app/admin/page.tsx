"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import catalogue from "@/data/products.json";
import type { Product } from "@/types/product";
import { formatKES } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowUpRightFromSquare,
  Boxes,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Settings2,
  Shirt,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

type Section = "overview" | "products" | "orders" | "categories" | "settings";

const BASE_CATEGORIES = ["Shoes", "T-Shirts", "Hoodies", "Accessories"];
const PRODUCT_KEY = "bloom_custom_products";
const CATEGORY_KEY = "bloom_custom_categories";

const navItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "categories", label: "Categories", icon: FolderOpen },
  { id: "settings", label: "Store settings", icon: Settings2 },
];

export default function NoirAdminDashboard() {
  const [section, setSection] = useState<Section>("overview");
  const [products, setProducts] = useState<Product[]>(catalogue as Product[]);
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(BASE_CATEGORIES);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedProducts = JSON.parse(localStorage.getItem(PRODUCT_KEY) || "[]") as Product[];
      const storedCategories = JSON.parse(localStorage.getItem(CATEGORY_KEY) || "[]") as string[];
      setCustomProducts(storedProducts);
      setProducts([...(catalogue as Product[]), ...storedProducts]);
      setCategories(Array.from(new Set([...BASE_CATEGORIES, ...storedCategories])));
    } catch {
      setNotice("Some saved browser data could not be read. The sample catalogue is still available.");
    }
  }, []);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      [product.name, product.category].some((value) => value.toLowerCase().includes(query)),
    );
  }, [products, search]);

  const categoryCounts = useMemo(
    () => categories.map((category) => ({
      name: category,
      count: products.filter((product) => product.category === category).length,
    })),
    [categories, products],
  );

  const removeCustomProduct = (id: number) => {
    const updated = customProducts.filter((product) => product.id !== id);
    try {
      localStorage.setItem(PRODUCT_KEY, JSON.stringify(updated));
      setCustomProducts(updated);
      setProducts([...(catalogue as Product[]), ...updated]);
      setConfirmDelete(null);
      setNotice("Your locally added product has been removed from this browser's demo catalogue.");
    } catch {
      setNotice("Could not update the saved demo catalogue.");
    }
  };

  const addCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = newCategory.trim();
    if (!value) return;
    if (categories.some((category) => category.toLowerCase() === value.toLowerCase())) {
      setNotice("That category already exists.");
      return;
    }
    const updated = [...categories, value];
    const custom = updated.filter((category) => !BASE_CATEGORIES.includes(category));
    try {
      localStorage.setItem(CATEGORY_KEY, JSON.stringify(custom));
      setCategories(updated);
      setNewCategory("");
      setNotice("Category added to this browser's demo catalogue.");
    } catch {
      setNotice("Could not save this category.");
    }
  };

  const removeCategory = (category: string) => {
    if (BASE_CATEGORIES.includes(category)) return;
    if (products.some((product) => product.category === category)) {
      setNotice("This category is in use by products. Move or remove those products first.");
      return;
    }
    const updated = categories.filter((item) => item !== category);
    try {
      localStorage.setItem(CATEGORY_KEY, JSON.stringify(updated.filter((item) => !BASE_CATEGORIES.includes(item))));
      setCategories(updated);
      setNotice("Category removed from the demo catalogue.");
    } catch {
      setNotice("Could not update categories.");
    }
  };

  const goTo = (next: Section) => {
    setSection(next);
    setNotice("");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-[#f5f4f0] text-[#171717]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-black/10 bg-[#eeede8] px-5 py-7 lg:flex">
          <Link href="/" className="mb-10 inline-flex flex-col leading-none" aria-label="NOIR storefront">
            <span className="text-[28px] font-black tracking-[0.14em]">NOIR<span className="ml-1 text-[10px] align-top">®</span></span>
            <span className="mt-1 text-[9px] font-semibold tracking-[0.34em]">URBAN WEAR</span>
          </Link>
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">Workspace</p>
          <nav className="space-y-1" aria-label="Admin sections">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => goTo(id)} className={`flex w-full items-center gap-3 rounded-sm px-3 py-3 text-left text-[13px] transition ${section === id ? "bg-[#171717] text-white" : "text-black/65 hover:bg-black/5 hover:text-black"}`}>
                <Icon size={16} strokeWidth={1.7} />
                <span className="flex-1">{label}</span>
                {id === "products" && <span className={`text-[10px] ${section === id ? "text-white/60" : "text-black/35"}`}>{products.length}</span>}
              </button>
            ))}
          </nav>
          <div className="mt-auto space-y-4">
            <div className="border border-black/10 bg-white/60 p-3">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em]"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Demo environment</div>
              <p className="text-[11px] leading-relaxed text-black/55">Changes are saved in this browser only. This is not a live store backend.</p>
            </div>
            <Link href="/" className="flex items-center justify-between px-3 py-2 text-xs text-black/60 transition hover:text-black">
              <span>View storefront</span><ArrowUpRightFromSquare size={14} />
            </Link>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/10 bg-[#f5f4f0]/95 px-4 py-4 backdrop-blur sm:px-7 lg:px-10">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex flex-col leading-none lg:hidden">
                <span className="text-xl font-black tracking-[0.12em]">NOIR</span>
                <span className="mt-1 text-[7px] font-semibold tracking-[0.3em]">URBAN WEAR</span>
              </Link>
              <div className="hidden sm:block">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">NOIR / Management</p>
                <h1 className="mt-1 text-sm font-semibold">{navItems.find((item) => item.id === section)?.label}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-black/45 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Preview mode</span>
              <Link href="/admin/products/new" className="inline-flex items-center gap-2 bg-[#171717] px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-black/80 sm:px-4">
                <Plus size={14} /> <span className="hidden xs:inline">Add product</span><span className="xs:hidden">Add</span>
              </Link>
            </div>
          </header>

          <div className="border-b border-amber-900/10 bg-[#eee6d5] px-4 py-2.5 text-[10px] leading-relaxed text-[#66583f] sm:px-7 lg:px-10">
            <span className="font-bold uppercase tracking-[0.12em]">Demonstration dashboard</span><span className="mx-2">—</span>Products and categories are stored in this browser. Orders, payments, authentication and live inventory are not connected.
          </div>

          <div className="border-b border-black/10 px-4 py-3 lg:hidden">
            <div className="flex gap-1 overflow-x-auto">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => goTo(id)} className={`inline-flex shrink-0 items-center gap-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] ${section === id ? "bg-[#171717] text-white" : "bg-black/5 text-black/55"}`}>
                  <Icon size={13} />{label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-11">
            {notice && <div role="status" className="mb-5 flex items-start justify-between gap-3 border border-black/10 bg-white px-4 py-3 text-xs text-black/70"><span>{notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Dismiss notice"><X size={14} /></button></div>}

            {section === "overview" && (
              <div className="space-y-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">Store overview · Kenya</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Good day<span className="text-black/35">.</span></h2><p className="mt-2 max-w-lg text-sm text-black/55">A quick look at the NOIR Urban Wear demonstration catalogue.</p></div>
                  <Link href="/admin/products/new" className="inline-flex w-fit items-center gap-2 border border-black/20 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] transition hover:bg-black hover:text-white"><Plus size={14} /> Add a product</Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard label="Catalogue products" value={String(products.length)} note="Sample + locally added" icon={ShoppingBag} />
                  <MetricCard label="Categories" value={String(categories.length)} note="Available in the catalogue" icon={Boxes} />
                  <MetricCard label="Orders received" value="—" note="Order processing not connected" icon={ClipboardList} muted />
                  <MetricCard label="Sales revenue" value="—" note="Live payments not connected" icon={ArrowUpRight} muted />
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
                  <div className="border border-black/10 bg-white">
                    <div className="flex items-center justify-between border-b border-black/10 px-5 py-4"><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/40">Catalogue snapshot</p><h3 className="mt-1 text-base font-semibold">Recently added products</h3></div><button onClick={() => goTo("products")} className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/55 hover:text-black">View all <ChevronRight className="ml-1 inline" size={13} /></button></div>
                    <div className="divide-y divide-black/5">
                      {products.slice(-5).reverse().map((product) => <ProductRow key={product.id} product={product} isCustom={customProducts.some((item) => item.id === product.id)} />)}
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="border border-black/10 bg-white p-5">
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/40">Category mix</p><h3 className="mt-1 text-base font-semibold">Products by category</h3>
                      <div className="mt-5 space-y-4">
                        {categoryCounts.map(({ name, count }) => <div key={name}><div className="mb-1.5 flex justify-between text-[11px]"><span className="text-black/65">{name}</span><span className="font-semibold">{count}</span></div><div className="h-1.5 bg-[#eeede8]"><div className="h-full bg-[#171717]" style={{ width: `${products.length ? (count / products.length) * 100 : 0}%` }} /></div></div>)}
                      </div>
                    </div>
                    <div className="border border-black/10 bg-[#171717] p-5 text-white"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">Next step</p><h3 className="mt-2 text-xl font-semibold tracking-tight">Make the store yours.</h3><p className="mt-2 text-xs leading-relaxed text-white/60">Replace the sample catalogue with the client&apos;s real product photos, descriptions, sizes and prices.</p><button onClick={() => goTo("products")} className="mt-5 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-[10px] font-bold uppercase tracking-[0.12em]">Manage catalogue <ArrowUpRight size={13} /></button></div>
                  </div>
                </div>
              </div>
            )}

            {section === "products" && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">Catalogue management</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Products<span className="text-black/35">.</span></h2><p className="mt-2 text-sm text-black/55">Browse the sample catalogue and products added in this browser.</p></div><div className="flex items-center gap-2 border border-black/15 bg-white px-3 py-2.5 sm:w-64"><Search size={15} className="text-black/35" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." className="w-full bg-transparent text-xs outline-none placeholder:text-black/35" /></div></div>
                <div className="overflow-hidden border border-black/10 bg-white">
                  <div className="hidden grid-cols-[1.8fr_0.8fr_0.7fr_0.6fr] gap-4 border-b border-black/10 bg-[#eeede8] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-black/45 sm:grid"><span>Product</span><span>Category</span><span>Price</span><span>Source</span></div>
                  {visibleProducts.length ? visibleProducts.map((product) => <div key={product.id} className="flex flex-col gap-3 border-b border-black/5 px-4 py-4 last:border-0 sm:grid sm:grid-cols-[1.8fr_0.8fr_0.7fr_0.6fr] sm:items-center sm:gap-4 sm:px-5"><div className="flex min-w-0 items-center gap-3"><Image src={product.image} alt={product.name} width={48} height={56} unoptimized className="h-14 w-12 shrink-0 object-cover bg-[#eeede8]" /><div className="min-w-0"><p className="truncate text-xs font-semibold">{product.name}</p><p className="mt-1 text-[10px] text-black/40">ID #{product.id}</p></div></div><span className="text-[11px] text-black/55">{product.category}</span><span className="text-xs font-semibold">{formatKES(product.price)}</span><div className="flex items-center justify-between sm:justify-start">{customProducts.some((item) => item.id === product.id) ? <><span className="text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-700">Added here</span><button type="button" onClick={() => setConfirmDelete(product.id)} className="ml-3 inline-flex items-center gap-1 text-[10px] text-red-600 hover:text-red-800"><Trash2 size={13} /> Remove</button></> : <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-black/35">Sample</span>}</div></div>) : <div className="px-5 py-12 text-center text-sm text-black/45">No products match your search.</div>}
                </div>
                <p className="text-[10px] leading-relaxed text-black/45">Sample catalogue items come from the project&apos;s bundled product data. Products added through the admin form are saved in this browser&apos;s local storage. This is not shared across devices.</p>
              </div>
            )}

            {section === "orders" && (
              <div className="space-y-6"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">Order management</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Orders<span className="text-black/35">.</span></h2><p className="mt-2 text-sm text-black/55">A place for the client to review and process customer orders.</p></div><div className="border border-black/10 bg-white px-5 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#eeede8]"><ClipboardList size={21} strokeWidth={1.5} /></div><h3 className="mt-4 text-base font-semibold">Order management is not connected yet</h3><p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-black/50">The current checkout creates a demonstration confirmation in the customer&apos;s browser only. It does not save orders to a shared database or send them to the store, so there are no genuine orders to display here.</p><span className="mt-5 inline-flex items-center gap-2 border border-amber-900/15 bg-[#eee6d5] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#66583f]"><CircleAlert size={13} /> Integration required before launch</span></div></div>
            )}

            {section === "categories" && (
              <div className="space-y-6"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">Catalogue structure</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Categories<span className="text-black/35">.</span></h2><p className="mt-2 text-sm text-black/55">Organise the NOIR collection into easy-to-browse groups.</p></div><form onSubmit={addCategory} className="flex max-w-xl gap-2"><input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="e.g. Denim" className="min-w-0 flex-1 border border-black/15 bg-white px-4 py-3 text-xs outline-none focus:border-black" /><button className="inline-flex items-center gap-2 bg-[#171717] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-white"><Plus size={14} /> Add category</button></form><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{categoryCounts.map(({ name, count }) => <div key={name} className="flex items-center justify-between border border-black/10 bg-white p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center bg-[#eeede8] text-black/60"><Shirt size={17} /></div><div><p className="text-xs font-semibold">{name}</p><p className="mt-1 text-[10px] text-black/45">{count} products</p></div></div>{BASE_CATEGORIES.includes(name) ? <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-black/35">Default</span> : <button type="button" onClick={() => removeCategory(name)} aria-label={`Remove ${name}`} className="p-2 text-black/35 hover:text-red-600"><Trash2 size={14} /></button>}</div>)}</div><p className="text-[10px] leading-relaxed text-black/45">Category changes are stored locally in this browser. Default categories cannot be removed.</p></div>
            )}

            {section === "settings" && (
              <div className="space-y-6"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">Store configuration</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Settings<span className="text-black/35">.</span></h2><p className="mt-2 text-sm text-black/55">Current demonstration configuration and items to confirm with the client.</p></div><div className="max-w-3xl divide-y divide-black/10 border-y border-black/10 bg-white">{[{ label: "Store name", value: "NOIR Urban Wear" }, { label: "Market", value: "Kenya" }, { label: "Currency", value: "KES (Kenyan Shilling)" }, { label: "Brand direction", value: "Streetwear + casual fashion · Men & women" }, { label: "Product storage", value: "Browser local storage (demo only)" }, { label: "Payment integration", value: "Not connected · M-PESA preview only" }, { label: "Order database", value: "Not connected" }, { label: "Admin authentication", value: "Demo-only client-side check; not secure for production" }].map((item) => <div key={item.label} className="grid gap-1 px-4 py-4 sm:grid-cols-[190px_1fr] sm:gap-5"><span className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/40">{item.label}</span><span className="text-xs font-medium text-black/75">{item.value}</span></div>)}</div><div className="max-w-3xl border border-amber-900/10 bg-[#eee6d5] p-4"><div className="flex items-start gap-3"><CircleAlert className="mt-0.5 shrink-0 text-[#806b42]" size={17} /><div><h3 className="text-xs font-semibold text-[#51452f]">Before the website goes live</h3><p className="mt-1 text-[11px] leading-relaxed text-[#66583f]">Confirm the client&apos;s contact details, delivery rules, product collection, stock process, payment provider and admin users. Replace browser-only storage with a secure shared database and server-side authentication.</p></div></div></div></div>
            )}
          </div>
        </section>
      </div>

      {confirmDelete !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"><div className="w-full max-w-sm border border-black/10 bg-[#f5f4f0] p-6"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/40">Remove demo product</p><h3 className="mt-2 text-lg font-semibold">Are you sure?</h3><p className="mt-2 text-xs leading-relaxed text-black/55">This removes the locally added product from this browser. Bundled sample products cannot be removed here.</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setConfirmDelete(null)} className="border border-black/15 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em]">Cancel</button><button type="button" onClick={() => removeCustomProduct(confirmDelete)} className="bg-[#171717] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">Remove product</button></div></div></div>}
    </div>
  );
}

function MetricCard({ label, value, note, icon: Icon, muted = false }: { label: string; value: string; note: string; icon: typeof LayoutDashboard; muted?: boolean }) {
  return <div className="border border-black/10 bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><span className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/45">{label}</span><Icon size={16} className="text-black/35" strokeWidth={1.5} /></div><p className={`mt-4 text-3xl font-semibold tracking-[-0.05em] ${muted ? "text-black/35" : "text-[#171717]"}`}>{value}</p><p className="mt-1 text-[10px] text-black/40">{note}</p></div>;
}

function ProductRow({ product, isCustom }: { product: Product; isCustom: boolean }) {
  return <div className="flex items-center gap-3 px-5 py-3.5"><Image src={product.image} alt={product.name} width={40} height={48} unoptimized className="h-12 w-10 shrink-0 bg-[#eeede8] object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{product.name}</p><p className="mt-1 text-[10px] text-black/40">{product.category}</p></div><div className="text-right"><p className="text-xs font-semibold">{formatKES(product.price)}</p><span className={`mt-1 inline-block text-[8px] font-bold uppercase tracking-[0.1em] ${isCustom ? "text-emerald-700" : "text-black/35"}`}>{isCustom ? "Added here" : "Sample"}</span></div></div>;
}
