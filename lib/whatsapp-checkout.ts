import type { CartItem } from "@/context/CartContext";
import { SITE_CONFIG } from "@/lib/site-config";
import { formatKES } from "@/lib/utils";

export function buildWhatsAppCheckoutUrl(cart: CartItem[]) {
  const itemsSubtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemDetails = cart
    .map((item, index) => {
      const attributes = [
        item.size ? `Size: ${item.size}` : null,
        item.colour ? `Colour: ${item.colour}` : null,
        `Quantity: ${item.quantity}`,
        `Line subtotal: ${formatKES(item.price * item.quantity)}`,
      ].filter(Boolean);

      return `${index + 1}. ${item.name}\n   ${attributes.join(" · ")}`;
    })
    .join("\n\n");
  const message = [
    "Hello NOIR Urban Wear, I would like to place an order:",
    "",
    itemDetails,
    "",
    `Items subtotal: ${formatKES(itemsSubtotal)}`,
    "",
    `Please confirm sizing, pickup at ${SITE_CONFIG.pickupAddress} or delivery, and M-Pesa details. Store hours: ${SITE_CONFIG.storeHours}.`,
  ].join("\n");
  const cleanNumber = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
