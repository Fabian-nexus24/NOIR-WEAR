"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/site-config";

const shopLinks = [
  { href: "/shop", label: "All Collections" },
  { href: "/shop?category=Shoes", label: "Footwear & Shoes" },
  { href: "/shop?category=T-Shirts", label: "T-Shirts & Graphics" },
  { href: "/shop?category=Hoodies", label: "Hoodies & Fleece" },
  { href: "/shop?category=Accessories", label: "Bags & Accessories" },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) return null;

  return (
    <footer className="border-t border-neutral-200 bg-white text-[#0A0A0A]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 py-10 sm:py-12 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <Link href="/" className="text-xl font-black tracking-tight text-foreground">
              <span className="block text-xl font-black tracking-[0.12em]">NOIR</span>
              <span className="-mt-1 block text-[10px] font-semibold tracking-[0.32em]">URBAN WEAR</span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
              Streetwear attitude meets everyday essentials. Find your next favourite at NOIR Urban Wear.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#0A0A0A] sm:text-sm">Shop Categories</h2>
            <ul className="flex flex-col gap-2">
              {shopLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-neutral-700 sm:text-[15px] transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#0A0A0A] sm:text-sm">Visit Our Store</h2>
            <address className="flex flex-col gap-2 text-sm not-italic leading-relaxed text-neutral-700 sm:text-[15px]">
              <a
                href={SITE_CONFIG.storeDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                X36C+5WG, Kenyatta Hwy, Thika
              </a>
              <a
                href={SITE_CONFIG.storeDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit font-semibold underline underline-offset-4 transition-colors hover:text-primary"
              >
                Get directions
              </a>
              <span>10:00 AM – 8:00 PM</span>
            </address>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#0A0A0A] sm:text-sm">Get in Touch</h2>
            <a
              href="https://wa.me/254180865479"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-sm text-neutral-700 sm:text-[15px] transition-colors hover:text-primary"
            >
              WhatsApp: +254 180 865 479
            </a>
            <Link href="/contact" className="text-sm text-neutral-700 sm:text-[15px] transition-colors hover:text-primary">
              Contact NOIR
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-200 py-6 text-sm text-neutral-700 sm:flex-row sm:text-[15px]">
          <p>© {new Date().getFullYear()} NOIR Urban Wear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
