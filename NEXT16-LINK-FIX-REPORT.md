# Next.js 16 Link Fix Report

## Fixed

Console warning/error:

```text
legacyBehavior is deprecated and will be removed in a future release
```

The issue was in:

```text
components/layout/header.tsx
```

Old pattern:

```tsx
<Link href={`/${locale}/products?sale=true`} legacyBehavior passHref>
  <NavigationMenuLink>...</NavigationMenuLink>
</Link>
```

New Next.js 16-compatible pattern:

```tsx
<NavigationMenuLink asChild>
  <Link href={`/${locale}/products?sale=true`} className={cn(...)}>
    {t('sale')}
  </Link>
</NavigationMenuLink>
```

## Verification

Searched the whole project for deprecated Link props:

```bash
grep -R "legacyBehavior\|passHref" -n --include='*.tsx' --include='*.ts' .
```

Result: no remaining usages.

## Build note

A full `pnpm install` / `pnpm build` could not be executed in this environment because package installation tried to reach `registry.npmjs.org` and failed with DNS/network error:

```text
getaddrinfo EAI_AGAIN registry.npmjs.org
```

Run locally:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```
