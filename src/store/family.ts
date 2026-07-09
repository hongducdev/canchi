import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { FamilyMember, FamilyRelation } from '../lib/types';

type Draft = {
  name: string;
  relation: FamilyRelation;
  birthYear?: number;
  solarBirthdayDay?: number;
  solarBirthdayMonth?: number;
  lunarBirthdayDay?: number;
  lunarBirthdayMonth?: number;
  note?: string;
};

type FamilyState = {
  members: FamilyMember[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  addMember: (draft: Draft) => void;
  updateMember: (id: string, draft: Partial<Draft>) => void;
  deleteMember: (id: string) => void;
};

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set, get) => ({
      members: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      addMember: (draft) => {
        const now = Date.now();
        const member: FamilyMember = {
          id: uid(),
          name: draft.name.trim() || 'Thành viên',
          relation: draft.relation,
          birthYear: draft.birthYear,
          solarBirthdayDay: draft.solarBirthdayDay,
          solarBirthdayMonth: draft.solarBirthdayMonth,
          lunarBirthdayDay: draft.lunarBirthdayDay,
          lunarBirthdayMonth: draft.lunarBirthdayMonth,
          note: draft.note?.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        set({ members: [member, ...get().members] });
      },
      updateMember: (id, draft) => {
        set({
          members: get().members.map((m) =>
            m.id === id
              ? {
                  ...m,
                  ...draft,
                  name: draft.name?.trim() || m.name,
                  note: draft.note?.trim() || m.note,
                  updatedAt: Date.now(),
                }
              : m
          ),
        });
      },
      deleteMember: (id) => {
        set({ members: get().members.filter((m) => m.id !== id) });
      },
    }),
    {
      name: 'licham-family',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (s) => ({ members: s.members }),
    }
  )
);

export const FAMILY_RELATION_LABEL: Record<FamilyRelation, string> = {
  self: 'Bản thân',
  spouse: 'Vợ / Chồng',
  parent: 'Cha / Mẹ',
  child: 'Con',
  sibling: 'Anh / Chị / Em',
  grandparent: 'Ông / Bà',
  other: 'Khác',
};
