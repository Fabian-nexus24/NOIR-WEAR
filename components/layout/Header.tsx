"use client";

import AdminAuthModal from "@/components/admin/AdminAuthModal";
import { useCart } from "@/context/CartContext";
import {
  LogOut,
  Menu,
  Plus,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const isAdminLoggedIn = useSyncExternalStore(
    subscribeToAdminSession,
    getAdminSessionSnapshot,
    () => false,
  );

  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileOpen(false);
    setIsSearchOpen(false);
  }
  const router = useRouter();
  const isAdminArea = pathname === "/admin" || pathname?.startsWith("/admin/");
  const isProductCreatePage = pathname === "/admin/products/new";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const isActivePath = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Top Admin Status Bar when Logged In */}
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

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-xs"
            : "bg-background/85 backdrop-blur-md border-b border-border/60 shadow-none"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex items-center space-x-6 lg:space-x-10">
              {isAdminArea ? (
                <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {isProductCreatePage ? "Add Product" : "Admin Dashboard"}
                </span>
              ) : (
                <Link
                  className="text-xl sm:text-2xl font-black tracking-tight text-foreground hover:opacity-90 transition-opacity"
                  href="/"
                  aria-label="NOIR Urban Wear Home"
                >
                  <span className="block text-xl sm:text-2xl font-black tracking-[0.12em]">NOIR<span className="text-xs align-top ml-1 tracking-[0.18em] font-semibold">®</span></span><span className="block -mt-1 text-[8px] sm:text-[9px] tracking-[0.32em] font-semibold">URBAN WEAR</span>
                </Link>
              )}

              {!isAdminArea && (
                <nav
                  className="hidden md:flex items-center space-x-1"
                  role="navigation"
                  aria-label="Main navigation"
                >
                  {navItems.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`py-1.5 px-3.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActivePath(href)
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
              <div className="hidden lg:flex flex-1 max-w-md mx-8">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <input
                    type="search"
                    placeholder="Search shoes, t-shirts, hoodies, bags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-muted/60 border border-border/80 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
                    aria-label="Search products"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </form>
              </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Mobile Search Toggle */}
              {!isAdminArea && (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors text-foreground"
                  aria-label="Toggle search"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {/* Shopping Cart Button */}
              {!isAdminArea && (
                <Link
                  href="/cart"
                  className="relative p-2 rounded-full hover:bg-muted transition-all duration-200 group text-foreground"
                  aria-label={`Shopping cart with ${cartCount} items`}
                >
                  <ShoppingCart className="h-5 w-5 group-hover:scale-105 transition-transform" />
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                      aria-label={`${cartCount} items in cart`}
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {!isAdminArea && isAdminLoggedIn && (
                <Link href="/admin" className="hidden sm:flex">
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
                } p-2 rounded-full hover:bg-muted transition-colors text-foreground`}
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileOpen}
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
            <div className="lg:hidden mt-3 pt-3 border-t border-border/60 animate-in slide-in-from-top duration-200">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                  aria-label="Search products"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </form>
            </div>
          )}

          {/* Mobile Drawer Menu (also used on desktop in New Product mode) */}
          {isMobileOpen && (
            <nav
              className={`${
                isAdminArea ? "" : "md:hidden"
              } mt-3 animate-in slide-in-from-top duration-200 border-t border-border/60 pt-3`}
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col space-y-1 pb-3">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMobileMenu}
                    className={`text-sm font-medium py-2 px-3 rounded-lg transition-all ${
                      isActivePath(href)
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
