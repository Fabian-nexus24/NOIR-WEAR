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
    "Discover NOIR Urban Wear: a blend of streetwear and casual fashion for men and women in Kenya.",
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
          <div className="noir-demo-bar" role="note" aria-label="Demonstration store notice">
            <span>NOIR URBAN WEAR</span>
            <span>DEMONSTRATION STORE · SAMPLE PRODUCTS</span>
            <span>KENYA</span>
          </div>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
