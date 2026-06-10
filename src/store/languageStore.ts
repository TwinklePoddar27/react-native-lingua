import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageState {
  selectedLanguageId: string | null;
  setLanguageId: (id: string | null) => void;
  completedLessonIds: string[];
  completeLesson: (id: string) => void;
  uncompleteLesson: (id: string) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setLanguageId: (id) => set({ selectedLanguageId: id }),
      completedLessonIds: [
        "es-u1-l1",
        "ja-u1-l1",
        "fr-u1-l1",
        "ko-u1-l1",
        "de-u1-l1",
        "zh-u1-l1",
        "mock-lesson-1",
      ],
      completeLesson: (id) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.includes(id)
            ? state.completedLessonIds
            : [...state.completedLessonIds, id],
        })),
      uncompleteLesson: (id) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.filter((x) => x !== id),
        })),
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
        completedLessonIds: state.completedLessonIds,
      }),
    }
  )
);
