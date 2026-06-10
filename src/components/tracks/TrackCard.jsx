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
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()
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
      style={{
        outline: 'none',
        borderRadius: '14px',
        margin: '2px 0',
      }}
    >
      {/* Index / Play button */}
      <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 24 }}>
        {isActive && isPlaying ? (
          <div className="flex items-end gap-[2px]" style={{ height: 12, width: 14 }}>
            <div className="equalizer-bar" style={{ height: 5 }} />
            <div className="equalizer-bar" style={{ height: 10 }} />
            <div className="equalizer-bar" style={{ height: 6 }} />
            <div className="equalizer-bar" style={{ height: 8 }} />
          </div>
        ) : (
          <>
            {typeof index === 'number' && (
              <span
                className="track-number group-hover:hidden font-medium text-xs tabular-nums"
                style={{ color: isActive ? 'var(--color-brand-via)' : 'var(--color-text-muted)' }}
              >
                {(index + 1).toString().padStart(2, '0')}
              </span>
            )}
            <button
              className="hidden group-hover:flex items-center justify-center btn-icon"
              style={{ width: 22, height: 22, color: 'var(--color-text-primary)', background: 'transparent', border: 'none' }}
              aria-label={isActive ? 'Pause' : 'Play'}
              tabIndex={-1}
            >
              {isActive ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" style={{ marginLeft: 1 }} />}
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
            className="rounded-lg shadow-sm"
            style={{ width: 44, height: 44, objectFit: 'cover', display: 'block', border: '1px solid rgba(255,255,255,0.05)' }}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="rounded-lg flex items-center justify-center"
            style={{ width: 44, height: 44, background: 'var(--color-bg-card-hover)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <Music size={16} style={{ color: 'var(--color-text-muted)' }} />
          </div>
        )}
      </div>

      {/* Title + Artist */}
      <div className="flex-1 min-w-0">
        <p
          className="truncate leading-normal text-[0.9375rem]"
          style={{
            color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-primary)',
            fontWeight: isActive ? 700 : 500,
          }}
        >
          <span className={isActive ? 'text-brand-gradient' : ''}>
            {track.name}
          </span>
        </p>
        <p className="truncate mt-0.5 font-medium text-[0.8rem]" style={{ color: 'var(--color-text-secondary)' }}>
          {track.artist_name}
        </p>
      </div>

      {/* Album name (desktop only) */}
      <div className="hidden lg:block min-w-0 flex-shrink-0" style={{ width: 180, paddingRight: 10 }}>
        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-secondary)' }}>
          {track.album_name || ''}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          className="btn-icon"
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(track) }}
          style={{
            width: 32, height: 32,
            opacity: favorite ? 1 : undefined,
            color: favorite ? '#C8389A' : undefined,
            borderColor: favorite ? 'rgba(200,56,154,0.1)' : undefined,
            background: favorite ? 'rgba(200,56,154,0.03)' : undefined,
          }}
        >
          <Heart size={14} fill={favorite ? 'currentColor' : 'none'} strokeWidth={1.8} />
        </button>
        <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
          <DownloadButton track={track} />
        </div>
      </div>

      {/* Duration */}
      <span
        className="tabular-nums font-semibold flex-shrink-0"
        style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', minWidth: 44, textAlign: 'right' }}
      >
        {formatDuration(track.duration)}
      </span>
    </div>
  )
}

export default TrackCard
