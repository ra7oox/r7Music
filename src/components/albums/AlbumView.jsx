import { useNavigate } from 'react-router-dom'
import { Disc3, Clock, Music } from 'lucide-react'
import { CardGridSkeleton } from '@/components/ui/Skeleton'

const placeholder = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="%2314142a"><rect width="200" height="200"/></svg>')

const formatTotalDuration = (tracks) => {
  if (!tracks || tracks.length === 0) return null
  const total = tracks.reduce((sum, t) => sum + (t.duration || 0), 0)
  const min = Math.floor(total / 60)
  const sec = Math.floor(total % 60)
  return sec > 0 ? `${min} min ${sec} s` : `${min} min`
}

export const AlbumCard = ({ album }) => {
  const navigate = useNavigate()
  const tracks = album.tracks || []
  const trackCount = tracks.length || album.tracks_count || 0
  const totalDur = tracks.length > 0 ? formatTotalDuration(tracks) : null

  return (
    <div
      className="glass-card overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/albums/${album.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`${album.name} by ${album.artist_name}`}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/albums/${album.id}`)}
    >
      <div className="relative">
        <img
          src={album.image || album.album_image || placeholder}
          alt={`${album.name} cover`}
          className="w-full aspect-square object-cover"
          loading="lazy"
          onError={(e) => { e.target.src = placeholder }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        >
          <div className="btn-play btn-play-lg flex items-center justify-center active:scale-90 transition-transform duration-150"
            style={{ boxShadow: '0 0 30px rgba(34,197,94,0.5)' }}
          >
            <Disc3 size={22} fill="white" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
          {album.name}
        </p>
        <p className="text-xs truncate mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {album.artist_name}
        </p>
        <div className="flex items-center gap-3 mt-2">
          {trackCount > 0 && (
            <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
              <Music size={11} />
              {trackCount} track{trackCount > 1 ? 's' : ''}
            </span>
          )}
          {totalDur && (
            <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
              <Clock size={11} />
              {totalDur}
            </span>
          )}
        </div>
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
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
    >
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  )
}

export default AlbumGrid
