# 📚 Diwan Bookstore

<div align="center">

![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

**A full-stack e-commerce bookstore. Browse, shop, and manage books with a complete admin dashboard.**

[Features](#-features) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [API](#-api-overview)

</div>

---

## ✨ Features

### 🛍️ Customer
- Browse and search books with filters (author, category, price, sort)
- Book detail pages with full info and cover images
- Shopping cart with real-time updates and free shipping threshold
- Two-step checkout (shipping → payment) with Cash on Delivery & Card
- Order history with full details, timeline, and shipping info
- Star-rating reviews with the ability to delete your own
- User profile editing (personal info + billing address)

### 🔐 Authentication
- Register & Login with JWT (access + refresh tokens)
- Email verification on signup
- Forgot Password / Reset Password via email link
- Change password while logged in
- Auth interceptor auto-attaches tokens to all requests
- Session hydrated on page reload

### 🛠️ Admin Dashboard
- **Books** — Full CRUD with cover image upload, author & category linking, search & filters
- **Categories** — Add, edit, delete with pagination
- **Authors** — Manage author records
- **Orders** — View all orders, filter by status/payment/date, update statuses with enforced transitions, view order history timeline

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Angular 17+ (Standalone Components) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| State Management | Angular Signals + RxJS |
| HTTP | Angular HttpClient + Interceptors |
| Backend | Node.js / Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh Tokens) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `18+`
- npm `9+`
- Angular CLI `17+`
- Backend API running on `http://localhost:3000`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Mostafa-Khalifaa/diwan-frontend.git
cd diwan-frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
ng serve
```

Open your browser at **http://localhost:4200**

> ⚠️ Make sure the backend server is running before starting the frontend.

### Build for Production

```bash
ng build --configuration production
```

---

## ⚙️ Environment Configuration

Edit `src/environments/environment.ts` to point to your API:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── features/
│   │   │   ├── admin/
│   │   │   │   ├── admin-panel/      # Sidebar layout
│   │   │   │   ├── books/            # Books CRUD
│   │   │   │   ├── categories/       # Categories CRUD
│   │   │   │   ├── authors/          # Authors management
│   │   │   │   ├── orders/           # Orders management
│   │   │   │   └── dashboard/        # Admin dashboard
│   │   │   ├── auth/
│   │   │   │   ├── profile/
│   │   │   │   ├── verify/
│   │   │   │   ├── change-password/
│   │   │   │   ├── forget-password/
│   │   │   │   └── reset-password/
│   │   │   └── not-found/            # 404 page
│   │   ├── guards/                   # Route guards
│   │   ├── interceptors/             # Auth interceptor
│   │   ├── services/                 # All API services
│   │   └── types/                    # TypeScript interfaces
│   │
│   ├── features/
│   │   ├── home/                     # Landing page
│   │   ├── auth/                     # Login & Register
│   │   ├── books/                    # Book listing & detail + reviews
│   │   ├── cart/                     # Shopping cart
│   │   ├── checkout/                 # Checkout flow
│   │   └── orders/                   # My orders (customer)
│   │
│   └── shared/
│       └── components/
│           ├── navbar/
│           └── footer/
│
└── environments/
```

---

## 🗺️ Routing

| Route | Page | Guard |
|---|---|---|
| `/` | Home | — |
| `/books` | Book catalog | — |
| `/books/:id` | Book detail | — |
| `/login` | Login | `guestGuard` |
| `/register` | Register | `guestGuard` |
| `/verify-email` | Email verification | `guestGuard` |
| `/forget-password` | Forgot password | `guestGuard` |
| `/reset-password` | Reset password | `guestGuard` |
| `/profile` | User profile | `authGuard` |
| `/change-password` | Change password | `authGuard` |
| `/cart` | Shopping cart | — |
| `/checkout` | Checkout | — |
| `/orders` | My orders | — |
| `/admin` | Admin panel | `isAdminGuard` |
| `/admin/dashboard` | Dashboard | `isAdminGuard` |
| `/admin/books` | Books management | `isAdminGuard` |
| `/admin/authors` | Authors management | `isAdminGuard` |
| `/admin/categories` | Categories management | `isAdminGuard` |
| `/admin/orders` | Orders management | `isAdminGuard` |
| `**` | 404 Not Found | — |

---

## 🔌 API Overview

All requests go to `environment.apiUrl` (default: `http://localhost:3000`).

The `authInterceptor` automatically adds `Authorization: Bearer <token>` to every request.

| Service | Endpoint | Description |
|---|---|---|
| Auth | `/auth/*` | Login, register, verify, refresh, logout |
| Profile | `/profile` | Get & update user profile |
| Books | `/books` | CRUD + search/filter/sort |
| Authors | `/authors` | List & manage authors |
| Categories | `/categories` | CRUD |
| Cart | `/cart` | Cart management |
| Orders | `/order` | Place & track orders |
| Reviews | `/reviews` | Add, list, delete reviews |

---

## 🔒 Guards

| Guard | Description |
|---|---|
| `authGuard` | Blocks unauthenticated users, redirects to `/login?returnUrl=...` |
| `guestGuard` | Blocks logged-in users from auth pages, redirects to `/` |
| `isAdminGuard` | Blocks non-admin users from the admin panel, redirects to `/` |

---

## 📦 Order Status Flow

```
placed ──▶ processing ──▶ shipped ──▶ delivered
               │
               └──▶ cancelled
```

**Payment transitions:**
```
pending ──▶ paid ──▶ refunded
        └──▶ failed
```

---

## 👥 Team

This project was built as a team effort. Contributions span across backend and frontend modules including auth, books, categories, authors, reviews, orders, cart, and admin panel.

---

## 📄 License

This project is for educational purposes.
