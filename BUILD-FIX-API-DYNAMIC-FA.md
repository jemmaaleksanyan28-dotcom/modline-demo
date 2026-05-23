# Build fix: Failed to collect page data for /api/admin/products

علت اصلی این خطا در Next.js 16 این بود که route handler ادمین در زمان build به عنوان route قابل static analysis دیده می‌شد. چون این route به cookie/auth و فایل‌سیستم (`data/products.json`) وابسته است، نباید در build pre-render/collect شود.

اصلاحات انجام‌شده:

1. برای همه route handlerهای `app/api/**/route.ts` این مقدار اضافه شد:

```ts
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
```

2. خطای احتمالی `JWT_SECRET is required in production` از سطح import/module حذف شد تا build با import کردن API routeها شکست نخورد. secret هنوز هنگام runtime auth در production لازم است.

برای production حتماً در `.env.local` یا محیط سرور مقدار زیر را بگذار:

```env
JWT_SECRET=یک-رشته-خیلی-طولانی-و-تصادفی
```

تولید secret با Node:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

بعد تست:

```bash
pnpm build
pnpm dev
```
