
## System Maintenance — Landing Page

A minimalist, Google-inspired landing page shown while the platform undergoes
scheduled maintenance. Built with React 19, Vite and Tailwind CSS v4.

### Features

- **Google-style design system** — brand palette, Rubik typography, soft
  elevation shadows and the signature blue underline on nav links.
- **Single-viewport layout** — the whole page fits in `100dvh` with no
  page-level scrolling at any breakpoint, from 320 px phones to ultrawide
  desktops. Vertical rhythm is driven by `dvh`/`clamp()` so the layout
  rescales with the viewport instead of overflowing.
- **Live countdown** to the end of the maintenance window, with a celebratory
  confetti burst when the system comes back online.
- **Upgrade stepper** that fills in real time as the pipeline advances.
- **Status log modal** with the full maintenance pipeline.
- **Fully responsive** — from small phones through to mid-size tablets and
  wide desktop.

### Project structure

```
src/
├── App.tsx                  # Single-viewport layout, header, banner, footer
├── data.ts                  # All copy, dates, upgrade stages and log entries
├── theme.ts                 # Accent colour tokens and status styles
├── index.css                # Tailwind theme, keyframes and base styles
└── components/
    ├── CountdownDisplay.tsx # Countdown card (digits, progress bar, completion)
    └── UpgradeProgress.tsx  # Compact horizontal upgrade stepper
```

### Customising

Everything user-facing lives in `src/data.ts`:

| Field | Purpose |
| --- | --- |
| `maintenanceConfig.startDate` | When the maintenance window opened |
| `maintenanceConfig.targetDate` | When the system is expected back online |
| `maintenanceConfig.targetLabel` | Human-readable target date shown in the UI |
| `systemBannerConfig` | The yellow notice bar under the header |
| `statusMessage` | The hero headline and supporting copy |
| `upgradeStages` | The four pipeline stages shown in the stepper |
| `updateLogs` | The entries listed in the status log modal |
| `projectDetails` | Branding, version, support contact and website |

### Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
3. Build for production:
   `npm run build`
4. Type-check:
   `npm run lint`

### Changelog — Last 10 Features

Newest first.

| # | Feature | Commit | Details |
| --- | --- | --- | --- |
| 10 | **Rebrand to System Maintenance** | `d28b006` (current HEAD) | Swapped the multi-colour `STANDS` wordmark for a monochrome "System Maintenance" label + neutral wrench badge, updated title/meta description and favicon. |
| 9 | **Single-viewport layout** | `d28b006` | Root switched to `h-dvh overflow-hidden`; page-level scrolling removed. Rhythmic spacing driven by `dvh` + `clamp()` with height-based tiers for landscape phones. |
| 8 | **Compact upgrade stepper** | `d28b006` | Replaced the cartoon `AnimatedWorkers` SVG scene with a horizontal 4-segment `UpgradeProgress` tracker. |
| 7 | **Slim footer bar** | `d28b006` | Multi-column footer condensed to a single-line bar showing website, version, support email and back-online date. |
| 6 | **Sections trimmed down** | `d28b006` | Removed the live status block, "What's new" cards, and support section; kept only the countdown, stepper and status log. |
| 5 | **Responsive Google-style redesign** | `c522416` | Full redesign with Google brand palette, Rubik typography, multi-section layout, animated workers, and status log modal. |
| 4 | **Celebration confetti & banners** | `da4bdec` | Added confetti bursts on completion and a dismissible system banner. |
| 3 | **Absolute date ranges for countdown** | `6f79d0e` | Countdown now tracks `startDate`/`targetDate` directly for accurate progress. |
| 2 | **Maintenance log viewer & navbar variant** | `7e44de4` | Added the status log modal and a compact navbar variant of the countdown. |
| 1 | **Configuration extracted to data store** | `8332520` | Moved copy, dates and log entries to `src/data.ts` for easier customisation. |
