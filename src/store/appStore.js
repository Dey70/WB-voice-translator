import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme
      darkMode: true,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // History
      history: [],
      addToHistory: (entry) => {
        const newEntry = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...entry,
        }
        set((s) => ({ history: [newEntry, ...s.history].slice(0, 100) }))
      },
      deleteFromHistory: (id) =>
        set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
      clearHistory: () => set({ history: [] }),

      // Favorites
      favorites: [],
      toggleFavorite: (id) => {
        const { history, favorites } = get()
        const item = history.find((h) => h.id === id)
        if (!item) return
        const exists = favorites.find((f) => f.id === id)
        if (exists) {
          set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) }))
        } else {
          set((s) => ({ favorites: [item, ...s.favorites] }))
        }
      },
      isFavorite: (id) => get().favorites.some((f) => f.id === id),
    }),
    {
      name: 'kothasetu-storage',
      partialize: (state) => ({
        history: state.history,
        favorites: state.favorites,
        darkMode: state.darkMode,
      }),
    }
  )
)

