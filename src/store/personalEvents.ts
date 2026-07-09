import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PersonalEvent, PersonalEventKind } from '../lib/types';

type Draft = {
  title: string;
  note?: string;
  kind: PersonalEventKind;
  calendar: 'solar' | 'lunar';
  recurring: boolean;
  solarDay?: number;
  solarMonth?: number;
  solarYear?: number;
  lunarDay?: number;
  lunarMonth?: number;
  lunarLeap?: boolean;
};

type PersonalEventsState = {
  events: PersonalEvent[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  addEvent: (draft: Draft) => void;
  updateEvent: (id: string, draft: Partial<Draft>) => void;
  deleteEvent: (id: string) => void;
};

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const usePersonalEventsStore = create<PersonalEventsState>()(
  persist(
    (set, get) => ({
      events: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      addEvent: (draft) => {
        const now = Date.now();
        const event: PersonalEvent = {
          id: uid(),
          title: draft.title.trim() || 'Sự kiện',
          note: draft.note?.trim() || undefined,
          kind: draft.kind,
          calendar: draft.calendar,
          recurring: draft.recurring,
          solarDay: draft.solarDay,
          solarMonth: draft.solarMonth,
          solarYear: draft.solarYear,
          lunarDay: draft.lunarDay,
          lunarMonth: draft.lunarMonth,
          lunarLeap: draft.lunarLeap,
          createdAt: now,
          updatedAt: now,
        };
        set({ events: [event, ...get().events] });
      },
      updateEvent: (id, draft) => {
        set({
          events: get().events.map((e) =>
            e.id === id
              ? {
                  ...e,
                  ...draft,
                  title: draft.title?.trim() || e.title,
                  note: draft.note?.trim() || e.note,
                  updatedAt: Date.now(),
                }
              : e
          ),
        });
      },
      deleteEvent: (id) => {
        set({ events: get().events.filter((e) => e.id !== id) });
      },
    }),
    {
      name: 'licham-personal-events',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (s) => ({ events: s.events }),
    }
  )
);

export const PERSONAL_KIND_LABEL: Record<PersonalEventKind, string> = {
  'lunar-birthday': 'Sinh nhật Âm',
  'solar-birthday': 'Sinh nhật Dương',
  wedding: 'Ngày cưới',
  'death-anniversary': 'Giỗ',
  reminder: 'Nhắc việc',
  note: 'Ghi chú',
  custom: 'Tùy chỉnh',
};
