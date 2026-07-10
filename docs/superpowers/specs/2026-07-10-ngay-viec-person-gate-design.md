# Ngày & Việc — Person Gate + Lucky Hub

**Date:** 2026-07-10  
**Status:** Approved — implement  
**Direction:** Approach 1 — in-memory session person + shared gate + lucky hub

## Locked decisions

- Utilities keeps Ngày tốt / Tính ngày lễ / Văn khấn tiles.
- Ngày tốt → hub of activity tiles → person gate → results.
- Tính ngày lễ & Văn khấn → person gate first.
- Default profile = Hồ sơ của tôi only; or temp name + birthYear + optional gender (not saved).
- Kết hôn & Dặm ngõ require two people (chú rể + cô dâu).
- Scoring combines calendar activity score + `scoreDayForPerson` (average for couples).
- Kết hôn spelling (not Kết hốt).

## Activity catalog

`general` (Ngày tốt xấu), `wedding`, `dam-ngo`, `groundbreaking`, `travel`, `house-moving`, `buy-house`, `car-purchase`, `exam-interview`, `paperwork`, `grand-opening`, `contract`, `sang-cat`, `move-altar`, `setup-altar`, `sao-giai-han`, `tran-trach`, `cau-an`, `new-job`.

## Routes

- `lucky` — hub  
- `person-gate` — query `next` + `couple=1` when needed  
- `lucky/[activity]` — results  

## Session

`src/store/sessionPerson.ts` — `{ primary, secondary? }`, no persist.
