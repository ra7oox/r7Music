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
          background: 'linear-gradient(135deg, rgba(124,63,228,0.2), rgba(200,56,154,0.15))',
          border: '1px solid rgba(200,56,154,0.25)',
        }}
      >
        <Heart
          size={36}
          style={{ color: 'var(--color-brand-to)', opacity: 0.7 }}
        />
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
        No favorites yet
      </h2>
      <p className="text-sm max-w-xs mb-8" style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
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
      <div className="px-4 md:px-6 py-5 fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, rgba(200,56,154,0.25), rgba(124,63,228,0.15))',
            }}
          >
            <Heart size={20} style={{ color: 'var(--color-brand-to)' }} fill="var(--color-brand-to)" />
          </div>
          <div>
            <h2 className="section-heading" style={{ marginBottom: 0 }}>
              Your Favorites
            </h2>
            {favorites.length > 0 && (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {favorites.length} {favorites.length === 1 ? 'track' : 'tracks'}
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
