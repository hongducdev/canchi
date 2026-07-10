import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type DriveBackupState = {
  email: string | null;
  lastBackupAt: number | null;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setConnected: (email: string) => void;
  setLastBackupAt: (at: number) => void;
  clearConnection: () => void;
};

export const useDriveBackupStore = create<DriveBackupState>()(
  persist(
    (set) => ({
      email: null,
      lastBackupAt: null,
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      setConnected: (email) => set({ email }),
      setLastBackupAt: (lastBackupAt) => set({ lastBackupAt }),
      clearConnection: () => set({ email: null }),
    }),
    {
      name: 'licham-drive-backup',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        email: s.email,
        lastBackupAt: s.lastBackupAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
