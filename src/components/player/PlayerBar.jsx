import { useCallback, useRef } from 'react'
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1,
  Volume2, VolumeX, Heart, ChevronUp,
} from 'lucide-react'
import { usePlayer } from '@/hooks/usePlayer'
import { usePlayerStore } from '@/store/playerStore'
import { useFavorites } from '@/hooks/useFavorites'

/* ── Seek / volume visual bar ─────────────────────────────────────────────── */
const RangeBar = ({ value, min = 0, max = 1, step = 0.001, onChange, label, innerRef, width = '100%', height = 4 }) => (
  <div
    className="progress-track group/bar"
    style={{ height, width }}
  >
    <div
      className="progress-fill absolute inset-y-0 left-0"
      style={{ width: `${((value - min) / (max - min)) * 100}%`, transition: 'width 150ms linear' }}
    />
    <input
      ref={innerRef}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      aria-label={label}
      className="absolute inset-0"
      style={{ opacity: 0, zIndex: 2, cursor: 'pointer', margin: 0 }}
    />
  </div>
)

export const PlayerBar = () => {
  const {
    currentTrack, isPlaying, isLoading, shuffle, repeat, volume, progress,
    formattedCurrent, formattedDuration, togglePlay, next, prev, seekTo,
    setVolume, toggleShuffle, toggleRepeat, queue,
  } = usePlayer()
  const toggleNowPlaying = usePlayerStore((s) => s.toggleNowPlaying)
  const { isFavorite, toggleFavorite } = useFavorites()

  const seekRef = useRef(null)
  const volRef  = useRef(null)

  const handleSeek   = useCallback(() => seekTo(parseFloat(seekRef.current?.value || 0)), [seekTo])
  const handleVolume = useCallback(() => setVolume(parseFloat(volRef.current?.value || 0.8)), [setVolume])

  if (!currentTrack) return null

  const isFav = isFavorite(currentTrack.id)

  return (
    <div className="player-bar" role="region" aria-label="Music player">

      {/* ── MOBILE ───────────────────────────────────────────────────────── */}
      <div className="md:hidden w-full">
        {/* Full-width seek strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 1 }}>
          <RangeBar
            value={progress} step={0.001}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            label="Seek" height={3}
            width="100%"
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2 w-full px-3" style={{ paddingTop: 3 }}>
          {/* Track info */}
          <button
            className="flex items-center gap-3 min-w-0 flex-1 text-left"
            onClick={toggleNowPlaying}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label="Open now playing"
          >
            {currentTrack.album_image ? (
              <img
                src={currentTrack.album_image}
                alt=""
                className="rounded flex-shrink-0"
                style={{ width: 46, height: 46, objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded flex-shrink-0 flex items-center justify-center"
                style={{ width: 46, height: 46, background: 'var(--color-bg-card)' }}
              />
            )}
            <div className="min-w-0">
              <p
                className="font-semibold truncate"
                style={{ fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}
              >
                {currentTrack.name}
              </p>
              <p
                className="truncate mt-0.5"
                style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}
              >
                {currentTrack.artist_name}
              </p>
            </div>
          </button>

          {/* Actions */}
          <button
            className="btn-icon"
            onClick={() => toggleFavorite(currentTrack)}
            aria-label={isFav ? 'Unlike' : 'Like'}
            style={{ color: isFav ? 'var(--color-accent-to)' : undefined }}
          >
            <Heart size={18} fill={isFav ? 'currentColor' : 'none'} strokeWidth={1.8} />
          </button>
          <button
            className="btn-play"
            onClick={togglePlay}
            disabled={isLoading}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            style={{ width: 40, height: 40 }}
          >
            {isLoading ? (
              <div className="flex items-end gap-[2px]" style={{ height: 12 }}>
                <div className="equalizer-bar" style={{ height: 5, background: '#000' }} />
                <div className="equalizer-bar" style={{ height: 9, background: '#000' }} />
                <div className="equalizer-bar" style={{ height: 4, background: '#000' }} />
              </div>
            ) : isPlaying ? (
              <Pause size={17} fill="#000" stroke="#000" />
            ) : (
              <Play size={17} fill="#000" stroke="#000" style={{ marginLeft: 1 }} />
            )}
          </button>
          <button className="btn-icon" onClick={next} aria-label="Next">
            <SkipForward size={18} />
          </button>
        </div>
      </div>

      {/* ── DESKTOP ──────────────────────────────────────────────────────── */}
      <div
        className="hidden md:grid w-full"
        style={{
          gridTemplateColumns: '1fr minmax(0, 560px) 1fr',
          alignItems: 'center',
          gap: 16,
          height: '100%',
        }}
      >
        {/* Left — Track info + Like */}
        <div className="flex items-center gap-3 min-w-0 pl-2">
          <button
            onClick={toggleNowPlaying}
            aria-label="Open now playing"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}
          >
            {currentTrack.album_image ? (
              <img
                src={currentTrack.album_image}
                alt=""
                className="rounded flex-shrink-0"
                style={{ width: 56, height: 56, objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded flex-shrink-0"
                style={{ width: 56, height: 56, background: 'var(--color-bg-card)' }}
              />
            )}
            <div className="min-w-0" style={{ maxWidth: 180 }}>
              <p
                className="font-semibold truncate"
                style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}
              >
                {currentTrack.name}
              </p>
              <p
                className="truncate mt-0.5"
                style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}
              >
                {currentTrack.artist_name}
              </p>
            </div>
          </button>

          <button
            className="btn-icon flex-shrink-0"
            onClick={() => toggleFavorite(currentTrack)}
            aria-label={isFav ? 'Unlike' : 'Like'}
            style={{ color: isFav ? 'var(--color-accent-to)' : undefined }}
          >
            <Heart size={16} fill={isFav ? 'currentColor' : 'none'} strokeWidth={1.8} />
          </button>
        </div>

        {/* Center — Controls + Seeker */}
        <div className="flex flex-col items-center gap-2">
          {/* Control buttons */}
          <div className="flex items-center gap-4">
            <button
              className="btn-icon"
              onClick={toggleShuffle}
              aria-label={`Shuffle ${shuffle ? 'on' : 'off'}`}
              style={{ color: shuffle ? 'var(--color-text-primary)' : undefined }}
            >
              <Shuffle size={15} />
              {shuffle && (
                <span
                  style={{
                    position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                    width: 4, height: 4, borderRadius: '50%', background: 'var(--color-accent-mid)',
                  }}
                />
              )}
            </button>
            <button className="btn-icon" onClick={prev} aria-label="Previous">
              <SkipBack size={19} />
            </button>
            <button
              className="btn-play"
              onClick={togglePlay}
              disabled={isLoading}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <div className="flex items-end gap-[2px]" style={{ height: 14 }}>
                  <div className="equalizer-bar" style={{ height: 6, background: '#000' }} />
                  <div className="equalizer-bar" style={{ height: 10, background: '#000' }} />
                  <div className="equalizer-bar" style={{ height: 5, background: '#000' }} />
                </div>
              ) : isPlaying ? (
                <Pause size={20} fill="#000" stroke="#000" />
              ) : (
                <Play size={20} fill="#000" stroke="#000" style={{ marginLeft: 2 }} />
              )}
            </button>
            <button className="btn-icon" onClick={next} aria-label="Next">
              <SkipForward size={19} />
            </button>
            <button
              className="btn-icon"
              onClick={toggleRepeat}
              aria-label={`Repeat ${repeat}`}
              style={{ color: repeat !== 'none' ? 'var(--color-text-primary)' : undefined, position: 'relative' }}
            >
              {repeat === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
              {repeat !== 'none' && (
                <span
                  style={{
                    position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                    width: 4, height: 4, borderRadius: '50%', background: 'var(--color-accent-mid)',
                  }}
                />
              )}
            </button>
          </div>

          {/* Seek bar */}
          <div className="flex items-center gap-2 w-full">
            <span
              className="tabular-nums flex-shrink-0 text-right"
              style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', minWidth: 36 }}
            >
              {formattedCurrent}
            </span>
            <div style={{ flex: 1, position: 'relative', height: 4 }}>
              <RangeBar value={progress} step={0.001} onChange={handleSeek} label="Seek" innerRef={seekRef} height={4} />
            </div>
            <span
              className="tabular-nums flex-shrink-0"
              style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', minWidth: 36 }}
            >
              {formattedDuration}
            </span>
          </div>
        </div>

        {/* Right — Volume */}
        <div className="flex items-center gap-2 justify-end pr-4">
          <button
            className="btn-icon"
            onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
          >
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div style={{ width: 90, position: 'relative', height: 4 }}>
            <RangeBar value={volume} step={0.01} onChange={handleVolume} label="Volume" innerRef={volRef} height={4} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerBar
