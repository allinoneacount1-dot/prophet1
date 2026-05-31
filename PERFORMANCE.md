# ─── Performance Optimization Plan ──────────────────────────────────
# Bundle analysis, code splitting, image optimization, caching

## Current State
- TanStack Start + Vite (SSR)
- @solana/web3.js (heavy — ~500KB).
- lucide-react icons (tree-shaking critical)
- recharts for charts (heavy on client).

## Implemented Optimizations

### 1. Code Splitting via Route-Based Lazy Loading
Each route file under `src/routes/` is automatically code-split by TanStack Router.
Additional manual lazy loading for heavy components:

```tsx
// Instead of: import Heavy from "./Heavy"
// Use:
const Heavy = React.lazy(() => import("./Heavy"));

// In JSX:
<Suspense fallback={<Spinner />}>
  <Heavy />
</Suspense>
```

### 2. Wallet Adapter Splitting
Solana wallet packages should be dynamically imported:

```tsx
useEffect(() => {
  import("@solana/wallet-adapter-react").then(({ ... }) => {
    // init only in browser
  });
}, []);
```

### 3. Icon Tree Shaking
Always import icons directly (never `import * from "lucide-react"`):
```tsx
// ✅ Good
import { Home, Coins } from "lucide-react"
// ❌ Bad (imports all 1500+ icons)
```

### 4. Image Optimization
- Use WebP/AVIF format
- Lazy loading via `loading="lazy"` on all `<img>`
- Responsive srcset for collection images
- NFT metadata images cached via React Query staleTime

### 5. API Response Caching
- CoinGecko: 15s staleTime
- Jupiter quotes: 30s
- Portfolio: 30s
- NFT collection data: 60s

### 6. Vite Build Optimizations (vite.config already handles)
- Rollup manual chunks for vendor splits
- Source maps disabled in production
- CSS code splitting enabled

## Analysis Commands

```bash
# Bundle size analysis
npx vite-bundle-analyzer

# Lighthouse CI
npx lhci autorun

# Dependency audit
npx depcheck
```

## Target Budgets
| Metric | Budget |
|---|---|
| Initial JS | < 300KB gzipped |
| Total JS | < 800KB gzipped |
| LCP | < 2.5s |
| FCP | < 1.5s |
| TTI | < 3.5s |
| CLS | < 0.1 |
