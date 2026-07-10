/**
 * Local JSON backup / restore — shared by Share export and Google Drive.
 */

import type {
  AppSettings,
  DayNote,
  FamilyMember,
  PersonalEvent,
} from './types';
import type { UserProfile } from '../store/userProfile';
import { useFamilyStore } from '../store/family';
import { useNotesStore } from '../store/notes';
import { usePersonalEventsStore } from '../store/personalEvents';
import { useSettingsStore } from '../store/settings';
import { useUserProfileStore } from '../store/userProfile';

export type AppBackupV1 = {
  version: 1;
  exportedAt: number;
  notes: DayNote[];
  personalEvents: PersonalEvent[];
  settings: AppSettings;
};

export type AppBackupV2 = {
  version: 2;
  exportedAt: number;
  notes: DayNote[];
  personalEvents: PersonalEvent[];
  settings: AppSettings;
  userProfile: UserProfile | null;
  familyMembers: FamilyMember[];
};

export type AppBackup = AppBackupV1 | AppBackupV2;

function isAppSettings(value: unknown): value is AppSettings {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  return (
    (s.themeMode === 'system' || s.themeMode === 'light' || s.themeMode === 'dark') &&
    (s.weekStartsOn === 0 || s.weekStartsOn === 1) &&
    typeof s.showLunarInGrid === 'boolean' &&
    typeof s.showFestivals === 'boolean' &&
    typeof s.haptics === 'boolean'
  );
}

export function buildBackup(
  notes: DayNote[],
  personalEvents: PersonalEvent[],
  settings: AppSettings,
  userProfile: UserProfile | null = null,
  familyMembers: FamilyMember[] = []
): AppBackupV2 {
  return {
    version: 2,
    exportedAt: Date.now(),
    notes,
    personalEvents,
    settings,
    userProfile,
    familyMembers,
  };
}

export function serializeBackup(backup: AppBackup): string {
  return JSON.stringify(backup, null, 2);
}

export function parseBackup(raw: string): AppBackup {
  const data = JSON.parse(raw) as Partial<AppBackup> & { version?: number };
  if (!data || !Array.isArray(data.notes) || !Array.isArray(data.personalEvents)) {
    throw new Error('File sao lưu không hợp lệ');
  }
  if (!isAppSettings(data.settings)) {
    throw new Error('File sao lưu không hợp lệ (cài đặt)');
  }
  if (data.version === 1) {
    return {
      version: 1,
      exportedAt: typeof data.exportedAt === 'number' ? data.exportedAt : Date.now(),
      notes: data.notes,
      personalEvents: data.personalEvents,
      settings: data.settings,
    };
  }
  if (data.version === 2) {
    const v2 = data as Partial<AppBackupV2>;
    if (v2.userProfile !== null && v2.userProfile !== undefined) {
      if (typeof v2.userProfile !== 'object' || typeof v2.userProfile.fullName !== 'string') {
        throw new Error('File sao lưu không hợp lệ (hồ sơ)');
      }
    }
    if (v2.familyMembers !== undefined && !Array.isArray(v2.familyMembers)) {
      throw new Error('File sao lưu không hợp lệ (gia đình)');
    }
    return {
      version: 2,
      exportedAt: typeof v2.exportedAt === 'number' ? v2.exportedAt : Date.now(),
      notes: v2.notes!,
      personalEvents: v2.personalEvents!,
      settings: v2.settings!,
      userProfile: v2.userProfile ?? null,
      familyMembers: v2.familyMembers ?? [],
    };
  }
  throw new Error('Phiên bản sao lưu không hỗ trợ');
}

/** Apply parsed backup into Zustand stores per v1/v2 rules. */
export function applyBackup(data: AppBackup): { restoredProfileFamily: boolean } {
  useNotesStore.setState({ notes: data.notes });
  usePersonalEventsStore.setState({ events: data.personalEvents });
  useSettingsStore.setState({
    themeMode: data.settings.themeMode,
    weekStartsOn: data.settings.weekStartsOn,
    showLunarInGrid: data.settings.showLunarInGrid,
    showFestivals: data.settings.showFestivals,
    haptics: data.settings.haptics,
  });

  if (data.version === 2) {
    useUserProfileStore.setState({ profile: data.userProfile });
    useFamilyStore.setState({ members: data.familyMembers });
    return { restoredProfileFamily: true };
  }
  return { restoredProfileFamily: false };
}
