"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRODUCT_CATEGORIES } from "@/lib/admin-dashboard-storage";
import type { Product } from "@/types/product";

type Props = {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
};

type NewProduct = {
  name: string;
  category: Product["category"];
  price: number;
  compareAtPrice: number | null;
  sizes: string[];
  image: string;
  inStock: boolean;
  description: string;
};

export default function AdminProductsPanel({ products, onProductsChange }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesQuery = !query || [product.name, product.category, String(product.id)]
        .some((value) => value.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [category, products, search]);

  const updateProduct = (id: number, patch: Partial<Product>) => {
    onProductsChange(products.map((product) => product.id === id ? { ...product, ...patch } : product));
  };

  const addProduct = (values: NewProduct) => {
    const id = products.reduce((highest, product) => Math.max(highest, product.id), 0) + 1;
    const product: Product = {
      id,
      name: values.name,
      category: values.category,
      price: values.price,
      originalPrice: values.compareAtPrice ?? undefined,
      sizes: values.sizes,
      image: values.image,
      description: values.description,
      inStock: values.inStock,
      isSoldOut: !values.inStock,
      rating: 5,
      reviewsCount: 0,
    };
    onProductsChange([...products, product]);
    setIsDialogOpen(false);
  };

  const deleteProduct = (product: Product) => {
    const shouldDelete = window.confirm(`Delete “${product.name}” from the catalogue?`);
    if (shouldDelete) onProductsChange(products.filter((item) => item.id !== product.id));
  };

  return (
    <section aria-labelledby="products-heading" className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 id="products-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">Products</h2>
          <p className="mt-1 text-sm text-neutral-600">Search the catalogue, update pricing and stock, or add a product.</p>
        </div>
        <Button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="w-fit rounded-sm bg-[#0A0A0A] text-sm text-white shadow-none hover:bg-neutral-800"
        >
          <Plus data-icon="inline-start" aria-hidden="true" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search products</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="h-11 rounded-sm border-neutral-300 pl-9 text-sm shadow-none focus-visible:ring-[#0A0A0A]"
          />
        </label>
        <label className="flex min-w-48 flex-col gap-1 text-sm font-medium">
          <span className="sr-only">Filter by category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 w-full border border-neutral-300 bg-white px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A]"
          >
            <option value="All">All categories</option>
            {PRODUCT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div className="overflow-hidden border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-medium text-neutral-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Product</th>
                <th scope="col" className="px-4 py-3 font-medium">Category</th>
                <th scope="col" className="px-4 py-3 font-medium">Price (KSh)</th>
                <th scope="col" className="px-4 py-3 font-medium">Compare-at (KSh)</th>
                <th scope="col" className="px-4 py-3 font-medium">Sizes</th>
                <th scope="col" className="px-4 py-3 font-medium">In Stock</th>
                <th scope="col" className="px-4 py-3 font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {visibleProducts.map((product) => (
                <tr key={product.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex min-w-52 items-center gap-3">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={44}
                        height={52}
                        unoptimized
                        className="size-12 shrink-0 bg-neutral-100 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="max-w-56 truncate font-medium text-[#0A0A0A]">{product.name}</p>
                        <p className="mt-1 text-xs text-neutral-500">ID #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600">{product.category}</td>
                  <td className="px-4 py-3">
                    <PriceEditor
                      key={`${product.id}-price-${product.price}`}
                      value={product.price}
                      label={`Price for ${product.name}`}
                      onSave={(value) => updateProduct(product.id, { price: value ?? 0 })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <PriceEditor
                      key={`${product.id}-compare-${product.originalPrice ?? "empty"}`}
                      value={product.originalPrice ?? null}
                      label={`Compare-at price for ${product.name}`}
                      onSave={(value) => updateProduct(product.id, { originalPrice: value ?? undefined })}
                    />
                  </td>
                  <td className="max-w-44 px-4 py-3 text-neutral-600">{product.sizes?.length ? product.sizes.join(", ") : "—"}</td>
                  <td className="px-4 py-3">
                    <StockToggle
                      inStock={product.inStock ?? !product.isSoldOut}
                      name={product.name}
                      onChange={(inStock) => updateProduct(product.id, { inStock, isSoldOut: !inStock })}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${product.name}`}
                      onClick={() => deleteProduct(product)}
                      className="rounded-sm text-neutral-500 hover:bg-neutral-100 hover:text-red-700"
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              ))}
              {!visibleProducts.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-neutral-600">
                    No products match your search or category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-sm text-neutral-500">Product changes are saved to the NOIR catalogue.</p>

      <ProductFormDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} onAdd={addProduct} />
    </section>
  );
}

function PriceEditor({ value, label, onSave }: { value: number | null; label: string; onSave: (value: number | null) => void }) {
  const [draft, setDraft] = useState(value === null ? "" : String(value));

  const commit = () => {
    if (!draft.trim()) {
      if (value !== null) onSave(null);
      return;
    }
    const parsed = Number(draft);
    if (Number.isFinite(parsed) && parsed >= 0) {
      if (parsed !== value) onSave(parsed);
    } else {
      setDraft(value === null ? "" : String(value));
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-neutral-500">KSh</span>
      <Input
        aria-label={label}
        type="number"
        min="0"
        step="1"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        className="h-9 w-24 rounded-sm border-neutral-300 px-2 text-sm shadow-none focus-visible:ring-[#0A0A0A]"
      />
    </div>
  );
}

function StockToggle({ inStock, name, onChange }: { inStock: boolean; name: string; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      aria-pressed={inStock}
      aria-label={`${name}: ${inStock ? "in stock" : "out of stock"}. Toggle stock status`}
      onClick={() => onChange(!inStock)}
      className={`inline-flex min-w-24 items-center justify-center border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 ${
        inStock ? "border-neutral-300 bg-white text-[#0A0A0A]" : "border-neutral-200 bg-neutral-100 text-neutral-600"
      }`}
    >
      {inStock ? "In Stock" : "Out of Stock"}
    </button>
  );
}

function ProductFormDialog({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (product: NewProduct) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="add-product-heading"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto max-h-[92vh] w-[min(680px,calc(100%-2rem))] overflow-y-auto border border-neutral-200 bg-white p-0 text-[#0A0A0A] shadow-xl backdrop:bg-black/40"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const price = Number(data.get("price"));
          const compareAtValue = String(data.get("compareAtPrice") ?? "").trim();
          const compareAtPrice = compareAtValue ? Number(compareAtValue) : null;
          if (compareAtPrice !== null && compareAtPrice <= price) {
            setError("Compare-at price should be higher than the current price.");
            return;
          }
          setError("");
          onAdd({
            name: String(data.get("name")).trim(),
            category: String(data.get("category")) as Product["category"],
            price,
            compareAtPrice,
            sizes: String(data.get("sizes") ?? "").split(",").map((size) => size.trim()).filter(Boolean),
            image: String(data.get("image")).trim(),
            inStock: data.get("inStock") === "on",
            description: String(data.get("description") ?? "").trim(),
          });
          event.currentTarget.reset();
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:px-6">
          <div>
            <h2 id="add-product-heading" className="text-lg font-semibold">Add Product</h2>
            <p className="mt-1 text-sm text-neutral-600">Add an item to this browser&apos;s catalogue.</p>
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Close add product form" onClick={onClose} className="rounded-sm">
            <X aria-hidden="true" />
          </Button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
            Name
            <Input name="name" required maxLength={100} placeholder="e.g. Everyday Essential Hoodie" className="h-11 rounded-sm border-neutral-300 text-sm shadow-none focus-visible:ring-[#0A0A0A]" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Category
            <select name="category" defaultValue="Shoes" className="h-11 border border-neutral-300 bg-white px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A]">
              {PRODUCT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Price (KSh)
            <Input name="price" type="number" min="0" step="1" required placeholder="3500" className="h-11 rounded-sm border-neutral-300 text-sm shadow-none focus-visible:ring-[#0A0A0A]" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Compare-at / Sale Price (KSh)
            <Input name="compareAtPrice" type="number" min="0" step="1" placeholder="Optional" className="h-11 rounded-sm border-neutral-300 text-sm shadow-none focus-visible:ring-[#0A0A0A]" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Sizes
            <Input name="sizes" placeholder="S, M, L, XL or 40, 41, 42" className="h-11 rounded-sm border-neutral-300 text-sm shadow-none focus-visible:ring-[#0A0A0A]" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
            Image URL
            <Input name="image" type="url" required placeholder="https://example.com/product.jpg" className="h-11 rounded-sm border-neutral-300 text-sm shadow-none focus-visible:ring-[#0A0A0A]" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
            Description <span className="font-normal text-neutral-500">(optional)</span>
            <textarea name="description" rows={3} className="resize-y border border-neutral-300 px-3 py-2.5 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A]" placeholder="Short product description" />
          </label>
          <label className="flex items-center gap-3 text-sm font-medium sm:col-span-2">
            <input name="inStock" type="checkbox" defaultChecked className="size-4 accent-[#0A0A0A]" />
            In Stock
          </label>
          {error && <p className="text-sm text-red-700 sm:col-span-2" role="alert">{error}</p>}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-neutral-200 px-5 py-4 sm:px-6">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-sm border-neutral-300 bg-white text-sm shadow-none">Cancel</Button>
          <Button type="submit" className="rounded-sm bg-[#0A0A0A] text-sm text-white shadow-none hover:bg-neutral-800">Save Product</Button>
        </div>
      </form>
    </dialog>
  );
}
