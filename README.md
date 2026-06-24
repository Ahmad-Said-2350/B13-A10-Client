# RecipeHub — Client

A modern recipe-sharing platform where home cooks and food lovers discover recipes, save favorites, and share their own creations with the community.

Built for clarity — real recipes, honest engagement, clean experience.

---

## Overview

RecipeHub connects recipe creators with a community of food enthusiasts. Browse curated and popular recipes, like and favorite dishes, purchase premium recipes, and manage your own collection from a protected dashboard. Authentication is handled by BetterAuth; protected API calls use an Express JWT cookie.

**Live Site:** `https://b13-a10-client.vercel.app`  
**Server Repo:** `https://github.com/Ahmad-Said-2350/B13-A10-Server`  
**Live API:** `https://b13-a10-server.vercel.app`

---

## What's Inside

### Public

| Page | Description |
|------|-------------|
| **Home** | Hero banner with motion, featured recipes, popular recipes, and how-it-works section |
| **Browse Recipes** | 3-column grid with search, category filters, and pagination |
| **Recipe Details** | Full recipe view with image, ingredients, instructions, like, favorite, report, and purchase |
| **Login / Register** | Email/password + Google OAuth; registration with optional profile photo URL |

### Private (Dashboard)

| Page | Description |
|------|-------------|
| **Overview** | User stats — recipes, favorites, likes — and premium upgrade |
| **Add Recipe** | Create recipes with Cloudinary image upload from PC or phone |
| **My Recipes** | Manage recipes you have posted |
| **Favorites** | Saved recipes with view details and remove |
| **Purchased** | Recipes bought via Stripe checkout |
| **Profile** | Update name and profile image (Cloudinary upload) |

### Admin

| Page | Description |
|------|-------------|
| **Overview** | Platform stats |
| **Manage Users** | View and block users |
| **Manage Recipes** | Edit, delete, and feature recipes |
| **Reports** | Review and resolve user reports |
| **Transactions** | Payment history |

### Auth & Security

- BetterAuth session for login state
- Express JWT issued after login (`/auth/jwt`) — HTTPOnly cookie
- `proxy.js` protects `/dashboard/*` and `/payment/*`
- Protected API calls send `X-Requested-With` header (blocks direct browser URL access to API)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | App Router, server + client components |
| BetterAuth | Email/password + Google OAuth |
| MongoDB | Auth user data (BetterAuth adapter) |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Home banner animations |
| Cloudinary | Profile and recipe image hosting |
| React Icons | Icons across the UI |

---

## Color Palette

| Role | Token |
|------|-------|
| Brand | `--brand` (green accent) |
| Background | `--bg-page`, `--bg-surface`, `--bg-card` |
| Text | `--text-primary`, `--text-secondary`, `--text-muted` |
| Status | `--success`, `--danger` |

Light and dark themes supported via `ThemeToggle` — preference persists in `localStorage`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Running RecipeHub Express server (`localhost:5000`)
- MongoDB Atlas database
- Cloudinary account
- Google OAuth credentials (optional)

### Install

```bash
git clone https://github.com/Ahmad-Said-2350/B13-A10-Client
cd recipehub-client
npm install
npm run dev

