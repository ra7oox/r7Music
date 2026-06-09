import { Header } from '@/components/layout/Header'
import { TrackList } from '@/components/tracks/TrackList'
import { useFavorites } from '@/hooks/useFavorites'
import { Heart } from 'lucide-react'

export const FavoritesPage = () => {
  const { favorites } = useFavorites()

  return (
    <>
      <Header title="Favorites" />
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 mb-6">
          <Heart size={20} style={{ color: '#d946ef' }} fill="#d946ef" />
          <h2 className="text-lg font-bold">Your Favorites</h2>
          <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>
            {favorites.length} {favorites.length === 1 ? 'track' : 'tracks'}
          </span>
        </div>
        <TrackList
          tracks={favorites}
          queueTracks={favorites}
          emptyMessage="No favorites yet. Browse and heart some tracks!"
        />
      </div>
    </>
  )
}

export default FavoritesPage
