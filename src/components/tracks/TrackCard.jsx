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

export const TrackCard = ({ track, queueTracks }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [imgError, setImgError] = useState(false)

  const isActive = currentTrack?.id === track.id
  const favorite = isFavorite(track.id)

  const handlePlay = (e) => {
    e.stopPropagation()
    if (isActive) {
      togglePlay()
    } else {
      playTrack(track, queueTracks)
    }
  }

  const coverSrc = !imgError && track.album_image
    ? track.album_image
    : null

  return (
    <div
      className={`track-row group flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${isActive ? 'track-row-active' : 'hover:bg-white/[0.03]'}`}
      onClick={handlePlay}
      role="row"
      aria-label={`${track.name} by ${track.artist_name}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handlePlay(e)}
    >
      {/* Track number / cover */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center"
        style={{ width: 44, height: 44 }}
      >
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={`${track.album_name} cover`}
            className="rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
            style={{ width: 44, height: 44 }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, rgba(67,56,202,0.3), rgba(99,102,241,0.2))',
            }}
          >
            <Music size={18} style={{ color: 'var(--color-text-muted)' }} />
          </div>
        )}

        {/* Play overlay on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 active:scale-95"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        >
          {isActive && isPlaying ? (
            <Pause size={16} color="white" />
          ) : (
            <Play size={16} color="white" fill="white" />
          )}
        </div>

        {/* Equalizer when active */}
        {isActive && isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-lg"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            aria-hidden="true"
          >
            <div className="flex items-end gap-[3px]" style={{ height: 14 }}>
              <div className="equalizer-bar" style={{ height: 8 }} />
              <div className="equalizer-bar" style={{ height: 12 }} />
              <div className="equalizer-bar" style={{ height: 6 }} />
              <div className="equalizer-bar" style={{ height: 10 }} />
            </div>
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate leading-tight"
          style={{ color: isActive ? 'var(--color-play)' : 'var(--color-text-primary)' }}
        >
          {track.name}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          {track.artist_name}
          {track.album_name && ` · ${track.album_name}`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          className="btn-icon"
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(track) }}
          style={{ minWidth: 36, minHeight: 36 }}
        >
          <Heart
            size={14}
            fill={favorite ? '#22c55e' : 'none'}
            stroke={favorite ? '#22c55e' : 'currentColor'}
          />
        </button>
        <DownloadButton track={track} />
      </div>

      {/* Duration */}
      <span
        className="text-xs tabular-nums flex-shrink-0"
        style={{ color: 'var(--color-text-muted)', minWidth: 32, textAlign: 'right' }}
      >
        {formatDuration(track.duration)}
      </span>
    </div>
  )
}

export default TrackCard
