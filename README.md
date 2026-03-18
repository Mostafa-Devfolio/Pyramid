<h1 align="center">
  <br>
  <a href="http://prism.devfolio.net/"><img src="http://prism.devfolio.net/uploads/booking.png" alt="Prism" width="200"></a>
  <br>
  Prism | Multi-Vendor E-Commerce & Service Ecosystem
  <br>
</h1>

<h4 align="center">A highly scalable, enterprise-grade platform unifying retail, logistics, and accommodation bookings.</h4>

<p align="center">
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-core-features--functionality">Key Features</a> •
  <a href="#-architecture--state-management">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="http://prism.devfolio.net/">Live Demo</a>
</p>

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Strapi](https://img.shields.io/badge/strapi-%232E7EEA.svg?style=for-the-badge&logo=strapi&logoColor=white)

## 📖 About The Project

**Prism** transcends traditional e-commerce by offering a unified ecosystem. Built with a modern, type-safe Next.js frontend and a robust Strapi v5 headless CMS, it allows users to shop from dynamic business storefronts, request on-demand courier or taxi services, and book accommodations—all seamlessly integrated under one roof.

## 🚀 Tech Stack

* **Frontend:** Next.js (React), TypeScript, Tailwind CSS
* **Backend API & CMS:** Strapi v5
* **State Management:** Redux Toolkit, Context API, React Hooks
* **Payment Gateway:** Paymob
* **Internationalization:** `next-intl` (Server-side multi-language support)

---

## ✨ Core Features & Functionality

### 🛍️ Multi-Vendor E-Commerce
* **Dynamic Business Storefronts:** Scalable architecture supporting distinct vendor profiles and business categories.
* **Advanced Catalog Search:** Custom API integrations for high-performance, granular searching and filtering of extensive product catalogs.
* **Vendor & Inventory Management:** Full backend integration allowing vendors to manage their pricing, stock, and product details in real-time.
* **Role-Based Access Control (RBAC):** Secure, isolated authentication flows and dashboards for Customers, Vendors, and Platform Administrators.

### 💳 Checkout & Financials
* **Unified Payment Processing:** Deep integration with the **Paymob** gateway to handle secure, seamless transactions across retail products, logistics fees, and property reservations.

### 📦 Integrated Logistics & Delivery
* **On-Demand Taxi Booking:** A fully integrated transportation system allowing users to request fast and reliable rides.
* **Courier Services:** A built-in "deliver everything" parcel module for tracking and requesting courier logistics.
* *Note: Logistics modules are dynamically controlled via backend configurations, allowing for scalable deployment.*

### 🏨 Accommodation & Bookings
* **Property Discovery Engine:** Native backend API querying for finding hotels, rental spaces, and properties based on specific user criteria.
* **Real-Time Availability Tracking:** Synchronization with the Strapi backend to secure booking slots and prevent overlapping reservations.

### 🎨 UI/UX & Frontend Performance
* **Hybrid Rendering:** Leveraging Next.js Server-Side Rendering (SSR) and Static Site Generation (SSG) for optimal SEO and load speeds.
* **Fluid Animations:** Engaging user experience utilizing custom transitions, hover effects, and scroll animations (`animate-in`, `fade-in`, `slide-in`).
* **Adaptive Theming:** Deeply integrated Dark Mode adapting to user system preferences.
* **Asset Optimization:** Utilizing `next/image` for lazy loading, WebP delivery, and layout shift prevention.

---

## 🏗️ Architecture & State Management

Prism employs a highly modular and strictly typed architecture:
* **Hybrid State Management:** Global, complex state (like user sessions and shopping carts) is handled by **Redux Toolkit**, while localized component state utilizes the **Context API** and standard React Hooks (`useState`, `useEffect`).
* **Centralized API Services:** All RESTful interactions with the Strapi v5 endpoints are abstracted into a dedicated service layer (`@/services/ApiServices`), ensuring clean, maintainable, and reusable data fetching.
* **End-to-End Type Safety:** Strict TypeScript interfaces (e.g., `IBusiness`, `IBooking`) guarantee predictable data structures across the application.

---

## 🛠️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* Node.js (v18.17 or higher recommended)
* npm or yarn

### Installation

1. **Clone the repository**
   ```sh
   git clone [https://github.com/Mostafa-Devfolio/prism.git](https://github.com/Mostafa-Devfolio/prism.git)
Navigate to the project directory

Bash
cd prism
Install NPM packages

Bash
npm install
Configure Environment Variables
Create a .env.local file in the root directory and add your API keys and configuration variables:

Code snippet
NEXT_PUBLIC_API_URL=your_strapi_backend_url
NEXT_PUBLIC_PAYMOB_API_KEY=your_paymob_key
# Add other required variables
Run the development server

Bash
npm run dev
Open your browser
Navigate to http://localhost:3000 to see the application running.

📄 License
Distributed under the MIT License. See LICENSE for more information.

Developed with dedication by the Prism Team.