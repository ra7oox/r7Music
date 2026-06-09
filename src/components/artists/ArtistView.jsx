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
      className="music-card text-center"
      onClick={() => navigate(`/artists/${artist.id}`)}
      role="button"
      tabIndex={0}
      aria-label={artist.name}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/artists/${artist.id}`)}
    >
      <div className="p-4 pb-0">
        <div className="relative mx-auto" style={{ width: 140, height: 140 }}>
          <img
            src={artist.image || artist.artist_image || placeholder}
            alt={artist.name}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
            onError={(e) => { e.target.src = placeholder }}
          />
          {/* Hover overlay */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250"
            style={{ background: 'rgba(0,0,0,0.55)' }}
          >
            <div className="btn-play flex items-center justify-center"
              style={{ width: 48, height: 48, boxShadow: '0 0 30px rgba(0,0,0,0.7)' }}
            >
              <Play size={20} fill="white" style={{ marginLeft: 2 }} />
            </div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="font-semibold truncate" style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
          {artist.name}
        </p>
        {artist.artist_location && (
          <p className="truncate mt-1" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {artist.artist_location}
          </p>
        )}
      </div>
    </div>
  )
}

export const ArtistGrid = ({ artists, isLoading, emptyMessage = 'No artists found' }) => {
  if (isLoading) return <CardGridSkeleton count={6} />
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
