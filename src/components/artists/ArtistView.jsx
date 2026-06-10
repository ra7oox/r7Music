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
    >
      <div className="relative mx-auto w-[120px] aspect-square overflow-hidden rounded-full shadow-lg">
        <img
          src={artist.image || artist.artist_image || placeholder}
          alt={artist.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { e.target.src = placeholder }}
        />
        {/* Hover overlay play button */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <div className="btn-play" style={{ width: 40, height: 40 }}>
            <Play size={16} fill="white" style={{ marginLeft: 2 }} />
          </div>
        </div>
      </div>

      <div className="pt-3.5">
        <p className="font-bold truncate text-sm" style={{ color: 'var(--color-text-primary)' }}>
          {artist.name}
        </p>
        <p className="truncate mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {artist.artist_location || 'Artist'}
        </p>
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
