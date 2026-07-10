# Utilities Tab (Tiện ích)

**Date:** 2026-07-10  
**Status:** Approved for planning  
**Direction:** Approach 1 — new tab + move existing tools grid as-is  
**Scope:** Bottom navigation, Settings CÔNG CỤ section, web sidebar, back targets for personal/family  
**Out of scope:** ToolTile redesign, new tools, nested stacks, release notes, CLAUDE.md, tests

## Goal

Add a fifth bottom-nav tab **Tiện ích** that hosts the existing **CÔNG CỤ** `ToolTile` grid currently on Settings, so Settings is shorter and tools are one tap away from the main shell.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Tab order | Hôm nay → Lịch → **Tiện ích** → Lễ hội → Cài đặt |
| Layout | Keep 2-column `ToolTile` grid (same copy, icons, routes, web hide rules) |
| Implementation | New tab screen; no shared `ToolsGrid` extract; no nested stack |
| Tab icon | `apps-outline` |
| Profile back | Still `/(tabs)/settings` (Hồ sơ stays in Settings) |

## Navigation

### Mobile tabs (`app/(tabs)/_layout.tsx`)

Register `utilities` between `calendar` and `events`:

| Screen | Title | Icon |
|--------|-------|------|
| `index` | Hôm nay | `today-outline` |
| `calendar` | Lịch | `calendar-outline` |
| **`utilities`** | **Tiện ích** | **`apps-outline`** |
| `events` | Lễ hội | `sparkles-outline` |
| `settings` | Cài đặt | `settings-outline` |

Desktop web continues to hide the tab bar (`useWebDesktop`); sidebar carries the same order.

### Web sidebar (`src/components/WebSidebar.tsx`)

Extend `NavItem` href union with `'/(tabs)/utilities'`. Insert nav entry after Lịch, before Lễ hội. Match pathname via `includes('utilities')`.

## Screen: Tiện ích

**File:** `app/(tabs)/utilities.tsx`

- Use `Screen` + header pattern like other tabs (title **Tiện ích**, short subtitle e.g. “Công cụ lịch âm & phong tục”).
- Render the same `toolsGrid` + `ToolTile` list currently in Settings:
  - Tìm kiếm → `/search`
  - Ngày tốt → `/lucky`
  - Sự kiện cá nhân → `/personal` (hidden on web)
  - Phong thủy → `/fengshui`
  - Tính ngày lễ → `/memorial`
  - Gia đình → `/family` (hidden on web)
  - Thiên văn → `/astronomy`
  - Văn khấn → `/van-khan`
- Dynamic subtitles for personal-event / family counts unchanged.
- Styles for `toolsGrid` move with the screen (or duplicate the small StyleSheet block); do not leave dead styles in Settings.

## Settings cleanup

**File:** `app/(tabs)/settings.tsx`

- Remove the **CÔNG CỤ** label, `toolsGrid` block, and unused imports (`ToolTile`, and any store selectors only used for tool subtitles if no longer needed on this screen).
- Keep Hồ sơ, Giao diện, Sao lưu, Thông báo, Về ứng dụng, etc. unchanged.

## Back navigation

| Screen | Current | New |
|--------|---------|-----|
| `app/personal.tsx` | `/(tabs)/settings` | `/(tabs)/utilities` |
| `app/family.tsx` | `/(tabs)/settings` | `/(tabs)/utilities` |
| `app/profile.tsx` | `/(tabs)/settings` | unchanged |

Other tool routes keep default stack back behavior.

## Non-goals

- No version bump or release doc in this change.
- No widget / deep-link updates (none currently point at Settings tools).
- No extraction of a shared tools component unless a later change needs reuse.

## Success criteria

1. Five tabs on mobile in the locked order; Tiện ích shows the full tools grid.
2. Settings no longer lists tools; scroll length is noticeably shorter.
3. Web desktop sidebar includes Tiện ích in the same order.
4. Closing personal/family returns to Tiện ích; profile still returns to Cài đặt.
5. Existing tool routes and web hide rules still work.
