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
      <div className="flex items-center justify-center w-8">
        {isActive && isPlaying ? (
          <div className="flex items-end gap-[2.5px]" style={{ height: 14, width: 14 }}>
            <div className="equalizer-bar" style={{ height: 6 }} />
            <div className="equalizer-bar" style={{ height: 11 }} />
            <div className="equalizer-bar" style={{ height: 7 }} />
            <div className="equalizer-bar" style={{ height: 10 }} />
          </div>
        ) : (
          <>
            {typeof index === 'number' && (
              <span
                className="track-number group-hover:hidden font-medium"
                style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              >
                {index + 1}
              </span>
            )}
            <button
              className="hidden group-hover:flex items-center justify-center btn-icon"
              style={{ width: 20, height: 20, color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
              aria-label={isActive ? 'Pause' : 'Play'}
              tabIndex={-1}
            >
              {isActive ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>
          </>
        )}
      </div>

      {/* Title + Cover + Artist */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0" style={{ width: 40, height: 40 }}>
          {coverSrc ? (
            <img
              src={coverSrc}
              alt=""
              className="rounded-md"
              style={{ width: 40, height: 40, objectFit: 'cover', display: 'block' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="rounded-md flex items-center justify-center"
              style={{ width: 40, height: 40, background: 'var(--color-bg-card-hover)' }}
            >
              <Music size={16} style={{ color: 'var(--color-text-muted)' }} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="truncate font-semibold text-sm leading-snug"
            style={{
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
            }}
          >
            {track.name}
          </p>
          <p className="truncate text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {track.artist_name}
          </p>
        </div>
      </div>

      {/* Album name (desktop/tablet grid column) */}
      <div className="hidden md:block min-w-0 truncate text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {track.album_name || ''}
      </div>

      {/* Actions (Heart + Download) */}
      <div className="flex items-center gap-1">
        <button
          className={`btn-icon transition-opacity ${favorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}`}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(track) }}
          style={{
            width: 32,
            height: 32,
            color: favorite ? 'var(--color-brand-to)' : undefined,
          }}
        >
          <Heart size={15} fill={favorite ? 'currentColor' : 'none'} strokeWidth={1.8} />
        </button>
        <div className="hidden sm:block opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <DownloadButton track={track} />
        </div>
      </div>

      {/* Duration */}
      <span
        className="tabular-nums text-xs text-right pr-2"
        style={{ color: 'var(--color-text-secondary)', minWidth: 40 }}
      >
        {formatDuration(track.duration)}
      </span>
    </div>
  )
}

export default TrackCard
