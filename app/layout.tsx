import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { CartProvider } from "@/context/CartContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOIR Urban Wear — Streetwear & Everyday Style",
  description:
    "Shop streetwear and everyday essentials from NOIR Urban Wear in Thika. Visit X36C+5WG, Kenyatta Hwy, Thika, or order via WhatsApp with same-day delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary`}
      >
        <CartProvider>
          <div className="noir-demo-bar" role="note" aria-label="Store location and delivery information">
            <span>NOIR URBAN WEAR · X36C+5WG, KENYATTA HWY, THIKA · SAME-DAY DELIVERY</span>
          </div>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
