# RecipeHub

## Live Site
[Add your Vercel URL here]

## Admin Credentials
- **Email:** admin@recipehub.com
- **Password:** Admin@123

> Create admin: Register normally, then in MongoDB Atlas set `role: "admin"` on that user document.

## Features
- Browse and discover recipes with category filter & pagination
- User authentication (Email/Password + Google via BetterAuth)
- Add, edit, delete own recipes (2 max free, unlimited premium)
- Like, favorite, and report recipes
- Premium membership via Stripe
- Admin dashboard (users, recipes, reports, transactions)
- Dark/Light theme toggle
- Server-side pagination
- JWT authentication with HTTPOnly cookies
- Framer Motion animation on home banner

## Tech Stack
- **Frontend:** Next.js 16, Tailwind CSS, BetterAuth, Framer Motion, Stripe
- **Backend:** Express.js, MongoDB Atlas, JWT, Stripe

## Setup

### Client
```bash
cd client
cp .env.example .env
# Fill in env values
npm install
npm run dev
```

### Server
```bash
cd server
cp .env.example .env
# Fill in env values
npm install
node seed-recipes.js   # optional: add 9 sample recipes
npm run dev
```

## GitHub Repos
- Client: [add link]
- Server: [add link]
