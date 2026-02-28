# 📚 Diwan Bookstore

<div align="center">

![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

**A full-stack e-commerce bookstore built with Angular & Node.js.**

Browse books, manage your cart, place orders, and write reviews — all in one place.

</div>

---

## ✨ Features

### 🛍️ Customer
- Browse and search books with filters (price, sort)
- Book detail pages with cover image and description
- Shopping cart with quantity controls and free shipping over $50
- Two-step checkout — shipping address then payment method
- Order history with full details and status timeline
- Star ratings and reviews on book pages

### 🔐 Auth
- Register & Login with JWT (access + refresh tokens)
- Email verification on signup
- Forgot password / Reset password via email
- Change password from profile

### 🛠️ Admin Dashboard
- **Books** — Full CRUD with image upload and filters
- **Authors** — Add and edit authors
- **Categories** — Add, edit, and delete categories
- **Orders** — View all orders, filter by status, and update order/payment status

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 17+ (Standalone Components) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| State | Angular Signals + RxJS |
| Backend | Node.js / Express |
| Database | MongoDB |
| Auth | JWT (Access + Refresh Tokens) |
| Rendering | CSR (Client-Side Rendering) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18+`
- Angular CLI `17+`
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/diwan-frontend.git
cd diwan-frontend

# Install dependencies
npm install

# Start dev server
ng serve
```

Open **http://localhost:4200**

### Build for Production
```bash
ng build --configuration production
```

---

## ⚙️ Environment

Edit `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

---

## 🗺️ Routes

| Route | Description | Guard |
|---|---|---|
| `/` | Home page | — |
| `/books` | Book catalog with filters | — |
| `/books/:id` | Book detail + reviews | — |
| `/login` | Login | Guest only |
| `/register` | Register | Guest only |
| `/verify-email` | Email verification | Guest only |
| `/forget-password` | Forgot password | Guest only |
| `/reset-password` | Reset password | Guest only |
| `/cart` | Shopping cart | — |
| `/checkout` | Checkout | — |
| `/orders` | My orders | Auth only |
| `/profile` | User profile | Auth only |
| `/change-password` | Change password | Auth only |
| `/admin` | Admin dashboard | Admin only |

---

## 📦 Order Status Flow

```
placed → processing → shipped → delivered
              ↓
           cancelled
```

```
pending → paid → refunded
       ↓
     failed
```

---

## 🔒 Guards

| Guard | Description |
|---|---|
| `authGuard` | Redirects unauthenticated users to `/login` |
| `guestGuard` | Redirects logged-in users away from auth pages |
| `isAdminGuard` | Restricts admin routes to admin users only |

---

## 👥 Team

| GitHub | Name |
|---|---|
| [@bieno12](https://github.com/bieno12) | Zeyad Shahin |
| [@Mostafa-Khalifaa](https://github.com/Mostafa-Khalifaa) | Mostafa Khalifa |
| [@menna7634](https://github.com/menna7634) | Menna Mohamed |
| [@Khaleddd11](https://github.com/Khaleddd11) | Khaled Cherif |

---

## 📄 License

This project is for educational purposes.
