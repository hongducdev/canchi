import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type UserGender = 'male' | 'female' | 'other';

export type UserProfile = {
  fullName: string;
  gender?: UserGender;
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  lunarBirthDay?: number;
  lunarBirthMonth?: number;
  birthHourChi?: string;
  hometown?: string;
  updatedAt: number;
};

export type UserProfileDraft = Omit<UserProfile, 'updatedAt'>;

type UserProfileState = {
  profile: UserProfile | null;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  saveProfile: (draft: UserProfileDraft) => void;
  clearProfile: () => void;
};

export const GENDER_LABEL: Record<UserGender, string> = {
  male: 'Nam',
  female: 'Nữ',
  other: 'Khác',
};

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      profile: null,
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      saveProfile: (draft) => {
        set({
          profile: {
            fullName: draft.fullName.trim(),
            gender: draft.gender,
            birthYear: draft.birthYear,
            birthMonth: draft.birthMonth,
            birthDay: draft.birthDay,
            lunarBirthDay: draft.lunarBirthDay,
            lunarBirthMonth: draft.lunarBirthMonth,
            birthHourChi: draft.birthHourChi,
            hometown: draft.hometown?.trim() || undefined,
            updatedAt: Date.now(),
          },
        });
      },
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'licham-user-profile',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (s) => ({ profile: s.profile }),
    }
  )
);

export function hasUsableProfile(profile: UserProfile | null | undefined): boolean {
  return Boolean(profile?.fullName?.trim());
}
