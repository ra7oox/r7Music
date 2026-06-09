import { useCallback } from 'react'
import { useFavoritesStore } from '@/store/favoritesStore'
import toast from 'react-hot-toast'

export const useFavorites = () => {
  const { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, clearFavorites } =
    useFavoritesStore()

  const toggleWithToast = useCallback(
    (track) => {
      const wasFav = isFavorite(track.id)
      toggleFavorite(track)
      toast(wasFav ? `Removed from favorites` : `Added to favorites`, {
        icon: wasFav ? '💔' : '❤️',
        style: {
          background: '#14142a',
          color: '#f0f0ff',
          border: '1px solid rgba(139,92,246,0.3)',
        },
      })
    },
    [isFavorite, toggleFavorite]
  )

  return { favorites, addFavorite, removeFavorite, toggleFavorite: toggleWithToast, isFavorite, clearFavorites }
}
