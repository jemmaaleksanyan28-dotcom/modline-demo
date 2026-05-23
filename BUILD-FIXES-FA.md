# Build fixes

این نسخه برای خطاهایی که در لاگ build/type-check فرستاده شد اصلاح شده است:

- حذف import مشکل‌دار `@/lib/data/categories` از `components/home/category-grid.tsx`
- اصلاح `formatPrice`, `formatPriceShort`, `formatDate`, `getLocalizedString` تا `locale` رشته‌ای برگشتی از `useLocale()` را هم قبول کنند
- اصلاح `profile/wishlist/page.tsx` چون wishlist store فقط product id ذخیره می‌کند، نه آبجکت محصول کامل
- اصلاح `addToCart` در wishlist تا مطابق امضای cart store یعنی `(product, size, color, quantity)` صدا زده شود
- اصلاح ساخت JWT در `lib/auth.ts`

برای تست:

```bash
npm install
npx tsc --noEmit
npm run build
```
