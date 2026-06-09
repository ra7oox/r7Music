import { useCallback, useRef } from 'react'
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  Volume2, VolumeX, ListMusic,
} from 'lucide-react'
import { usePlayer } from '@/hooks/usePlayer'
import { usePlayerStore } from '@/store/playerStore'

export const PlayerBar = () => {
  const {
    currentTrack, isPlaying, isLoading, shuffle, repeat, volume, progress,
    formattedCurrent, formattedDuration, togglePlay, next, prev, seekTo,
    setVolume, toggleShuffle, toggleRepeat, queue,
  } = usePlayer()
  const toggleNowPlaying = usePlayerStore((s) => s.toggleNowPlaying)

  const seekRef = useRef(null)
  const volRef = useRef(null)

  const handleSeek = useCallback(() => {
    const val = parseFloat(seekRef.current?.value || 0)
    seekTo(val)
  }, [seekTo])

  const handleVolume = useCallback(() => {
    const val = parseFloat(volRef.current?.value || 0.8)
    setVolume(val)
  }, [setVolume])

  if (!currentTrack) return null

  return (
    <div
      className="player-bar"
      role="region"
      aria-label="Music player"
      style={{ background: 'rgba(12, 12, 26, 0.92)' }}
    >
      <div className="flex items-center gap-3 px-3 py-2.5 max-w-screen-2xl mx-auto md:gap-4 md:px-4">
        {/* Track info */}
        <button
          className="flex items-center gap-2.5 min-w-0 flex-shrink-0 md:w-[200px] w-[140px] text-left"
          onClick={toggleNowPlaying}
          aria-label="Show now playing"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div className="relative flex-shrink-0">
            <img
              src={currentTrack.album_image || ''}
              alt=""
              className={`rounded-lg ${isPlaying ? 'spin-album' : 'spin-album paused'}`}
              style={{ width: 40, height: 40, objectFit: 'cover' }}
            />
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(34,197,94,0.15), transparent)',
                pointerEvents: 'none',
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate leading-tight" style={{ color: 'var(--color-text-primary)' }}>
              {currentTrack.name}
            </p>
            <p className="text-xs truncate leading-tight mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {currentTrack.artist_name}
            </p>
          </div>
        </button>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-0.5 max-w-xl mx-auto">
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              className="btn-icon hidden sm:flex"
              aria-label={`Repeat ${repeat === 'one' ? 'one' : repeat === 'all' ? 'all' : 'off'}`}
              onClick={toggleRepeat}
              style={{ color: repeat !== 'none' ? 'var(--color-play)' : undefined }}
            >
              {repeat === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
            </button>
            <button className="btn-icon" aria-label="Previous track" onClick={prev}>
              <SkipBack size={17} />
            </button>
            <button
              className="btn-play"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              disabled={isLoading}
              style={{ boxShadow: isPlaying ? '0 0 20px rgba(34,197,94,0.6)' : undefined }}
            >
              {isLoading ? (
                <div className="flex items-end gap-0.5" style={{ height: 14 }}>
                  <div className="equalizer-bar" style={{ height: 6 }} />
                  <div className="equalizer-bar" style={{ height: 10 }} />
                  <div className="equalizer-bar" style={{ height: 5 }} />
                </div>
              ) : isPlaying ? (
                <Pause size={18} fill="white" />
              ) : (
                <Play size={18} fill="white" style={{ marginLeft: 2 }} />
              )}
            </button>
            <button className="btn-icon" aria-label="Next track" onClick={next}>
              <SkipForward size={17} />
            </button>
            <button
              className="btn-icon hidden sm:flex"
              aria-label={`Shuffle ${shuffle ? 'on' : 'off'}`}
              onClick={toggleShuffle}
              style={{ color: shuffle ? 'var(--color-play)' : undefined }}
            >
              <Shuffle size={15} />
            </button>
          </div>

          {/* Seek bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] tabular-nums flex-shrink-0" style={{ color: 'var(--color-text-muted)', minWidth: 28, textAlign: 'right' }}>
              {formattedCurrent}
            </span>
            <div className="relative flex-1" style={{ height: 4 }}>
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${progress * 100}%`,
                  background: 'linear-gradient(90deg, var(--color-accent-from), var(--color-play))',
                  transition: 'width 150ms linear',
                }}
              />
              <input
                ref={seekRef}
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={progress}
                onChange={handleSeek}
                aria-label="Seek"
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                style={{ zIndex: 2 }}
              />
            </div>
            <span className="text-[11px] tabular-nums flex-shrink-0" style={{ color: 'var(--color-text-muted)', minWidth: 28 }}>
              {formattedDuration}
            </span>
          </div>
        </div>

        {/* Volume & Queue */}
        <div className="items-center gap-1.5 flex-shrink-0 hidden md:flex" style={{ width: 140, justifyContent: 'flex-end' }}>
          <button
            className="btn-icon"
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
          >
            {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <div className="relative" style={{ width: 64, height: 4 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${volume * 100}%`,
                background: 'linear-gradient(90deg, var(--color-accent-from), var(--color-play))',
              }}
            />
            <input
              ref={volRef}
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              aria-label="Volume"
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              style={{ zIndex: 2 }}
            />
          </div>
          <button className="btn-icon" aria-label="Queue" title={`Queue (${queue.length})`}>
            <ListMusic size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerBar
