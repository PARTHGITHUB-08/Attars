# Saurabh — The Soul of Pure Fragrance

Premium traditional Indian fragrance storefront built on the ancient **Deg-Bhapka** steam distillation technique. Full-stack React + Node.js e-commerce platform with secure admin panel, invoice generation, and product management.

---

## Security

This version replaces the previous `Ctrl+A` backdoor with a proper JWT authentication system:

- **Passwords** hashed with bcrypt (12 rounds) — never stored in plain text
- **Sessions** stored in HTTP-only cookies (not localStorage) — immune to XSS
- **All admin endpoints** protected by JWT middleware
- **Rate limiting** on login (10 attempts/15 min) and forgot-password (5/hour)
- **Helmet.js** security headers on all responses
- **CORS** restricted to configured frontend origin

---

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + Mongoose (MongoDB)
- **Auth**: JWT (HTTP-only cookies) + bcryptjs
- **Security**: Helmet, express-rate-limit, cookie-parser

---

## Local Setup

### 1. Backend

```bash
cd saurabh_structure/saurabh/backend
npm install
cp .env.example .env        # fill in your values
npm run dev
```

Default admin credentials (first run, if no DB record exists):
- **Username**: `admin`
- **Password**: `Saurabh@2026!` (set `ADMIN_PASSWORD` in `.env` to change)

### 2. Frontend

```bash
cd saurabh_structure/saurabh/frontend
npm install
npm run dev
```

Open **http://localhost:5173** for the storefront.  
Admin panel: **http://localhost:5173/admin**

---

## Admin Dashboard

The admin panel (`/admin`) includes:

| Tab | Features |
|-----|----------|
| **Dashboard** | Revenue charts, KPI cards, category breakdown, top products, 7-day activity |
| **Products** | Full CRUD — create, edit, delete, image URL, stock, featured toggle |
| **Reviews** | Approve/reject testimonials before they appear on the storefront |
| **Subscribers** | View & manage newsletter signups, CSV export |
| **Invoice Generator** | GST-compliant (CGST 9% + SGST 9%) printable tax invoices, registry log |
| **Security Settings** | Change admin username/password; forgot-password OTP flow |

---

## API Reference

```
POST   /api/admin/login              Login (rate-limited)
POST   /api/admin/logout             Clear session cookie
GET    /api/admin/me                 Verify current session
PUT    /api/admin/credentials        Change credentials (auth required)
GET    /api/admin/dashboard          Aggregated stats (auth required)
POST   /api/admin/forgot-password    Request OTP reset
POST   /api/admin/reset-password     Reset with OTP

GET    /api/products                 List products (public)
POST   /api/products                 Create product (auth required)
PUT    /api/products/:id             Update product (auth required)
DELETE /api/products/:id             Delete product (auth required)

GET    /api/testimonials             Approved reviews (public)
GET    /api/testimonials/admin       All reviews (auth required)
PUT    /api/testimonials/:id         Approve/reject (auth required)
DELETE /api/testimonials/:id         Delete (auth required)

POST   /api/newsletter/subscribe     Subscribe (public)
GET    /api/newsletter/subscribers   List subscribers (auth required)
DELETE /api/newsletter/subscribers/:id  Remove (auth required)

GET    /api/invoices                 List invoices (auth required)
POST   /api/invoices                 Create invoice (auth required)
GET    /api/invoices/:id             Track by ID (public)
PUT    /api/invoices/:id/mark-paid   Mark paid (auth required)
DELETE /api/invoices/:id             Delete (auth required)
```

---

## Payment

**Cash on Delivery (COD) only** — no payment gateway integrated by design.
