# Settings Tools Grid

**Date:** 2026-07-09  
**Status:** Approved for planning  
**Direction:** Approach A — separate tiles, 2 per row  
**Scope:** Settings screen **CÔNG CỤ** section only  
**Out of scope:** Other Settings groups, navigation routes, new tools, custom icon fonts, motion libraries

## Goal

Replace the vertical `SettingRow` list under **CÔNG CỤ** with a 2-column grid of tappable tiles (icon + title + short description) so tools are easier to scan and feel more intentional than a flat settings list.

## Design read

Reading this as: **in-app utility launcher** inside an existing Vietnamese lunar calendar Settings screen, with the app’s **ink + vermillion / warm paper** tokens, leaning toward **compact editorial tiles** (not a dense dashboard, not icon-only app drawer).

## Layout

- Section label **CÔNG CỤ** stays as today.
- Remove the single wrapping `Card` + stacked `SettingRow`s for tools.
- Use a row-wrap container: `flexDirection: 'row'`, `flexWrap: 'wrap'`, `gap: space.sm` (8).
- Exactly **2 tiles per row**. Each tile takes half the row width accounting for gap (e.g. flex basis ~48% or equal flex children with `width` derived from parent).
- Seven tools → 4 rows; last row has one tile, **left-aligned** (not stretched full width).
- Shared `minHeight` on tiles so paired cells align.

## Component: `ToolTile`

**File:** `src/components/ToolTile.tsx`

| Prop | Type | Notes |
|------|------|--------|
| `title` | `string` | Primary label |
| `subtitle` | `string` | Short description, max 2 lines |
| `icon` | Ionicons glyph name | Outline style, consistent with tabs/screens |
| `onPress` | `() => void` | Same routes as current Settings rows |

**Structure (top → bottom):**

1. Icon chip — ~36×36, `borderRadius: radius.sm` (8), background `colors.accentSoft`, icon color `colors.accentText`, size ~20
2. Title — `font.md`, weight 600, `colors.text`, 1 line
3. Subtitle — `font.sm`, `colors.textMuted`, lineHeight ~18, `numberOfLines={2}`

**Chrome:** Reuse `Card` (or equivalent styles: `bgCard`, hairline `border`, `radius.lg`, padding `space.md`–`space.lg`). Press feedback: opacity ~0.7 like `SettingRow`.

**No new dependencies.** Use `@expo/vector-icons` `Ionicons` already in the project.

## Tool catalog (unchanged destinations)

| Title | Subtitle (keep current copy) | Icon (outline) | Route |
|-------|------------------------------|----------------|-------|
| Tìm kiếm | Ngày, lễ hội, tiết khí | `search-outline` | `/search` |
| Ngày tốt | Cưới hỏi, khai trương, xuất hành… | `sparkles-outline` | `/lucky` |
| Sự kiện cá nhân | `{n} sự kiện trên máy` | `calendar-outline` | `/personal` |
| Phong thủy | Mệnh, màu, số, hướng theo năm sinh | `compass-outline` | `/fengshui` |
| Tính ngày lễ | Đầy tháng, 49 ngày, giỗ… | `flower-outline` | `/memorial` |
| Gia đình | `{n} thành viên trên máy` | `people-outline` | `/family` |
| Thiên văn | Trăng, nhật thực, mưa sao băng | `planet-outline` | `/astronomy` |

Dynamic count subtitles for personal events and family members stay as today.

## Integration

In `app/(tabs)/settings.tsx`:

- Import `ToolTile` and `Ionicons` name types as needed.
- Replace the Tools `Card` / `SettingRow` block with the wrap grid of `ToolTile`s.
- Leave **GIAO DIỆN**, **LỊCH**, **THÔNG BÁO**, **DỮ LIỆU**, restore, and about sections unchanged.

## Visual constraints

- Follow existing theme tokens in `src/theme/colors.ts` and `src/theme/spacing.ts`.
- No purple gradients, heavy shadows, emoji icons, or pill clusters.
- Light and dark modes both use the same structure; chip uses `accentSoft` / `accentText` so it works in both schemes.

## Testing

- Open Settings: Tools show 2 columns; all 7 tiles navigate correctly.
- Toggle light/dark: tiles and chips remain readable.
- Personal / family count subtitles update when store counts change.
- No layout overflow on narrow phones; last odd tile left-aligned.
