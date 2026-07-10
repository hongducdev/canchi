# Văn khấn + Hồ sơ + Điểm hợp — Implementation Plan

> **For agentic workers:** Spec: `docs/superpowers/specs/2026-07-10-van-khan-profile-design.md`. Implemented in-session (user requested immediate build).

**Goal:** Offline Văn khấn catalog with occasion ranking + profile fill; day↔person score on day detail.

**Architecture:** Static `src/data/vanKhan.ts`; Zustand `userProfile`; `vanKhan.ts` fill/rank; `dayPersonScore.ts` on `/day/[date]`.

**Tech Stack:** Expo Router, Zustand + AsyncStorage, existing day lore / can chi.

---

## Tasks (done)

- [x] Catalog + store + libs
- [x] `/profile`, `/van-khan`, `/van-khan/[id]`
- [x] Day detail **Điểm hợp** section
- [x] Settings ToolTile + HỒ SƠ row + stack screens
- [x] README note
- [x] Rich JSON schema (offerings, preparation, ritualSteps, related…)
- [x] Seed from `src/data/vankhan.json` (17 entries; `[...]` → fill placeholders)
