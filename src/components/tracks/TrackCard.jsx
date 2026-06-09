import { useState } from 'react'
import { Play, Pause, Heart, Music } from 'lucide-react'
import { usePlayer } from '@/hooks/usePlayer'
import { useFavorites } from '@/hooks/useFavorites'
import { DownloadButton } from '@/components/ui/DownloadButton'

const formatDuration = (s) => {
  if (!s) return '--:--'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export const TrackCard = ({ track, queueTracks, index }) => {
  const { currentTrack, isPlaying, isLoading, playTrack, togglePlay } = usePlayer()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [imgError, setImgError] = useState(false)

  const isActive = currentTrack?.id === track.id
  const favorite = isFavorite(track.id)
  const coverSrc = !imgError && track.album_image ? track.album_image : null

  const handlePlay = (e) => {
    e.stopPropagation()
    isActive ? togglePlay() : playTrack(track, queueTracks)
  }

  return (
    <div
      className={`track-row group ${isActive ? 'track-row-active' : ''}`}
      onClick={handlePlay}
      role="row"
      aria-label={`${track.name} by ${track.artist_name}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handlePlay(e)}
    >
      {/* Index / Play button */}
      <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 20 }}>
        {isActive && isPlaying ? (
          <div className="flex items-end gap-[2px]" style={{ height: 14, width: 16 }}>
            <div className="equalizer-bar" style={{ height: 6 }} />
            <div className="equalizer-bar" style={{ height: 11 }} />
            <div className="equalizer-bar" style={{ height: 7 }} />
            <div className="equalizer-bar" style={{ height: 10 }} />
          </div>
        ) : (
          <>
            {typeof index === 'number' && (
              <span
                className="track-number group-hover:hidden"
                style={{ color: isActive ? 'var(--color-accent-mid)' : 'var(--color-text-muted)' }}
              >
                {index + 1}
              </span>
            )}
            <button
              className="hidden group-hover:flex items-center justify-center btn-icon"
              style={{ width: 20, height: 20, color: 'var(--color-text-primary)' }}
              aria-label={isActive ? 'Pause' : 'Play'}
              tabIndex={-1}
            >
              {isActive ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>
          </>
        )}
      </div>

      {/* Cover */}
      <div className="relative flex-shrink-0" style={{ width: 44, height: 44 }}>
        {coverSrc ? (
          <img
            src={coverSrc}
            alt=""
            className="rounded-lg"
            style={{ width: 44, height: 44, objectFit: 'cover', display: 'block' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="rounded-lg flex items-center justify-center"
            style={{ width: 44, height: 44, background: 'var(--color-bg-card-hover)' }}
          >
            <Music size={18} style={{ color: 'var(--color-text-muted)' }} />
          </div>
        )}
      </div>

      {/* Title + Artist */}
      <div className="flex-1 min-w-0">
        <p
          className="truncate leading-tight"
          style={{
            fontSize: '0.9375rem',
            color: isActive ? 'var(--color-accent-mid)' : 'var(--color-text-primary)',
            fontWeight: isActive ? 600 : 400,
          }}
        >
          {track.name}
        </p>
        <p className="truncate mt-0.5" style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
          {track.artist_name}
        </p>
      </div>

      {/* Album name (desktop only) */}
      <div className="hidden lg:block min-w-0 flex-shrink-0" style={{ width: 160 }}>
        <p className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>
          {track.album_name || ''}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          className="btn-icon"
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(track) }}
          style={{
            width: 32, height: 32,
            opacity: favorite ? 1 : undefined,
            color: favorite ? 'var(--color-accent-to)' : undefined,
          }}
        >
          <Heart size={15} fill={favorite ? 'currentColor' : 'none'} strokeWidth={1.8} />
        </button>
        <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
          <DownloadButton track={track} />
        </div>
      </div>

      {/* Duration */}
      <span
        className="tabular-nums flex-shrink-0"
        style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', minWidth: 40, textAlign: 'right' }}
      >
        {formatDuration(track.duration)}
      </span>
    </div>
  )
}

export default TrackCard
