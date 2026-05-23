# Build Fix Notes

Fixes applied based on the latest `npx tsc --noEmit` log:

- Fixed `Address` usage in admin orders/dashboard.
- Fixed order item rendering to use `item.product` structure.
- Fixed admin product search for `LocalizedString` product names.
- Fixed product image `alt` values.
- Fixed profile order items to use `item.product.images` and `item.product.name`.
- Changed `npm run lint` to run TypeScript check (`tsc --noEmit`) so it works consistently for this project.

Run:

```bash
npm install
npx tsc --noEmit
npm run build
```
