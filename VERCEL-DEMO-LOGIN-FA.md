# نسخه دمو Vercel

این نسخه مخصوص نمایش به مشتری است و بدون SQLite کار می‌کند.

## اکانت‌های دمو

ادمین:

```text
admin@modline.local
admin123
```

کاربر:

```text
user@modline.local
user123456
```

## مسیرهای مهم

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

## نکته فنی

در Vercel، تغییرات محصولات/سفارش‌ها برای نمایش دمو در حافظه سرور انجام می‌شود و دائمی نیست. برای نسخه واقعی باید PostgreSQL/Supabase/Neon وصل شود.

برای دمو نیازی به ENV نیست، اما برای امنیت بهتر می‌توانی این را در Vercel ست کنی:

```env
JWT_SECRET=یک-رشته-طولانی-تصادفی
AUTH_COOKIE_SECURE=true
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```
