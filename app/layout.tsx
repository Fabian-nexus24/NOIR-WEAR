import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { CartProvider } from "@/context/CartContext";
import type { Metadata } from "next";
import { Inter, Permanent_Marker } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
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
        className={`${inter.className} ${permanentMarker.variable} antialiased flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary`}
      >
        <CartProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
