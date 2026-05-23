# Login Fix Notes

This package fixes the local login issue for both `pnpm dev` and `pnpm start`.

## Why login looked broken

When running `pnpm start`, Next.js runs with `NODE_ENV=production`. The old auth cookie used `secure: true` in production, so the browser ignored the cookie on local `http://localhost:3000`. Login could return success, but `/fa/admin` or `/fa/profile` redirected back to login because the cookie was not stored.

## Local test accounts

Admin:

```txt
admin@modline.local
admin123
```

User:

```txt
user@modline.local
user123456
```

## Local commands

```bash
pnpm install
pnpm db:init
pnpm build
pnpm start
```

Open:

```txt
http://localhost:3000/fa/auth/login
```

After direct login:

- Admin redirects to `/fa/admin`
- User redirects to `/fa/profile`

## Production note

Before real deployment, change `.env.local` / server environment:

```env
JWT_SECRET=use-a-long-random-secret
NEXT_PUBLIC_SITE_URL=https://your-domain.ir
AUTH_COOKIE_SECURE=true
SEED_DEFAULT_USERS=false
```

Do not keep starter accounts enabled on a real public website.
