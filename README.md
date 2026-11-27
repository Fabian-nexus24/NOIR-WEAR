# NOIR Urban Wear — E-commerce Demonstration

A client-presentation storefront for a Kenyan fashion brand combining streetwear and casual fashion for men and women. The current catalogue is made up of demonstration products only.

## Important before launch

Replace all sample product names, images, descriptions, sizes, prices, stock information, delivery rules, contact details, and social links with client-approved information. The demonstration notice is intentionally visible so visitors do not mistake sample listings for real inventory.

The project currently uses Next.js, React, TypeScript, and Tailwind CSS. Existing browser-storage keys containing the original starter name have been retained temporarily to avoid unexpectedly losing data saved in an existing browser. They are internal identifiers, not customer-facing branding.

## Run locally

Requirements: Node.js compatible with the installed Next.js version.

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

To create a production build:

```bash
npm run build
```

## Project notes

- `app/` contains the Next.js routes and global styles.
- `components/` contains shared layout, product, shop, cart, and admin components.
- `data/products.json` contains the demonstration catalogue.
- `context/CartContext.tsx` manages the shopping cart state.

The current admin login, product persistence, contact form, and checkout flow still require production-grade authentication, persistent storage, real message delivery, and a confirmed order/payment integration before a live launch.

## Starter template attribution

This project began from a ThemeWagon/Bloomtpl starter. Review and retain the original license and attribution requirements when distributing the finished client project.


## NOIR Urban Wear — Shop redesign milestone

The shop page now uses the NOIR light-editorial design direction: warm off-white surfaces, black campaign banner, spacious catalogue layout, refined filters, KSh pricing, and responsive product cards. The catalogue remains demonstration data and is labelled as such.

Existing browser storage keys (`bloom_custom_products`, `bloom_custom_categories`, and the admin session key) have intentionally been preserved for compatibility with the current admin and product workflows. Do not rename these keys without migrating the data and updating every reader/writer.

Product ratings are not shown on the redesigned product cards because the current catalogue is sample content and should not imply verified customer reviews.


## NOIR Urban Wear — Product detail redesign milestone

The product detail route (`app/product/[productId]/page.tsx`) has been redesigned in the NOIR light-editorial direction. It includes a large image gallery, product information, KSh pricing, sample size and colour selectors, quantity controls, add-to-bag and buy-now actions, delivery/payment setup notes, and related products.

Size and colour options are explicitly demonstration placeholders and must be replaced with the client's real product variants. Selected options are stored with cart lines so different variants of the same product can be represented separately. The existing `cart` browser-storage key and legacy product storage key are retained.

## NOIR shopping bag redesign (V1)

The shopping cart page has been redesigned in the NOIR light-editorial visual direction:
- Off-white canvas, black editorial typography and minimal dividers.
- Responsive product rows with product image, selected size/colour, quantity controls and line totals.
- Remove-item and clear-bag actions retained through the existing cart context.
- Order summary and checkout link retained.
- Empty-bag state redesigned to match NOIR.
- Delivery and payment messaging is clearly marked as demonstration configuration pending confirmation by the store owner.

The cart continues to use the existing `cart` localStorage key and the existing cart context API. This update does not add a payment gateway, shipping calculator, inventory validation or server-side order processing.

## Current validation note

The ZIP archive can be checked independently, but a full Next.js build has not been run in this environment because dependency installation did not complete. Run `npm ci` and `npm run build` locally before presenting or deploying this version.


## NOIR checkout redesign (V1)

The checkout route now follows the Kenyan storefront brief and the NOIR light-editorial visual system. It captures customer contact details, a Kenyan phone number, county, town/city, estate/area, optional building or landmark, and delivery instructions. The county selector includes all 47 Kenyan counties. Customers can preview M-PESA or pay-on-delivery preferences.

Payment choices are visual/demo selections only: there is no M-PESA STK push, card processing, payment collection, live order submission, shipping-rate calculation, or fulfilment integration. Completing the form creates a temporary in-page sample confirmation and clears the browser cart, matching the existing demonstration flow. The confirmation explicitly states that the order is not real. Delivery pricing is shown as pending store confirmation rather than promising free delivery.

Before launch, connect a secure server-side order API, configure and test a payment provider, confirm delivery fees and coverage, add privacy/consent handling, and implement server-side validation and order persistence.


## NOIR Admin Dashboard (demonstration)

The `/admin` route now contains a NOIR-branded management dashboard with Overview, Products, Orders, Categories, and Store Settings sections. The existing product-creation workflow has moved to `/admin/products/new`.

### Current demonstration behaviour

- Bundled sample products are read from `data/products.json`.
- Products added through the admin product form are stored in browser `localStorage` under the existing `bloom_custom_products` key.
- Custom categories are stored under the existing `bloom_custom_categories` key.
- The dashboard can list products, remove products added in the current browser, and add/remove custom categories.
- The Orders section intentionally shows an integration-pending state. The current checkout does not persist orders to a shared store or send them to an administrator.
- Revenue, live inventory, payment processing, and customer order management are not connected.

### Production requirements

This dashboard is a front-end demonstration, not a production admin system. The current sign-in check is client-side and accepts any email with a password of at least four characters. Before launch, replace it with server-side authentication and authorization, a shared database, secure image storage, order persistence, stock management, and a payment integration such as the client's confirmed M-PESA provider. Do not use the demo sign-in or browser storage to protect real customer or business data.
