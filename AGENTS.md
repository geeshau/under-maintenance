# System Maintenance — Landing Page

React 19 + Vite 6 + Tailwind CSS v4 single-viewport maintenance landing page.

## Commands

- Install: `npm install`
- Dev server: `npm run dev` (port 3000, host 0.0.0.0)
- Build: `npm run build`
- Preview: `npm run preview`
- Type-check/lint: `npm run lint` (runs `tsc --noEmit`; note `npx` is blocked by PowerShell execution policy — invoke `node node_modules/typescript/bin/tsc --noEmit` directly)

## Architecture

- `src/App.tsx` — single-viewport layout (header, banner, countdown, stepper, footer); root uses `h-dvh overflow-hidden`.
- `src/data.ts` — all user-facing copy, dates, upgrade stages, log entries. Edit here for content changes.
- `src/theme.ts` — accent colour tokens and status styles.
- `src/index.css` — Tailwind v4 theme, keyframes, base styles.
- `src/components/CountdownDisplay.tsx` — countdown card.
- `src/components/UpgradeProgress.tsx` — horizontal stepper.

## Conventions

- Path alias `@/*` maps to project root (`.`), not `src/`. Import as `@/src/...`? No — alias resolves to root, so `@/src/foo` or relative `./`. Check `tsconfig.json` `paths`.
- Tailwind v4 via `@tailwindcss/vite` plugin; no `tailwind.config.js`. Theme tokens defined in CSS.
- Single viewport: no page-level scroll. Spacing uses `dvh`/`clamp()` with height-based tiers.
- TypeScript `noEmit`; type-check only. `allowImportingTsExtensions` enabled.
- `motion` (Framer Motion) used for animations; `canvas-confetti` for celebration.

## Pitfalls

- PowerShell blocks `npx` scripts; use `node node_modules/...` directly (see memory).
- `vite preview` serves stale `dist/`; rebuild before previewing.
- HMR disabled when `DISABLE_HMR=true` env var set.