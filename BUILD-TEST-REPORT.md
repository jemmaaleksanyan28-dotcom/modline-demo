# Build/Test Report

This package was prepared as a Vercel demo build.

## What changed for Vercel demo

- Removed SQLite runtime dependency from demo auth routes.
- Demo login now works without file/database storage:
  - `admin@modline.local` / `admin123`
  - `user@modline.local` / `user123456`
- Admin/User/Profile pages use demo API responses.
- Product/order storage falls back to in-memory data on Vercel serverless runtime.
- Real local WebP images are used for hero, category cards, banners, and product samples.
- `vercel.json` forces Vercel to install/build using npm for fewer lockfile/native dependency issues.

## Checks run in this environment

The environment cannot reach `registry.npmjs.org`, so full dependency install and `pnpm build` could not be executed here.

Static checks completed:

- JSON files parsed successfully.
- TS/TSX files transpile-syntax checked successfully.
- No `legacyBehavior` / `passHref` remains.
- No SQLite/`better-sqlite3` route imports remain.
- All referenced local image paths exist.

## How to test locally

```bash
npm install
npm run build
npm run dev
```

Or with pnpm:

```bash
pnpm install
pnpm build
pnpm dev
```

## Vercel paths to show

```text
/fa
/fa/auth/login
/fa/admin
/fa/admin/products
/fa/admin/orders
/fa/admin/users
/fa/profile
/fa/profile/orders
/fa/profile/addresses
```
