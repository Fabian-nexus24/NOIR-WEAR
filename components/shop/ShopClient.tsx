"use client";

import ProductCard from "@/components/home/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import defaultProducts from "@/data/products.json";
import { CATALOGUE_UPDATED_EVENT, readAdminProducts } from "@/lib/admin-dashboard-storage";
import { formatKES } from "@/lib/utils";
import { Product } from "@/types/product";
import { ArrowDownUp, ArrowRight, Filter, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const BASE_CATEGORIES = ["All", "Shoes", "T-Shirts", "Hoodies", "Accessories"];

export default function ShopClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(defaultProducts as Product[]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || searchParams.get("search") || "");
  const [maxPrice, setMaxPrice] = useState(6000);
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(BASE_CATEGORIES);

  useEffect(() => {
    const loadData = () => {
      setProducts(readAdminProducts());
      try {
        const storedCats = localStorage.getItem("bloom_custom_categories");
        if (storedCats) setCategories(["All", ...Array.from(new Set([...BASE_CATEGORIES.slice(1), ...JSON.parse(storedCats)]))]);
      } catch { /* Keep the sample categories available if browser storage is invalid. */ }
    };
    loadData();
    window.addEventListener("storage", loadData);
    window.addEventListener(CATALOGUE_UPDATED_EVENT, loadData);
    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener(CATALOGUE_UPDATED_EVENT, loadData);
    };
  }, []);

  const searchParamsKey = searchParams.toString();
  const [prevSearchParamsKey, setPrevSearchParamsKey] = useState(searchParamsKey);
  if (searchParamsKey !== prevSearchParamsKey) {
    setPrevSearchParamsKey(searchParamsKey);
    const category = searchParams.get("category");
    const search = searchParams.get("q") || searchParams.get("search");
    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
  }

  const filteredProducts = useMemo(() => products
    .filter((product) => {
      if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches = product.name.toLowerCase().includes(query)
          || product.description?.toLowerCase().includes(query)
          || product.category?.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return product.price <= maxPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return a.id - b.id;
    }), [products, selectedCategory, searchQuery, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setMaxPrice(6000);
    setSortBy("featured");
  };
  const hasActiveFilters = selectedCategory !== "All" || searchQuery !== "" || maxPrice < 6000 || sortBy !== "featured";

  return (
    <div className="noir-shop">
      <section className="noir-shop-hero">
        <div className="noir-shop-hero-image" aria-hidden="true" />
        <div className="noir-shop-hero-shade" aria-hidden="true" />
        <div className="noir-shop-hero-content">
          <p className="noir-eyebrow">THE NOIR EDIT · SAMPLE COLLECTION</p>
          <h1>FIND YOUR<br /><span>EVERYDAY.</span></h1>
          <p>Streetwear attitude. Everyday essentials. Explore the NOIR sample collection.</p>
          <a href="#noir-catalogue" className="noir-button noir-button-light">EXPLORE THE COLLECTION <ArrowRight size={15} /></a>
        </div>
        <span className="noir-shop-hero-index">01 / THE COLLECTION</span>
      </section>

      <div className="noir-shop-shell" id="noir-catalogue">
        <div className="noir-shop-heading">
          <div>
            <p className="noir-eyebrow noir-eyebrow-dark">CURATED FOR EVERY DAY</p>
            <h2>THE COLLECTION<span>.</span></h2>
            <p className="noir-shop-subtitle">A preview of the styles that could make up the NOIR wardrobe.</p>
          </div>
          <span className="noir-sample-label">DEMO PRODUCTS · NOT LIVE INVENTORY</span>
        </div>

        <div className="noir-shop-toolbar">
          <div className="noir-shop-search">
            <Search size={16} />
            <Input type="search" placeholder="Search the collection" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
            {searchQuery && <button aria-label="Clear search" onClick={() => setSearchQuery("")}><X size={15} /></button>}
          </div>
          <div className="noir-shop-toolbar-actions">
            <Button variant="outline" size="sm" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)} className="noir-filter-toggle lg:hidden">
              <SlidersHorizontal size={15} /> Filters
            </Button>
            <label className="noir-sort-control"><ArrowDownUp size={14} /><span>Sort</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort products">
                <option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>
        </div>

        <div className="noir-shop-layout">
          <aside className={`noir-shop-filters ${isMobileFiltersOpen ? "is-open" : ""}`}>
            <div className="noir-filter-heading"><span><Filter size={15} /> REFINE</span>
              {hasActiveFilters && <button onClick={resetFilters}><RotateCcw size={12} /> Reset</button>}
            </div>
            <div className="noir-filter-group"><h3>CATEGORY</h3>
              {categories.map((category) => {
                const count = category === "All" ? products.length : products.filter((product) => product.category === category).length;
                return <button key={category} className={`noir-category-option ${selectedCategory === category ? "active" : ""}`} onClick={() => setSelectedCategory(category)}><span>{category}</span><span>{count.toString().padStart(2, "0")}</span></button>;
              })}
            </div>
            <div className="noir-filter-group noir-price-filter"><div className="noir-price-heading"><h3>PRICE RANGE</h3><strong>{formatKES(maxPrice)}</strong></div>
              <input type="range" min="500" max="6000" step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum price" />
              <div><span>KSh 500</span><span>KSh 6,000+</span></div>
            </div>
            <p className="noir-filter-note">Prices and products are illustrative and can be replaced with the client&apos;s actual collection.</p>
          </aside>

          <section className="noir-shop-results" aria-label="Product results">
            <div className="noir-results-meta"><span><strong>{filteredProducts.length.toString().padStart(2, "0")}</strong> ITEMS</span>
              {hasActiveFilters && <button onClick={resetFilters}>CLEAR ALL <X size={12} /></button>}
            </div>
            {filteredProducts.length ? <div className="noir-product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} className="noir-product-card" />)}</div> :
              <div className="noir-empty-results"><Search size={28} /><h3>NOTHING FOUND.</h3><p>Try another search or adjust your filters to explore the collection.</p><Button onClick={resetFilters}>RESET FILTERS</Button></div>}
          </section>
        </div>
      </div>
    </div>
  );
}
