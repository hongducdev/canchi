# Can Chi 1.1.0 Rebrand Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Ship Can Chi v1.1.0 — full rebrand, calendar launcher icons (Android day aliases), About author + update check from GitHub Releases.

**Architecture:** String/config rename across app + native; generate calendar PNG icons (static + days 1–30); Android activity-aliases + small RN bridge to toggle alias; `src/lib/appUpdate.ts` + Settings/root wiring.

**Tech Stack:** Expo 56, React Native, Android activity-alias, GitHub Releases API, Pillow for icon generation.

**Spec:** `docs/superpowers/specs/2026-07-10-can-chi-rebrand-design.md`

---

### Task 1: Version bump + release notes

**Files:** `package.json`, `app.json`, `android/app/build.gradle`, `docs/releases/v1.1.0.md`

- [x] Set version `1.1.0`, Android `versionCode` 2
- [x] Write `docs/releases/v1.1.0.md`

### Task 2: User-facing rename to Can Chi

**Files:** TodayHero, WebSidebar, settings About (partial), strings.xml, settings.gradle, app.json widget labels, AndroidManifest widget labels, notifications, README, docs/vi.md, LICENSE if needed, types/colors comments

- [x] Replace product name Lịch Âm → Can Chi (not storage keys / deep links)

### Task 3: About UI + author + update module

**Files:** Create `src/lib/appUpdate.ts`, modify `settings.tsx`, `app/_layout.tsx`

- [x] Implement fetch/compare/dialog helpers
- [x] About copy per spec + author link + manual check
- [x] Auto-check on launch (1×/day)

### Task 4: Generate calendar icons

**Files:** `scripts/generate-app-icons.py`, `assets/*`, `android/.../mipmap-*/ic_launcher_day_*`

- [x] Pillow script: vermillion header “Can Chi” + large day number
- [x] Write assets + day 01–30 mipmaps (xxxhdpi at minimum; copy to densities as needed)

### Task 5: Android activity-alias + JS bridge

**Files:** AndroidManifest.xml, `LauncherIconModule.kt` + package, MainApplication registration, `src/lib/launcherIcon.ts`

- [x] Aliases LauncherDay01–30; default enabled for current pattern
- [x] `setLunarDayIcon(day)` from JS on launch

### Task 6: Verify

- [x] `npm run typecheck`
- [x] Spot-check branding strings
