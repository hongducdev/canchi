# La bàn & Thước Lỗ Ban

**Date:** 2026-07-10  
**Status:** Approved — implement  
**Direction:** Two independent screens under CÁ NHÂN tiles

## Locked

- Tiles: La bàn → `/compass`, Thước Lỗ Ban → `/lo-ban`
- Compass: live Magnetometer (native); web shows unsupported message
- Lo Ban rulers: 52.2 (dương), 42.9 (âm), 38.8 (nội thất)
- Approach: separate routes + `compass.ts` / `loBan.ts` + `expo-sensors`
