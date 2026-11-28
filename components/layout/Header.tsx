"use client";

import AdminAuthModal from "@/components/admin/AdminAuthModal";
import { useCart } from "@/context/CartContext";
import {
  LogOut,
  Menu,
  Plus,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { useNoirSession } from "@/lib/use-noir-session";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const { cart } = useCart();
  const cartCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const { session, refresh: refreshSession } = useNoirSession();
  const isAdminLoggedIn = session?.isAdmin === true;

  const pathname = usePathname();
  const router = useRouter();

  const isAdminArea = pathname === "/admin" || pathname?.startsWith("/admin/");
  const isProductCreatePage = pathname === "/admin/products/new";

  const handleAdminLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    await refreshSession();
    router.refresh();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileOpen(false);
    }
  };

  const toggleMobileMenu = () => setIsMobileOpen((open) => !open);
  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    setIsSearchOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === "/") return pathname === "/";
    if (path.startsWith("/#")) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/#collections", label: "Collections" },
    { href: "/#about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={
          isAdminArea
            ? "sticky top-0 z-40 w-full border-b border-border bg-background"
            : "noir-site-header sticky top-0 z-50 w-full bg-white border-b border-neutral-200"
        }
      >
        {isAdminLoggedIn && !isAdminArea && (
          <div className="bg-foreground text-background text-xs py-1.5 px-4">
            <div className="container mx-auto flex items-center justify-between">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Admin Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        <div className="mx-auto w-full max-w-none px-4 py-2.5 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex min-w-0 items-center gap-4 md:gap-6 lg:gap-10 noir-header-brand-nav">
              {isAdminArea ? (
                <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {isProductCreatePage ? "Add Product" : "NOIR URBAN WEAR — ADMIN"}
                </span>
              ) : (
                <Link
                  className="group flex flex-col text-[#111111] transition-opacity noir-header-brand"
                  href="/"
                  aria-label="NOIR Urban Wear Home"
                >
                  <span className="block text-2xl font-black leading-none tracking-[-0.04em] text-[#111111] transition-opacity group-hover:opacity-80 sm:text-3xl">NOIR</span>
                  <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.28em] text-[#111111]/80 transition-opacity group-hover:opacity-80 sm:text-[11px]">URBAN WEAR</span>
                </Link>
              )}

              {!isAdminArea && (
                <nav
                  className="hidden items-center gap-3 md:flex lg:gap-5"
                  role="navigation"
                  aria-label="Main navigation"
                >
                  {navItems.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`relative whitespace-nowrap px-1 py-2 text-[13px] font-medium text-[#111111] after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#111111] after:transition-transform hover:after:scale-x-100 lg:text-sm ${
                        isActivePath(href) ? "font-semibold after:scale-x-100" : ""
                      }`}
                      aria-current={isActivePath(href) ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 sm:gap-2 noir-header-actions">
              {isAdminArea && (
                <Link
                  href="/"
                  className="mr-2 whitespace-nowrap px-2 py-2 text-sm font-medium text-foreground transition-colors hover:text-foreground/70"
                >
                  View Storefront
                </Link>
              )}
              {isAdminArea && isAdminLoggedIn && (
                <button type="button" onClick={handleAdminLogout} className="whitespace-nowrap px-2 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-[#0A0A0A]">
                  Sign out
                </button>
              )}

              {/* Search Toggle */}
              {!isAdminArea && (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="inline-flex size-10 items-center justify-center rounded-full text-[#111111] transition-colors hover:bg-black/5"
                  aria-label={isSearchOpen ? "Close search" : "Open search"}
                  aria-expanded={isSearchOpen}
                  aria-controls="header-search-panel"
                >
                  {isSearchOpen ? (
                    <X aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    <Search aria-hidden="true" className="h-5 w-5" />
                  )}
                </button>
              )}

              {!isAdminArea && (
                session ? (
                  <Link
                    href={isAdminLoggedIn ? "/admin" : "/account"}
                    className="inline-flex size-10 items-center justify-center rounded-full text-[#111111] transition-colors hover:bg-black/5"
                    aria-label={isAdminLoggedIn ? "Open admin dashboard" : "Open customer account"}
                  >
                    <UserRound aria-hidden="true" className="h-5 w-5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAdminAuthOpen(true)}
                    className="inline-flex size-10 items-center justify-center rounded-full text-[#111111] transition-colors hover:bg-black/5"
                    aria-label="Open account access"
                  >
                    <UserRound aria-hidden="true" className="h-5 w-5" />
                  </button>
                )
              )}

              {/* Shopping Cart Button */}
              {!isAdminArea && (
                <Link
                  href="/cart"
                  className="group relative inline-flex size-10 items-center justify-center rounded-full text-[#111111] transition-colors hover:bg-black/5"
                  aria-label={`Shopping cart with ${cartCount} items`}
                >
                  <ShoppingCart aria-hidden="true" className="size-5 transition-transform group-hover:scale-105" />
                  <span
                    aria-hidden="true"
                    className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#111111] px-1 text-[10px] font-bold text-white"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                </Link>
              )}

              {!isAdminArea && isAdminLoggedIn && (
                <Link href="/admin" className="hidden md:flex">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 border-primary/40 text-primary hover:bg-primary/10 gap-1.5 font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Hamburger (also shown on desktop in New Product mode) */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className={`${
                  isAdminArea ? (isProductCreatePage ? "inline-flex" : "hidden") : "inline-flex md:hidden"
                } size-10 items-center justify-center rounded-full text-[#111111] transition-colors hover:bg-black/5`}
                aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMobileOpen}
                aria-controls="mobile-navigation"
              >
                {isMobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Expandable Mobile Search Bar */}
          {!isAdminArea && isSearchOpen && (
            <div id="header-search-panel" className="mt-2 border-t border-black/10 pt-3">
              <form onSubmit={handleSearchSubmit} className="relative mx-auto w-full max-w-xl">
                <input
                  type="search"
                  placeholder="Search shoes, t-shirts, hoodies, bags..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-full border border-black/15 bg-white/80 px-4 py-2 pl-10 text-sm text-[#111111] placeholder:text-neutral-500 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
                  aria-label="Search products"
                  autoFocus
                />
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#111111]" />
              </form>
            </div>
          )}

          {/* Mobile Drawer Menu (also used on desktop in New Product mode) */}
          {isMobileOpen && (
            <nav
              id="mobile-navigation"
              className={`${
                isAdminArea ? "" : "md:hidden"
              } mt-3 animate-in slide-in-from-top duration-200 border-t border-black/10 pt-3`}
              role="navigation"
              aria-label="Mobile navigation"
            >
              {!isAdminArea && (
                <form onSubmit={handleSearchSubmit} className="relative mb-3">
                  <input
                    type="search"
                    placeholder="Search shoes, t-shirts, hoodies, bags..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full rounded-full border border-black/15 bg-white/80 px-4 py-2 pl-10 text-sm text-[#111111] placeholder:text-neutral-500 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
                    aria-label="Search products"
                  />
                  <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#111111]" />
                </form>
              )}
              <div className="flex flex-col gap-1 pb-3">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMobileMenu}
                    className={`text-sm font-medium py-2 px-3 rounded-lg transition-all ${
                      isActivePath(href)
                          ? "bg-primary/10 text-[#111111] font-semibold"
                          : "text-[#111111] hover:bg-black/5"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
                {isAdminLoggedIn ? (
                  <>
                    <Link href="/admin/products/new" onClick={closeMobileMenu} className="w-full">
                      <Button
                        size="sm"
                        className="w-full bg-primary text-primary-foreground text-xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add New Product
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        handleAdminLogout();
                        closeMobileMenu();
                      }}
                      className="w-full text-red-500 hover:text-red-600 text-xs"
                    >
                      Logout
                    </Button>
                  </>
                ) : null}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Admin Auth Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
      />
    </>
  );
}
