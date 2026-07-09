# Expo Web App Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Polish Expo Web so core calendar + read-only tools work in the browser with a desktop sidebar and mobile tabs.

**Architecture:** Same Expo Router app; gate features with `Platform.OS === 'web'` and `useWebDesktop` (width ≥ 960). Root `WebShell` hosts sidebar + centered column; Settings/day/routes hide out-of-scope surfaces.

**Tech Stack:** Expo SDK 56, Expo Router, react-native-web, existing theme tokens.

**Spec:** `docs/superpowers/specs/2026-07-09-expo-web-app-design.md`

---

### Task 1: Web platform helpers

**Files:**
- Create: `src/hooks/useWebDesktop.ts`
- Create: `src/lib/platform.ts`
- Modify: `src/hooks/useHaptics.ts`

- [ ] Add `isWeb` / `WEB_DESKTOP_MIN_WIDTH = 960` and `useWebDesktop()`
- [ ] No-op haptics when `Platform.OS === 'web'`
- [ ] `npm run typecheck`

### Task 2: WebShell + sidebar

**Files:**
- Create: `src/components/WebSidebar.tsx`
- Create: `src/components/WebShell.tsx`
- Modify: `app/_layout.tsx`
- Modify: `app/(tabs)/_layout.tsx`
- Modify: `src/components/Screen.tsx`

- [ ] Sidebar: brand + 4 tab links; active state from pathname
- [ ] WebShell: row layout on desktop web; hide tab bar when desktop
- [ ] Screen: optional max-width centering on web (if not fully handled by shell)
- [ ] `npm run typecheck`

### Task 3: Gate out-of-scope web surfaces

**Files:**
- Modify: `app/(tabs)/settings.tsx`
- Modify: `app/day/[date].tsx`
- Modify: `app/family.tsx`
- Modify: `app/personal.tsx`

- [ ] Settings: web tools grid + hide haptics/notifications/data backup
- [ ] Day detail: hide notes block on web
- [ ] family/personal: `router.replace('/(tabs)/settings')` on web mount
- [ ] `npm run typecheck`

### Task 4: Scripts, README, verify

**Files:**
- Modify: `package.json`
- Modify: `README.md`

- [ ] Add `web` and `build:web` scripts
- [ ] Document web run/export
- [ ] `npm run typecheck`
- [ ] `npx expo export -p web` (or note failure)
- [ ] Commit when user asks (or after green verify if user already asked to implement)

---

## Manual check

1. `npx expo start --web` — desktop ≥960: sidebar, no tab bar
2. Narrow window: bottom tabs
3. Open search / lucky / fengshui / memorial / astronomy
4. `/family` and `/personal` redirect to settings
5. Day detail has no notes on web
6. Theme toggle works
