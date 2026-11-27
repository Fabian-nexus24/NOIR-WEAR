"use client";

import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

const DESKTOP_QUERY = "(min-width: 640px)";

function subscribeToDesktopChanges(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getIsDesktop() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function getServerIsDesktop() {
  return false;
}

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function WhatsAppWidget({
  phoneNumber = "",
  defaultMessage = "Hello NOIR Urban Wear! I need help with sizing or placing an order.",
}: WhatsAppWidgetProps) {
  const pathname = usePathname();
  const isDesktop = useSyncExternalStore(
    subscribeToDesktopChanges,
    getIsDesktop,
    getServerIsDesktop,
  );
  const [promptOverride, setPromptOverride] = useState<boolean | null>(null);
  const isPromptOpen = promptOverride ?? isDesktop;

  if (!phoneNumber.trim() || pathname === "/admin" || pathname?.startsWith("/admin/")) {
    return null;
  }

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    defaultMessage
  )}`;

  return (
    <div className="pointer-events-auto fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isPromptOpen && (
        <section
          aria-label="WhatsApp customer support"
          className="relative w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-black/10 bg-white p-4 shadow-xl animate-in slide-in-from-bottom-2 fade-in duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-[#111111]">
              Need help or want to order?
            </p>
            <button
              type="button"
              onClick={() => setPromptOverride(false)}
              className="-mr-1 -mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full text-lg leading-none text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-[#111111]"
              aria-label="Close WhatsApp help prompt"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <p className="mt-1 text-xs text-neutral-600">
            Chat directly with our team on WhatsApp for quick sizing, availability &amp; orders!
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
          >
            <svg aria-hidden="true" className="size-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>Open WhatsApp Chat</span>
          </a>
        </section>
      )}

      <button
        type="button"
        onClick={() => setPromptOverride(!isPromptOpen)}
        aria-label={isPromptOpen ? "Close WhatsApp help prompt" : "Open WhatsApp help prompt"}
        aria-expanded={isPromptOpen}
        className="relative inline-flex size-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        <svg
          aria-hidden="true"
          className="relative z-10 size-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span aria-hidden="true" className="absolute right-0 top-0 size-3.5 rounded-full border-2 border-white bg-emerald-300" />
      </button>
    </div>
  );
}
