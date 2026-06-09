import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { CardGridSkeleton } from '@/components/ui/Skeleton'

const placeholder = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="%2314142a"><rect width="200" height="200"/></svg>')

export const ArtistCard = ({ artist }) => {
  const navigate = useNavigate()

  return (
    <div
      className="glass-card overflow-hidden cursor-pointer group text-center"
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
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: 'rgba(0,0,0,0.55)' }}
          >
            <div className="btn-play flex items-center justify-center active:scale-90 transition-transform duration-150"
              style={{ width: 44, height: 44, boxShadow: '0 0 30px rgba(34,197,94,0.5)' }}
            >
              <Users size={20} fill="white" />
            </div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
          {artist.name}
        </p>
        {artist.artist_location && (
          <p className="text-xs truncate mt-1" style={{ color: 'var(--color-text-muted)' }}>
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
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
    >
      {artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  )
}

export default ArtistGrid
