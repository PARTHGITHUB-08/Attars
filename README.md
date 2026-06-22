# Attars — The Soul of Pure Fragrance

Attars is a premium, handcrafted natural fragrance storefront built on traditional Indian heritage and the ancient **Deg-Bhapka** steam distillation technique. This project contains a fully custom, high-fidelity responsive storefront along with an administrative portal.

---

## Key Features

### 🌟 Brand Styling & Premium Aesthetics
*   **Warm Linen Theme**: Re-styled body background (`#F5EFE4`) and border surfaces to create a warm, luxurious, heritage parchment aesthetic that compliments gold typography and dark charcoal text.
*   **Elegantly Centered Legacy View**: Realigned the storytelling section to focus entirely on the craftsmanship narrative with a centered maximum-width layout.

### 🛒 Smooth Cart Panel Drawer
*   **Interactive Sidebar**: Sliding panel drawer built with smooth `framer-motion` physics that opens automatically when items are added.
*   **Bag Controls**: Edit item quantities, delete selections, and track subtotal/wrapping costs dynamically.
*   **COD Checkout**: Multi-step checkout form capturing recipient details and rendering a post-purchase printable invoice summary.

### 🔍 Photo Filtering Logic
*   **Client & Server Constraints**: Non-admin storefront queries automatically hide products that do not contain a valid photo, preventing broken image placeholders. The admin panel continues to show all items to allow photos to be added.

### 🔑 Administrative Control & Shortcut
*   **Ctrl+A Bypassed Access**: Pressing `Ctrl+A` anywhere on the site automatically logs in the administrator (saving credentials to `localStorage`) and redirects them to the admin panel. No key prompts required.

### 🧾 Invoice Billing Generator
*   **Live Stationery Invoice Creator**: A dedicated billing tab in the admin dashboard allows managers to input client information, select fragrances from the active catalog, apply discounts, and generate a beautiful GST-compliant Tax Invoice (9% CGST + 9% SGST).
*   **Clean Print System**: Print button triggers standard `window.print()` rendering a print stylesheet that formats *only* the vintage receipt sheet (hiding the rest of the browser dashboard).
*   **Registry Log**: Stores session invoices with single-click edit/reprint or deletion options.

---

## Tech Stack
*   **Frontend**: React (Vite, React Router DOM, Framer Motion, Lucide Icons, TailwindCSS).
*   **Backend**: Node.js (Express, Mongoose MongoDB).

---

## Local Setup & Run Commands

### 1. Backend Server
Navigate to the backend directory, install packages, and start the development server:
```bash
cd attars_structure/attars/backend
npm install
npm run dev
```
*Note: If local MongoDB is not running, the server automatically defaults to a secure in-memory mock database.*

### 2. Storefront App
Navigate to the frontend directory, install packages, and launch Vite dev server:
```bash
cd attars_structure/attars/frontend
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) to browse the shop storefront.
