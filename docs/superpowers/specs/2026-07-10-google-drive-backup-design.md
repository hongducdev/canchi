# Can Chi — Google Drive backup (personal)

**Date:** 2026-07-10  
**Status:** Approved for planning  
**Approach:** Google Sign-In native + Drive REST (manual backup/restore)  
**Platforms (v1):** Android only (APK / development build)

## Goal

Let users **sign in with their Google account** and **manually** upload / download a full app backup JSON to a visible file on their personal Google Drive, without a Can Chi backend. Keep existing local JSON export/paste as an offline fallback.

## Decisions locked

| Topic | Choice |
| --- | --- |
| Integration depth | Sign-in in app + Drive API (not Share-sheet-only) |
| Sync mode | Manual only (no auto sync in v1) |
| Platforms | Android only; hide Drive UI on iOS/Web |
| Auth stack | `@react-native-google-signin/google-signin` + Drive REST via `fetch` |
| Drive location | Visible folder `Can Chi` / file `canchi-backup.json` (overwrite on each backup) |
| Drive scope | `drive.file` (+ email/profile for account display) |
| Restore policy | Full replace after explicit confirm dialog |
| Local JSON | Keep export + paste restore alongside Drive |
| Encryption | None beyond Google account / Drive access |

## Out of scope (v1)

- Auto / background sync
- iOS or Web Drive flows
- Multiple dated backup files or in-app file picker beyond the fixed path
- App-owned server, cloud account, or analytics
- Encrypting the JSON with a separate passphrase
- Merging records by `updatedAt` / id

## Backup schema

Shared by Drive upload and local JSON export:

```ts
type AppBackupV2 = {
  version: 2;
  exportedAt: number;
  notes: DayNote[];
  personalEvents: PersonalEvent[];
  settings: AppSettings;
  userProfile: UserProfile | null;
  familyMembers: FamilyMember[];
};
```

### Parse / restore rules

| Incoming file | Behavior |
| --- | --- |
| `version: 2` | Replace notes, personalEvents, settings, userProfile, familyMembers with file contents (null / `[]` clears those stores) |
| `version: 1` | Replace notes, personalEvents, settings only; **leave** on-device userProfile and familyMembers unchanged |
| Invalid / other | Error; do not mutate stores |

Google tokens must never appear in the backup payload.

## UX (Settings → DỮ LIỆU)

Android only:

1. **Disconnected:** show “Chưa kết nối” + primary **Kết nối Google**; backup/restore disabled.
2. **Connected:** show email + last backup time (if any); actions **Sao lưu lên Drive**, **Khôi phục từ Drive**, **Ngắt kết nối**.
3. Helper copy: file path `Can Chi/canchi-backup.json`; restore replaces all on-device data covered by the schema rules above.
4. Below: existing **Xuất bản sao lưu JSON** / paste restore (now emitting/accepting v2 when exporting from current app).

Restore confirmation dialog must state that on-device data will be replaced (wording may distinguish v1 partial vs v2 full when known after download, or use a conservative “dữ liệu trên máy sẽ bị thay thế theo bản sao lưu” before apply).

## Architecture

```
Settings (Android)
  ├─ connect / disconnect     → googleDriveBackup + driveBackup store
  ├─ backup to Drive          → buildBackup v2 → upload overwrite
  ├─ restore from Drive       → download → parse → confirm → apply stores
  └─ local JSON export/paste  → same backup.ts helpers
```

| Module | Responsibility |
| --- | --- |
| `src/lib/backup.ts` | Build/serialize/parse v1+v2; helpers to apply parsed backup into stores (or call sites that write each store) |
| `src/lib/googleDriveBackup.ts` | Configure Google Sign-In; signIn / signOut / getTokens; ensure folder `Can Chi`; create or update `canchi-backup.json`; download file content |
| `src/store/driveBackup.ts` | Persist connection metadata: email, `lastBackupAt` (not access tokens if the Sign-In lib already persists session) |
| `app/(tabs)/settings.tsx` | Drive card UI gated with `Platform.OS === 'android'` (or existing `isWeb` + Android check) |

### Drive file strategy

1. Search for folder named `Can Chi` created by this app (`drive.file` scope).
2. If missing, create it under My Drive root.
3. Search for `canchi-backup.json` in that folder; **update** media if exists, else **create**.
4. On success, set `lastBackupAt` to now.

### Operator setup (required before QA)

Document in README / release notes (not secrets in git):

1. Google Cloud project: enable **Google Drive API**.
2. OAuth consent (testing or production as appropriate).
3. Android OAuth client: package `com.canchi.app`, SHA-1 for debug keystore and release keystore.
4. Web client ID if required by `@react-native-google-signin/google-signin` as `webClientId`.
5. Ship client IDs via Expo config / env pattern already used by the project (no private keys in repo).

## Error handling

| Case | UX |
| --- | --- |
| User cancels sign-in | No error toast; stay disconnected |
| Network / Drive API failure | Alert with short message; retry by tapping again |
| Token expired / revoked | Alert; prompt reconnect |
| No backup file on restore | Alert: chưa có bản sao lưu trên Drive |
| Invalid JSON / bad version | Alert; do not apply |

## Privacy

- Data leaves the device only when the user taps backup (or uses system Share for local JSON).
- File lives in the user’s own Drive; Can Chi does not operate a sync server.
- Copy in About / Settings helper should stay consistent with offline-first positioning.

## Success criteria

1. On Android, user can connect Google, upload v2 backup to `Can Chi/canchi-backup.json`, and restore it on the same or another Android install of Can Chi (same package).
2. Restore v2 fully replaces profile and family; restore v1 does not wipe profile/family.
3. Local JSON export produces v2; paste restore still works offline.
4. Drive UI is not shown on web (and not required on iOS in v1).
5. `npm run typecheck` passes; manual QA on a device/emulator with a real Google account.

## Testing checklist

- [ ] Connect / disconnect Google
- [ ] First backup creates folder + file; second backup overwrites same file
- [ ] Restore v2 on device with different data → matches backup
- [ ] Restore v1 file → notes/events/settings updated; profile/family kept
- [ ] Offline: local export/paste still works; Drive actions fail gracefully
- [ ] Web build: no Drive card / no crash on settings
