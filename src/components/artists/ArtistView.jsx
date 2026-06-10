import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'
import { CardGridSkeleton } from '@/components/ui/Skeleton'

const placeholder = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#11111d"/></svg>'
)

export const ArtistCard = ({ artist }) => {
  const navigate = useNavigate()

  return (
    <div
      className="music-card group text-center"
      onClick={() => navigate(`/artists/${artist.id}`)}
      role="button"
      tabIndex={0}
      aria-label={artist.name}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/artists/${artist.id}`)}
      style={{ outline: 'none' }}
    >
      <div className="p-4 pb-0">
        <div className="relative mx-auto rounded-full overflow-hidden" style={{ width: 130, height: 130 }}>
          <img
            src={artist.image || artist.artist_image || placeholder}
            alt={artist.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => { e.target.src = placeholder }}
          />
          {/* Hover overlay */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ background: 'rgba(5,4,9,0.5)' }}
          >
            <div className="btn-play flex items-center justify-center transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
              style={{ width: 42, height: 42, boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }}
            >
              <Play size={18} fill="white" style={{ marginLeft: 2 }} />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 text-center">
        <p className="font-extrabold truncate text-sm text-white group-hover:text-brand-gradient transition-colors">
          {artist.name}
        </p>
        {artist.artist_location ? (
          <p className="truncate mt-1 text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
            {artist.artist_location}
          </p>
        ) : (
          <p className="truncate mt-1 text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            Featured Artist
          </p>
        )}
      </div>
    </div>
  )
}

export const ArtistGrid = ({ artists, isLoading, emptyMessage = 'No artists found' }) => {
  if (isLoading) return <CardGridSkeleton count={8} />
  if (!artists || artists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid-artists">
      {artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  )
}

export default ArtistGrid
