# Lịch Âm — Expo Web App (Core + Read-only Tools)

**Date:** 2026-07-09  
**Status:** Approved for planning  
**Direction:** Approach A — Polish Expo Web (same repo)  
**Feature scope:** Option 3 — Core calendar + read-only tools  
**Out of scope:** Family, personal events, notes, JSON backup, native notifications, marketing landing, home-screen widgets, Next.js rewrite

## Goal

Ship a usable **browser web app** for Lịch Âm on Expo SDK 56 + `react-native-web`, reusing the existing lunar engine and UI, with desktop/mobile web layout polish — without a separate frontend stack.

## Decisions (locked)

| Decision | Choice |
| --- | --- |
| Product type | Full web app (not marketing-only) |
| Feature depth | Core + read tools; no write/personal data surfaces on web |
| Stack | Expo Web in the same repo |
| Visual language | Existing ink / vermillion / paper tokens |

## In scope

### Core

- Tabs: Hôm nay, Lịch, Lễ hội, Cài đặt
- Day detail: solar/lunar, Can Chi, day zodiac, lore (Trực, Tú, hours, activities)
- Theme: light / dark / system
- Calendar settings that apply on web: week start, show lunar in grid, show festivals

### Read-only tools

- Search
- Lucky-day finder
- Feng shui (birth-year profile)
- Memorial calculator
- Astronomy catalog

### Ship

- Dev: `npm run web` → `expo start --web`
- Build: `npm run build:web` → `expo export -p web`
- README: run + static deploy notes

## Out of scope (explicit)

- Family roster, personal events, day notes, backup/restore
- Haptics controls and local notification scheduling UI on web
- Dedicated marketing landing / SEO content site
- PWA install campaign, service-worker caching strategy beyond Expo defaults
- Home-screen widgets (`expo-widgets`) — later phase
- Rewriting UI in Next.js / separate CSS design system

## Architecture

```
Expo Router (app/)
  ├── (tabs)          Home · Calendar · Events · Settings
  ├── day/[date]      Day detail (notes block hidden on web)
  ├── search|lucky|fengshui|memorial|astronomy
  └── family|personal → web redirect / “app only” gate

src/lib/*             Shared offline engine (unchanged contract)
src/components/*      Shared UI + web layout helpers
```

- **Single codebase.** Web is a platform target, not a fork.
- **Platform gates** via `Platform.OS === 'web'` (and width breakpoints), not duplicate route trees.
- **Data stores** for notes/family/personal may still hydrate on web but must not be reachable from primary navigation; routes are gated.

## Layout & navigation

### Breakpoint

- **&lt; 960px (mobile web):** Bottom tab bar unchanged (same four tabs).
- **≥ 960px (desktop web):**
  - Hide tab bar (`display: 'none'`).
  - Fixed left sidebar (~220px): brand + four nav items synced to tab routes.
  - Main column centered, content `maxWidth` ~720–800px.
  - Stack screens (day detail, tools) render in the main column; stack header keeps Back.

### Settings on web

**Show:** theme, week starts on, show lunar in grid, show festivals.  
**Hide:** haptics, reminder scheduling, test notification, backup/restore, Family / Personal event tiles.  
**Tools grid (web):** Search, Lucky day, Feng shui, Memorial, Astronomy only.

### Route gates

- `family`, `personal`: on web, redirect to Settings (or a small “Chỉ có trên ứng dụng” screen). Prefer redirect to keep URL noise low.
- Day detail: hide notes UI on web.

## Visual system

Reuse `src/theme/colors.ts` and existing cultural-editorial language:

- Warm paper / deep ink backgrounds
- Vermillion accent (scarce)
- Gold for festivals / tiết khí
- No new purple/SaaS gradient look; no separate web brand

Optional light polish only:

- Pointer cursor on pressables where RN-web supports it
- Subtle sidebar / tile hover if cheap with existing styles

## Technical plan (implementation constraints)

1. **Web shell**
   - Hook or helper: `useWebDesktop` = `Platform.OS === 'web' && width >= 960`
   - Sidebar component used from tabs layout (or root) when desktop web
   - `Screen` / content wrappers: max-width + horizontal center on web desktop

2. **Safe no-ops**
   - `useHaptics`: no-op on web
   - Notification helpers: already dynamic-import; ensure Settings never calls them on web (UI hidden)

3. **Export & docs**
   - `package.json` scripts: `web`, `build:web`
   - README section for web run/export/static host
   - Keep `app.json` `web.output: "single"` unless export requires a documented change

4. **Verification**
   - `npm run typecheck`
   - Manual: desktop sidebar; narrow viewport tabs; open each in-scope tool; family/personal gated; theme toggle; day detail without notes

## Non-goals for “done”

Web is **done** when in-scope screens work in Chrome (desktop + mobile width), typecheck passes, and static export builds — not when pixel-parity with every native gesture exists.

## Open follow-ups (after this phase)

- Marketing landing (Approach C lite)
- Full parity write surfaces on web (scope 1)
- Widgets on development builds
