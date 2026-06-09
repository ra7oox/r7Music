import { useNavigate } from 'react-router-dom'
import { Play, Music } from 'lucide-react'
import { CardGridSkeleton } from '@/components/ui/Skeleton'

const placeholder = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#11111d"/></svg>'
)

const formatTotalDuration = (tracks) => {
  if (!tracks || tracks.length === 0) return null
  const total = tracks.reduce((sum, t) => sum + (t.duration || 0), 0)
  const min = Math.floor(total / 60)
  return `${min} min`
}

export const AlbumCard = ({ album }) => {
  const navigate = useNavigate()
  const tracks = album.tracks || []
  const trackCount = tracks.length || album.tracks_count || 0
  const totalDur = tracks.length > 0 ? formatTotalDuration(tracks) : null

  return (
    <div
      className="music-card"
      onClick={() => navigate(`/albums/${album.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`${album.name} by ${album.artist_name}`}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/albums/${album.id}`)}
    >
      {/* Cover */}
      <div className="relative" style={{ aspectRatio: '1' }}>
        <img
          src={album.image || album.album_image || placeholder}
          alt={`${album.name} cover`}
          className="music-card-cover"
          loading="lazy"
          onError={(e) => { e.target.src = placeholder }}
        />
      </div>

      {/* Hover play button */}
      <div className="card-play-btn">
        <div className="btn-play" style={{ width: 48, height: 48, boxShadow: '0 0 30px rgba(0,0,0,0.7)' }}>
          <Play size={20} fill="white" style={{ marginLeft: 2 }} />
        </div>
      </div>

      {/* Footer */}
      <div className="p-3">
        <p className="font-semibold truncate leading-tight" style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
          {album.name}
        </p>
        <p className="truncate mt-1" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
          {album.artist_name}
        </p>
        {(trackCount > 0 || totalDur) && (
          <div className="flex items-center gap-2 mt-2">
            {trackCount > 0 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Music size={10} />
                {trackCount} track{trackCount > 1 ? 's' : ''}
              </span>
            )}
            {totalDur && (
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                · {totalDur}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export const AlbumGrid = ({ albums, isLoading, emptyMessage = 'No albums found' }) => {
  if (isLoading) return <CardGridSkeleton count={6} />
  if (!albums || albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid-albums">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  )
}

export default AlbumGrid
