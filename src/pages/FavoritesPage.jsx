import { Header } from '@/components/layout/Header'
import { TrackList } from '@/components/tracks/TrackList'
import { useFavorites } from '@/hooks/useFavorites'
import { Heart, Music2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const EmptyFavorites = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      {/* Animated heart */}
      <div
        className="flex items-center justify-center mb-6 rounded-full"
        style={{
          width: 88, height: 88,
          background: 'linear-gradient(135deg, rgba(124,63,228,0.15), rgba(200,56,154,0.1))',
          border: '1px solid rgba(200,56,154,0.2)',
          boxShadow: '0 0 32px rgba(200,56,154,0.15)',
        }}
      >
        <Heart
          size={36}
          style={{ color: '#C8389A', opacity: 0.8 }}
          fill="#C8389A"
        />
      </div>
      <h2 className="text-xl font-extrabold mb-2 text-white">
        No favorites yet
      </h2>
      <p className="text-sm max-w-xs mb-8" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        Browse tracks and tap the heart icon to save them here for quick access.
      </p>
      <button
        onClick={() => navigate('/')}
        className="btn-pill active flex items-center gap-2"
        style={{ padding: '10px 24px', fontSize: '0.875rem' }}
      >
        <Music2 size={15} />
        Discover Music
      </button>
    </div>
  )
}

export const FavoritesPage = () => {
  const { favorites } = useFavorites()

  return (
    <>
      <Header title="Favorites" />
      <div className="px-6 md:px-12 py-6 fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 38,
              height: 38,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: `inset 0 0 10px rgba(200, 56, 154, 0.05)`,
            }}
          >
            <Heart size={18} style={{ color: '#C8389A' }} fill="#C8389A" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-white">
              Your Favorites
            </h2>
            {favorites.length > 0 && (
              <p className="text-xs font-semibold mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                {favorites.length} {favorites.length === 1 ? 'track' : 'tracks'} saved
              </p>
            )}
          </div>
        </div>

        {favorites.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <TrackList
            tracks={favorites}
            queueTracks={favorites}
            emptyMessage="No favorites yet."
          />
        )}
      </div>
    </>
  )
}

export default FavoritesPage
