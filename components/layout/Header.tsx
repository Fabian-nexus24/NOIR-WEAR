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
import { useState, useSyncExternalStore } from "react";
import { Button } from "../ui/button";

const ADMIN_SESSION_KEY = "bloom_admin_session";
const ADMIN_SESSION_EVENT = "noir-admin-session-change";

function subscribeToAdminSession(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(ADMIN_SESSION_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ADMIN_SESSION_EVENT, callback);
  };
}

function getAdminSessionSnapshot() {
  try {
    const session = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return false;
    JSON.parse(session);
    return true;
  } catch {
    return false;
  }
}

function notifyAdminSessionChanged() {
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
}

export default function Header() {
  const { cart } = useCart();
  const cartCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const isAdminLoggedIn = useSyncExternalStore(
    subscribeToAdminSession,
    getAdminSessionSnapshot,
    () => false,
  );

  const pathname = usePathname();
  const router = useRouter();

  const isAdminArea = pathname === "/admin" || pathname?.startsWith("/admin/");
  const isProductCreatePage = pathname === "/admin/products/new";

  const handleAdminLogin = (email: string) => {
    try {
      localStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({ email, timestamp: Date.now() })
      );
      notifyAdminSessionChanged();
    } catch {
      // ignore
    }
  };

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      notifyAdminSessionChanged();
    } catch {
      // ignore
    }
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
            : "noir-site-header sticky top-0 z-50 w-full bg-[#F4F1EA] border-b border-black/10"
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
                  {isProductCreatePage ? "Add Product" : "Admin Dashboard"}
                </span>
              ) : (
                <Link
                  className="group flex flex-col text-[#111111] transition-opacity noir-header-brand"
                  href="/"
                  aria-label="NOIR Urban Wear Home"
                >
                  <span className="block text-2xl font-black leading-none tracking-[-0.04em] text-[#111111] transition-opacity group-hover:opacity-80 sm:text-3xl">NOIR</span>
                  <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.28em] text-[#111111]/80 transition-opacity group-hover:opacity-80 sm:text-[10px]">URBAN WEAR</span>
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
                      className={`relative whitespace-nowrap px-1 py-2 text-xs font-medium text-[#111111] after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#111111] after:transition-transform hover:after:scale-x-100 lg:text-sm ${
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

            {/* Desktop Search */}
            {!isAdminArea && (
              <div className="noir-header-desktop-search ml-auto hidden min-w-0 flex-1 md:w-64 md:max-w-xs md:flex lg:w-80 lg:max-w-sm">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <input
                    type="search"
                    placeholder="Search shoes, t-shirts, hoodies, bags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-black/15 bg-white/80 px-4 py-1.5 pl-9 text-sm text-[#111111] transition-all placeholder:text-neutral-500 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10"
                    aria-label="Search products"
                  />
                  <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#111111]" />
                </form>
              </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 noir-header-actions">
              {/* Mobile Search Toggle */}
              {!isAdminArea && (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="inline-flex size-10 items-center justify-center rounded-full text-[#111111] transition-colors hover:bg-black/5 md:hidden"
                  aria-label={isSearchOpen ? "Close search" : "Open search"}
                  aria-expanded={isSearchOpen}
                  aria-controls="mobile-search-panel"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {!isAdminArea && (
                isAdminLoggedIn ? (
                  <Link
                    href="/admin"
                    className="hidden size-10 items-center justify-center rounded-full text-[#111111] transition-colors hover:bg-black/5 md:inline-flex"
                    aria-label="Open admin account"
                  >
                    <UserRound className="h-5 w-5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAdminAuthOpen(true)}
                    className="hidden size-10 items-center justify-center rounded-full text-[#111111] transition-colors hover:bg-black/5 md:inline-flex"
                    aria-label="Open account access"
                  >
                    <UserRound className="h-5 w-5" />
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
                  isAdminArea ? "" : "md:hidden"
                } inline-flex size-10 items-center justify-center rounded-full text-[#111111] transition-colors hover:bg-black/5`}
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
            <div id="mobile-search-panel" className="mt-2 border-t border-black/10 pt-3 md:hidden">
              <form onSubmit={handleSearchSubmit} className="relative">
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
        onLoginSuccess={handleAdminLogin}
      />
    </>
  );
}
