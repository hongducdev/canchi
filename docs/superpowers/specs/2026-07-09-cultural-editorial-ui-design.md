# Lịch Âm — Cultural Editorial UI Redesign

**Date:** 2026-07-09  
**Status:** Approved for planning  
**Direction:** Cultural editorial (Approach A)  
**Scope:** Full app visual pass — all tabs + day detail (Approach 1: token + component polish)  
**Out of scope:** Custom fonts, paper-grain assets, Reanimated motion packs, lunar engine / data / store changes, new features

## Goal

Make the existing Expo React Native app feel like a refined Vietnamese lunar calendar — warm paper surfaces, vermillion accents, flat editorial cards — without changing behavior or adding dependencies.

## Design read

Reading this as: **offline Vietnamese lunar calendar product UI** for everyday users, with a **cultural editorial** language, leaning toward **warm monochrome paper + vermillion seal accents** (not SaaS dashboard, not purple AI defaults).

## Visual system

### Palette (refine existing tokens in `src/theme/colors.ts`)

Keep ink / vermillion / gold / jade. Shift surfaces toward paper:

| Role | Light | Dark |
|------|-------|------|
| Background | Warmer bone `#F7F4EE` | Deep ink `#0B0F14` |
| Elevated / card | `#FFFFFF` | Ink elevated (`#121820` / `#1A2330`) |
| Border | Soft mist hairline | `rgba(255,255,255,0.08)` |
| Accent | Vermillion (today, CTA, section rule) | Soft vermillion |
| Gold | Festivals, tiết khí emphasis | Gold |
| Jade | Giờ Hoàng Đạo | Jade soft |

Accent is scarce: today state, primary actions, thin section rules — not large filled blocks.

### Surfaces

- Cards: hairline border, near-zero shadow (remove or heavily reduce elevation/shadowOpacity).
- Radius: prefer `8–12px` for chips/filters; cards stay `12–16px`. Avoid oversized pills as the default chrome.
- Backgrounds: no sterile flat gray; warm bone / deep ink only.

### Typography (system fonts for this pass)

| Role | Treatment |
|------|-----------|
| Solar day (hero) | Large, light weight, tight tracking |
| Lunar line | Medium/bold, clear secondary hierarchy |
| Section titles | Bold; thin vermillion accent rule beneath or beside |
| Meta labels | Small, muted, uppercase, wider tracking |
| Body | Off-black / mist, never pure `#000` on light |

No new font packages in this pass.

### Anti-patterns (do not introduce)

- Purple/indigo gradients, glassmorphism, neon glow
- Nested card-in-card stacks
- Dense pill/badge clusters
- Heavy drop shadows
- Generic Lucide-style icon overhaul (keep Ionicons already in use; restyle chrome only)

## Screen changes

### Shared components

| Component | Change |
|-----------|--------|
| `Card` | Flatter: hairline border, minimal/no shadow |
| `SectionHeader` | Title + thin vermillion accent rule; muted subtitle |
| `Chip` | Soft pastel wash; slightly less pill-like radius |
| `TodayHero` | Calmer dark ink hero; brand quiet; big solar day; fewer chips; clear CTA |
| `FestivalRow` | Clearer date column + name hierarchy; editorial spacing |
| `HourStrip` | Quieter muted tiles; jade/slate accent on hour name only |
| `MonthGrid` | Today = vermillion fill; selected = ink outline; festival = gold dot |
| `SettingRow` | Keep grouped list; hairline dividers; quieter labels |
| `Screen` | Inherit warmer `colors.bg`; padding rhythm unchanged unless needed |

### Home (`app/(tabs)/index.tsx`)

- Header: quiet uppercase greeting + “Hôm nay” title
- Hero: cultural calendar page feel (not dashboard widget)
- Can Chi: clean 2×2 meta grid inside flat card
- Hour strip + upcoming festivals: same structure, shared component polish

### Calendar (`app/(tabs)/calendar.tsx`)

- Quieter month nav (text + chevrons, less button chrome)
- Grid states as above
- Selected-day summary card matches Home card language

### Events (`app/(tabs)/events.tsx`)

- Filters: soft segmented chips — inactive = muted wash + secondary text; active = vermillion soft wash + accent text (not solid filled vermillion pills)
- Festival list uses polished `FestivalRow`

### Settings (`app/(tabs)/settings.tsx`)

- Grouped cells with hairline dividers; reduce nested-card heaviness
- Preserve all toggles and actions

### Day detail (`app/day/[date].tsx`)

- Top block mirrors Home hierarchy: solar → lunar → Can Chi
- Notes form: paper-surface inputs; practical layout unchanged

### Tab bar (`app/(tabs)/_layout.tsx`)

- Same four tabs; quieter inactive labels; vermillion active tint only
- No structural nav changes

## Architecture / data flow

Unchanged. UI reads from existing hooks/stores (`useTheme`, settings, notes) and `buildDayInfo` / festival helpers. No API, no new persistence.

## Error handling

No new error surfaces. Invalid day detail path keeps existing “Ngày không hợp lệ” state, restyled only if it uses shared tokens.

## Testing / verification

1. Manual visual pass: Home → Calendar → Events → Settings → Day detail
2. Toggle light / dark / system theme
3. Confirm interactions still work: month shift, day select, festival filter, settings toggles, notes add/delete
4. `npm run typecheck`

## Implementation order (for planning)

1. Theme tokens (`colors.ts`, `spacing.ts` if radius/type tweaks needed)
2. Shared primitives (`Card`, `SectionHeader`, `Chip`)
3. Feature components (`TodayHero`, `HourStrip`, `FestivalRow`, `MonthGrid`, `SettingRow`)
4. Screens + tab bar chrome
5. Typecheck + visual smoke

## Success criteria

- App feels culturally specific and editorial, not generic calendar template
- Light and dark both coherent
- No behavior regressions
- No new dependencies
