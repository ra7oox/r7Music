import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (track) => {
        const { favorites } = get()
        if (!favorites.find((t) => t.id === track.id)) {
          set({ favorites: [track, ...favorites] })
        }
      },

      removeFavorite: (trackId) =>
        set((s) => ({ favorites: s.favorites.filter((t) => t.id !== trackId) })),

      toggleFavorite: (track) => {
        const { favorites, addFavorite, removeFavorite } = get()
        favorites.find((t) => t.id === track.id)
          ? removeFavorite(track.id)
          : addFavorite(track)
      },

      isFavorite: (trackId) => get().favorites.some((t) => t.id === trackId),

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'r7music-favorites',
    }
  )
)
