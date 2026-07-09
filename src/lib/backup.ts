/**
 * Local JSON backup / restore for notes + personal events + settings.
 */

import type { AppSettings, DayNote, PersonalEvent } from './types';

export type AppBackup = {
  version: 1;
  exportedAt: number;
  notes: DayNote[];
  personalEvents: PersonalEvent[];
  settings: AppSettings;
};

export function buildBackup(
  notes: DayNote[],
  personalEvents: PersonalEvent[],
  settings: AppSettings
): AppBackup {
  return {
    version: 1,
    exportedAt: Date.now(),
    notes,
    personalEvents,
    settings,
  };
}

export function serializeBackup(backup: AppBackup): string {
  return JSON.stringify(backup, null, 2);
}

export function parseBackup(raw: string): AppBackup {
  const data = JSON.parse(raw) as AppBackup;
  if (!data || data.version !== 1 || !Array.isArray(data.notes) || !Array.isArray(data.personalEvents)) {
    throw new Error('File sao lưu không hợp lệ');
  }
  return data;
}
