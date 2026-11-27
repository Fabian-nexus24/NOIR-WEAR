import { ArrowUpRight, Clock3, MapPin, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

const storeAddress = SITE_CONFIG.pickupAddress;
const whatsappUrl = "https://wa.me/254180865479";

const contactDetails = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    content: "+254 180 865 479",
    href: whatsappUrl,
    detail: "Message us about orders, sizing, and availability.",
  },
  {
    icon: MapPin,
    title: "Visit the store",
    content: storeAddress,
    href: SITE_CONFIG.storeDirectionsUrl,
    detail: "Find NOIR Urban Wear on Kenyatta Highway.",
    actionLabel: "Get directions",
  },
  {
    icon: Clock3,
    title: "Store hours",
    content: "10:00 AM – 8:00 PM",
    detail: "Visit us daily during store hours.",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border bg-muted/30 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            NOIR URBAN WEAR · THIKA
          </p>
          <h1 className="max-w-3xl text-4xl font-black tracking-[-0.06em] sm:text-5xl lg:text-7xl">
            Good style starts with a conversation.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Need help choosing a piece or placing an order? Message our team on WhatsApp or visit us in Thika.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 items-center gap-3 bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-80"
          >
            <MessageCircle aria-hidden="true" size={18} />
            Chat on WhatsApp
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-5xl gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {contactDetails.map(({ icon: Icon, title, content, href, detail, actionLabel }) => (
            <article key={title} className="flex min-h-56 flex-col items-start bg-background p-6 sm:p-8">
              <span className="mb-8 inline-flex size-10 items-center justify-center bg-muted">
                <Icon aria-hidden="true" size={19} />
              </span>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {title}
              </h2>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-lg font-semibold leading-snug underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  {content}
                </a>
              ) : (
                <p className="mt-3 text-lg font-semibold leading-snug">{content}</p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail}</p>
              {actionLabel && href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold tracking-[0.02em] text-[#80520e] underline decoration-[#80520e] underline-offset-4 transition-colors hover:text-[#5c3c0b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80520e]"
                >
                  {actionLabel}
                  <ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
