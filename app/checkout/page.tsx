"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheck,
  CreditCard,
  LockKeyhole,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";
import { useCart, type CartItem } from "@/context/CartContext";
import { formatKES } from "@/lib/utils";
import { buildWhatsAppCheckoutUrl } from "@/lib/whatsapp-checkout";

type PaymentMethod = "mpesa" | "pay-on-delivery";
type CompletedOrder = {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  createdAt: string;
  deliveryInstructions: string;
};

const counties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", "Homa Bay",
  "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii",
  "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera",
  "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi",
  "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta",
  "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga",
  "Wajir", "West Pokot",
];

const fieldClass = "noir-checkout-input";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [county, setCounty] = useState("Nairobi");
  const [town, setTown] = useState("");
  const [estate, setEstate] = useState("");
  const [building, setBuilding] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );
  const whatsappCheckoutUrl = buildWhatsAppCheckoutUrl(cart);

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // This is a front-end demonstration only. No payment is collected and no order is sent to a store.
    await new Promise((resolve) => setTimeout(resolve, 650));
    const order: CompletedOrder = {
      orderNumber: `NOIR-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      phone: phone.trim(),
      deliveryAddress: [estate, building, town, county, "Kenya"].filter(Boolean).join(", "),
      paymentMethod,
      items: [...cart],
      subtotal,
      createdAt: new Date().toLocaleString("en-KE", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      deliveryInstructions: deliveryInstructions.trim(),
    };
    setCompletedOrder(order);
    clearCart();
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (completedOrder) {
    return (
      <div className="noir-checkout-page">
        <div className="noir-checkout-shell noir-confirmation-shell">
          <div className="noir-confirmation-mark"><CircleCheck size={34} strokeWidth={1.4} /></div>
          <p className="noir-checkout-eyebrow">NOIR URBAN WEAR · DEMONSTRATION</p>
          <h1>THANK YOU,<br /><span>{completedOrder.customerName.split(" ")[0].toUpperCase()}.</span></h1>
          <p className="noir-confirmation-lead">Your checkout demonstration is complete.</p>
          <div className="noir-demo-alert" role="status">
            <strong>This is a sample order, not a real purchase.</strong>
            <span>No payment was collected and the order was not sent to a store. Live M-PESA and order processing will be connected before launch.</span>
          </div>
          <div className="noir-confirmation-card">
            <div className="noir-confirmation-topline"><span>DEMO ORDER REFERENCE</span><strong>{completedOrder.orderNumber}</strong></div>
            <div className="noir-confirmation-grid">
              <div><span>DATE</span><strong>{completedOrder.createdAt}</strong></div>
              <div><span>ITEMS SUBTOTAL</span><strong>{formatKES(completedOrder.subtotal)}</strong></div>
              <div><span>PAYMENT PREVIEW</span><strong>{completedOrder.paymentMethod === "mpesa" ? "M-PESA" : "Pay on delivery"}</strong></div>
              <div><span>DELIVERY TO</span><strong>{completedOrder.deliveryAddress}</strong></div>
              <div><span>CONTACT</span><strong>{completedOrder.phone}<br />{completedOrder.email}</strong></div>
            </div>
            <div className="noir-confirmation-items">
              <p>YOUR ITEMS ({completedOrder.items.reduce((sum, item) => sum + item.quantity, 0)})</p>
              {completedOrder.items.map((item) => (
                <div className="noir-confirmation-item" key={`${item.id}-${item.size || "one"}-${item.colour || "default"}`}>
                  <div className="noir-confirmation-image"><Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" /></div>
                  <div className="noir-confirmation-product"><strong>{item.name}</strong><span>{item.quantity} × {formatKES(item.price)}{item.size ? ` · Size ${item.size}` : ""}{item.colour ? ` · ${item.colour}` : ""}</span></div>
                  <b>{formatKES(item.price * item.quantity)}</b>
                </div>
              ))}
            </div>
            {completedOrder.deliveryInstructions ? <div className="noir-confirmation-note"><span>DELIVERY INSTRUCTIONS</span><strong>{completedOrder.deliveryInstructions}</strong></div> : null}
          </div>
          <Link href="/shop" className="noir-checkout-primary noir-confirmation-cta">CONTINUE EXPLORING <ArrowRight size={15} /></Link>
          <p className="noir-confirmation-footnote">NOIR URBAN WEAR · OWN YOUR EVERYDAY</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="noir-checkout-page">
        <div className="noir-checkout-shell noir-checkout-empty">
          <div className="noir-empty-checkout-icon"><ShoppingBag size={29} strokeWidth={1.3} /></div>
          <p className="noir-checkout-eyebrow">YOUR NOIR BAG</p>
          <h1>NOTHING HERE<br /><span>JUST YET.</span></h1>
          <p>Your bag is waiting for something good. Explore the collection and add a few pieces to get started.</p>
          <Link href="/shop" className="noir-checkout-primary">EXPLORE THE SHOP <ArrowRight size={15} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="noir-checkout-page">
      <div className="noir-checkout-shell">
        <div className="noir-checkout-topbar">
          <Link href="/cart" className="noir-checkout-back"><ArrowLeft size={14} /> BACK TO BAG</Link>
          <div className="noir-checkout-progress" aria-label="Checkout progress">
            <span className="done"><Check size={11} /> BAG</span><i /><span className="active">02 CHECKOUT</span><i /><span>03 COMPLETE</span>
          </div>
          <span className="noir-checkout-secure"><LockKeyhole size={12} /> SECURE CHECKOUT PREVIEW</span>
        </div>

        <header className="noir-checkout-heading">
          <div>
            <p className="noir-checkout-eyebrow">ALMOST YOURS · STEP 02</p>
            <h1>THE FINAL<br /><span>DETAILS.</span></h1>
            <p>Where should we send your NOIR pieces?</p>
          </div>
          <div className="noir-checkout-heading-note"><span>NOIR</span><small>URBAN WEAR<br />KENYA</small></div>
        </header>

        <div className="noir-checkout-layout">
          <form id="noir-checkout-form" className="noir-checkout-form" onSubmit={handlePlaceOrder}>
            <section className="noir-checkout-section">
              <div className="noir-checkout-section-heading"><span>01</span><div><h2>CONTACT DETAILS</h2><p>How can we reach you about your order?</p></div></div>
              <div className="noir-checkout-fields two-col">
                <label className="noir-checkout-field"><span>EMAIL ADDRESS <b>*</b></span><input className={fieldClass} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></label>
                <label className="noir-checkout-field"><span>PHONE NUMBER <b>*</b></span><input className={fieldClass} type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XX XXX XXX" pattern="(\+254|0)(7|1)[0-9]{8}" title="Enter a Kenyan number, for example 0712345678 or +254712345678" required /></label>
              </div>
              <p className="noir-checkout-helper">Use a Kenyan mobile number, for example 0712 345 678 or +254 712 345 678.</p>
            </section>

            <section className="noir-checkout-section">
              <div className="noir-checkout-section-heading"><span>02</span><div><h2>DELIVERY ADDRESS</h2><p>Tell us where your order should go.</p></div></div>
              <div className="noir-checkout-fields two-col">
                <label className="noir-checkout-field"><span>FIRST NAME <b>*</b></span><input className={fieldClass} autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required /></label>
                <label className="noir-checkout-field"><span>LAST NAME <b>*</b></span><input className={fieldClass} autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required /></label>
                <label className="noir-checkout-field"><span>COUNTY <b>*</b></span><div className="noir-checkout-select-wrap"><select className={fieldClass} value={county} onChange={(e) => setCounty(e.target.value)} required>{counties.map((name) => <option key={name} value={name}>{name} County</option>)}</select><ChevronDown size={15} /></div></label>
                <label className="noir-checkout-field"><span>TOWN / CITY <b>*</b></span><input className={fieldClass} autoComplete="address-level2" value={town} onChange={(e) => setTown(e.target.value)} placeholder="e.g. Nairobi, Nakuru, Mombasa" required /></label>
                <label className="noir-checkout-field"><span>ESTATE / AREA <b>*</b></span><input className={fieldClass} autoComplete="address-line1" value={estate} onChange={(e) => setEstate(e.target.value)} placeholder="Estate, neighbourhood or area" required /></label>
                <label className="noir-checkout-field"><span>BUILDING / HOUSE / LANDMARK</span><input className={fieldClass} value={building} onChange={(e) => setBuilding(e.target.value)} placeholder="Building, house number or landmark" /></label>
              </div>
              <label className="noir-checkout-field noir-checkout-notes"><span>DELIVERY INSTRUCTIONS <small>OPTIONAL</small></span><textarea value={deliveryInstructions} onChange={(e) => setDeliveryInstructions(e.target.value)} rows={3} placeholder="Anything that will help the rider find you?" /></label>
            </section>

            <section className="noir-checkout-section noir-payment-section">
              <div className="noir-checkout-section-heading"><span>03</span><div><h2>PAYMENT PREFERENCE</h2><p>Choose how you would prefer to pay when the store is live.</p></div></div>
              <div className="noir-payment-preview-banner"><Smartphone size={17} /><div><strong>PAYMENT OPTIONS ARE PREVIEW-ONLY</strong><span>No money will be requested or collected in this demonstration.</span></div></div>
              <div className="noir-payment-options">
                <label className={`noir-payment-option ${paymentMethod === "mpesa" ? "selected" : ""}`}>
                  <input type="radio" name="payment" value="mpesa" checked={paymentMethod === "mpesa"} onChange={() => setPaymentMethod("mpesa")} />
                  <span className="noir-payment-icon"><Smartphone size={19} /></span><span className="noir-payment-copy"><strong>M-PESA</strong><small>Mobile money · STK push integration pending</small></span><span className="noir-payment-tag">POPULAR</span>
                </label>
                <label className={`noir-payment-option ${paymentMethod === "pay-on-delivery" ? "selected" : ""}`}>
                  <input type="radio" name="payment" value="pay-on-delivery" checked={paymentMethod === "pay-on-delivery"} onChange={() => setPaymentMethod("pay-on-delivery")} />
                  <span className="noir-payment-icon"><Truck size={19} /></span><span className="noir-payment-copy"><strong>PAY ON DELIVERY</strong><small>Availability and terms to be confirmed by the store</small></span>
                </label>
              </div>
            </section>

            <div className="noir-checkout-submit-mobile">
              <button type="submit" form="noir-checkout-form" disabled={isSubmitting} className="noir-checkout-primary">{isSubmitting ? "PREPARING PREVIEW…" : "COMPLETE DEMO CHECKOUT"}<ArrowRight size={15} /></button>
              <p><ShieldCheck size={13} /> Demonstration only · No payment is taken</p>
            </div>
          </form>

          <aside className="noir-checkout-summary-column">
            <div className="noir-checkout-summary">
              <div className="noir-checkout-summary-heading"><div><p>YOUR SELECTION</p><h2>ORDER SUMMARY</h2></div><span>{itemCount} ITEMS</span></div>
              <div className="noir-checkout-summary-items">
                {cart.map((item) => (
                  <div className="noir-checkout-summary-item" key={`${item.id}-${item.size || "one"}-${item.colour || "default"}`}>
                    <div className="noir-checkout-summary-image"><Image src={item.image} alt={item.name} fill sizes="76px" className="object-cover" /></div>
                    <div className="noir-checkout-summary-product"><strong>{item.name}</strong><span>{item.size ? `SIZE ${item.size}` : "STANDARD"}{item.colour ? ` · ${item.colour}` : ""}</span><small>QTY {item.quantity}</small></div>
                    <b>{formatKES(item.price * item.quantity)}</b>
                  </div>
                ))}
              </div>
              <div className="noir-checkout-totals">
                <div><span>Items subtotal</span><strong>{formatKES(subtotal)}</strong></div>
                <div><span>Delivery</span><strong className="pending-delivery">Calculated / Confirmed on Order</strong></div>
                <div className="noir-checkout-total"><span>ITEMS TOTAL</span><strong>{formatKES(subtotal)}</strong></div>
                <p>Delivery charges and the final payable amount will be confirmed by the store. This preview does not process a payment.</p>
              </div>
              <button type="submit" form="noir-checkout-form" disabled={isSubmitting} className="noir-checkout-primary noir-checkout-submit">{isSubmitting ? "PREPARING PREVIEW…" : "COMPLETE DEMO CHECKOUT"}<ArrowRight size={15} /></button>
              <a href={whatsappCheckoutUrl} target="_blank" rel="noopener noreferrer" className="noir-whatsapp-checkout-button"><MessageCircle aria-hidden="true" size={17} /> Order via WhatsApp</a>
              <div className="noir-checkout-trust"><LockKeyhole size={13} /><span>YOUR DETAILS ARE FOR THIS LOCAL DEMO ONLY</span></div>
              <div className="noir-checkout-delivery-note"><MapPin size={16} /><div><strong>THIKA PICKUP &amp; DELIVERY</strong><span>Pickup at X36C+5WG, Kenyatta Hwy, Thika · 10:00 AM – 8:00 PM. Delivery confirmed on order.</span></div></div>
            </div>
            <Link href="/cart" className="noir-checkout-edit-bag"><ArrowLeft size={13} /> RETURN TO YOUR BAG</Link>
            <div className="noir-checkout-help"><MessageCircle size={15} /><span>Questions about sizing, pickup, delivery or M-Pesa? Message us on WhatsApp.</span></div>
          </aside>
        </div>
        <div className="noir-checkout-footerline"><span>NOIR URBAN WEAR</span><span>OWN YOUR EVERYDAY.</span><span><CreditCard size={12} /> PAYMENT PREVIEW</span></div>
      </div>
    </div>
  );
}
