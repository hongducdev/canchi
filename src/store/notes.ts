import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { DayNote } from '../lib/types';

type NotesState = {
  notes: DayNote[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  addNote: (dateKey: string, title: string, body: string) => void;
  updateNote: (id: string, title: string, body: string) => void;
  deleteNote: (id: string) => void;
  notesForDate: (dateKey: string) => DayNote[];
};

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      addNote: (dateKey, title, body) => {
        const now = Date.now();
        const note: DayNote = {
          id: uid(),
          dateKey,
          title: title.trim() || 'Ghi chú',
          body: body.trim(),
          createdAt: now,
          updatedAt: now,
        };
        set({ notes: [note, ...get().notes] });
      },
      updateNote: (id, title, body) => {
        set({
          notes: get().notes.map((n) =>
            n.id === id
              ? {
                  ...n,
                  title: title.trim() || 'Ghi chú',
                  body: body.trim(),
                  updatedAt: Date.now(),
                }
              : n
          ),
        });
      },
      deleteNote: (id) => {
        set({ notes: get().notes.filter((n) => n.id !== id) });
      },
      notesForDate: (dateKey) => get().notes.filter((n) => n.dateKey === dateKey),
    }),
    {
      name: 'licham-notes',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (s) => ({ notes: s.notes }),
    }
  )
);
