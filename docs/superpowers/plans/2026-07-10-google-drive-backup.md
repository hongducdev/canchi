# Google Drive Backup Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Android users can sign in with Google and manually backup/restore Can Chi data to `Can Chi/canchi-backup.json` on personal Drive.

**Architecture:** Upgrade `backup.ts` to v2; add Google Sign-In + Drive REST helpers; persist connection metadata; Settings Drive card (Android only). Local JSON export/paste kept.

**Tech Stack:** `@react-native-google-signin/google-signin`, Drive API v3, Zustand, Expo 56.

**Spec:** `docs/superpowers/specs/2026-07-10-google-drive-backup-design.md`

---

### Task 1: Backup schema v2

**Files:** `src/lib/backup.ts`, callers in `settings.tsx`

- [x] Extend `AppBackup` to version 2 with `userProfile` + `familyMembers`
- [x] Parse v1 and v2; `applyBackup` respects restore rules
- [x] Export builds v2 from all stores

### Task 2: Drive auth + API module

**Files:** `src/lib/googleDriveBackup.ts`, `src/store/driveBackup.ts`

- [x] Configure Sign-In with `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` + `drive.file` scope
- [x] connect / disconnect / upload / download
- [x] Persist email + `lastBackupAt`

### Task 3: Settings UI + deps

**Files:** `app/(tabs)/settings.tsx`, `package.json`, `app.json`, `docs/vi.md` or README snippet

- [x] Install package + config plugin
- [x] Android Drive card
- [x] Document Google Cloud setup

### Task 4: Verify

- [x] `npm run typecheck`
