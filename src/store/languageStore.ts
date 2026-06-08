import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageState {
  selectedLanguageId: string | null;
  setLanguageId: (id: string | null) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setLanguageId: (id) => set({ selectedLanguageId: id }),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        selectedLanguageId: state.selectedLanguageId,
      }),
    }
  )
);
