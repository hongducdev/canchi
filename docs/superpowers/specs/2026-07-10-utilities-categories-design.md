# Utilities Categories

**Date:** 2026-07-10  
**Status:** Approved — implement  
**Parent:** `2026-07-10-utilities-tab-design.md`  
**Direction:** Section labels + ToolTile grids (Approach 1)  
**Scope:** `app/(tabs)/utilities.tsx` only

## Goal

Group Tiện ích tiles under three uppercase section labels so the screen scans by purpose instead of one flat grid.

## Categories

| Label | Tools |
|-------|--------|
| TRA CỨU | Tìm kiếm, Thiên văn |
| NGÀY & VIỆC | Ngày tốt, Tính ngày lễ, Văn khấn |
| CÁ NHÂN | Sự kiện cá nhân (native), Gia đình (native), Phong thủy |

Web hide rules for personal/family unchanged. Phong thủy stays visible on web under CÁ NHÂN.

## UI

- Reuse Settings-style `group` label (uppercase, muted, letterSpacing).
- One `toolsGrid` per section (2-column `ToolTile`, same styles as today).
- No collapse, no filter chips, no new components.

## Out of scope

Tab order, Settings, WebSidebar, ToolTile API, routes.
