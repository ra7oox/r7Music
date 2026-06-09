import { Music, X, ChevronDown, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, Heart } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import { usePlayer } from '@/hooks/usePlayer'
import { useFavorites } from '@/hooks/useFavorites'

export const NowPlayingPanel = () => {
  const currentTrack    = usePlayerStore((s) => s.currentTrack)
  const showNowPlaying  = usePlayerStore((s) => s.showNowPlaying)
  const toggleNowPlaying = usePlayerStore((s) => s.toggleNowPlaying)
  const {
    isPlaying, isLoading, shuffle, repeat, volume,
    formattedCurrent, formattedDuration, progress,
    togglePlay, seekTo, next, prev, toggleShuffle, toggleRepeat, setVolume,
  } = usePlayer()
  const { isFavorite, toggleFavorite } = useFavorites()

  if (!currentTrack || !showNowPlaying) return null

  const isFav = isFavorite(currentTrack.id)

  const PlayPauseBtn = ({ size = 52 }) => (
    <button
      className="btn-play"
      onClick={togglePlay}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      disabled={isLoading}
      style={{ width: size, height: size, animation: isPlaying ? 'glowPulse 2.5s ease-in-out infinite' : undefined }}
    >
      {isLoading ? (
        <div className="flex items-end gap-[3px]" style={{ height: size * 0.35 }}>
          <div className="equalizer-bar" style={{ height: size * 0.16 }} />
          <div className="equalizer-bar" style={{ height: size * 0.28 }} />
          <div className="equalizer-bar" style={{ height: size * 0.20 }} />
        </div>
      ) : isPlaying ? (
        <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" fill="white">
          <rect x="5" y="3" width="4" height="18" rx="1"/>
          <rect x="15" y="3" width="4" height="18" rx="1"/>
        </svg>
      ) : (
        <svg width={size * 0.40} height={size * 0.40} viewBox="0 0 24 24" fill="white">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
      )}
    </button>
  )

  const SeekBar = ({ height = 5 }) => (
    <div className="w-full">
      <div className="relative w-full mb-1.5" style={{ height }}>
        <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div
          className="absolute inset-y-0 left-0 rounded-full progress-fill"
          style={{ width: `${progress * 100}%`, transition: 'width 150ms linear' }}
        />
        <input
          type="range" min={0} max={1} step={0.001} value={progress}
          onChange={(e) => seekTo(parseFloat(e.target.value))}
          aria-label="Seek"
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
        />
      </div>
      <div className="flex justify-between" style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
        <span className="tabular-nums">{formattedCurrent}</span>
        <span className="tabular-nums">{formattedDuration}</span>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop side panel ── */}
      <div
        className="hidden md:flex slide-left"
        style={{
          gridColumn: 3,
          gridRow: 1,
          width: 300,
          borderLeft: '1px solid var(--color-border)',
          background: 'rgba(9,9,15,0.97)',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 22px',
          paddingBottom: '96px',
          overflowY: 'auto',
          position: 'relative',
          backdropFilter: 'blur(30px)',
        }}
      >
        <button
          className="btn-icon"
          onClick={toggleNowPlaying}
          aria-label="Close now playing"
          style={{ position: 'absolute', top: 14, right: 14 }}
        >
          <X size={15} />
        </button>

        {/* Label */}
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--color-text-muted)' }}>
          Now Playing
        </p>

        {/* Album art */}
        <div className="relative mb-7 flex-shrink-0" style={{ width: 220, height: 220 }}>
          {/* Ambient glow behind art */}
          <div
            className="now-playing-ambient"
            style={{ background: 'radial-gradient(circle, rgba(200,56,154,0.5), rgba(124,63,228,0.3))' }}
          />
          <div
            className="relative rounded-2xl overflow-hidden glow-brand-lg"
            style={{ width: 220, height: 220, zIndex: 1 }}
          >
            {currentTrack.album_image ? (
              <img
                src={currentTrack.album_image}
                alt={`${currentTrack.album_name} cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(124,63,228,0.35), rgba(200,56,154,0.25))' }}>
                <Music size={52} style={{ color: 'var(--color-text-muted)' }} />
              </div>
            )}
          </div>
        </div>

        {/* Track info */}
        <div className="text-center w-full mb-5">
          <h2 className="font-bold truncate text-base" style={{ color: 'var(--color-text-primary)' }}>
            {currentTrack.name}
          </h2>
          <p className="text-sm mt-1 truncate" style={{ color: 'var(--color-text-muted)' }}>
            {currentTrack.artist_name}
          </p>
          {currentTrack.album_name && (
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-muted)', opacity: 0.65 }}>
              {currentTrack.album_name}
            </p>
          )}
        </div>

        {/* Favorite */}
        <div className="flex items-center justify-end w-full mb-4">
          <button
            className="btn-icon"
            onClick={() => toggleFavorite(currentTrack)}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={16} fill={isFav ? 'var(--color-brand-to)' : 'none'} stroke={isFav ? 'var(--color-brand-to)' : 'currentColor'} />
          </button>
        </div>

        {/* Seek */}
        <div className="w-full mb-6">
          <SeekBar height={5} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-6">
          <button className="btn-icon" onClick={toggleShuffle} aria-label={`Shuffle ${shuffle ? 'on' : 'off'}`}
            style={{ color: shuffle ? 'var(--color-brand-to)' : undefined }}>
            <Shuffle size={15} />
          </button>
          <button className="btn-icon" aria-label="Previous" onClick={prev}>
            <SkipBack size={19} />
          </button>
          <PlayPauseBtn size={52} />
          <button className="btn-icon" aria-label="Next" onClick={next}>
            <SkipForward size={19} />
          </button>
          <button className="btn-icon" onClick={toggleRepeat} aria-label={`Repeat ${repeat}`}
            style={{ color: repeat !== 'none' ? 'var(--color-brand-to)' : undefined }}>
            {repeat === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-full">
          <Volume2 size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <div className="relative flex-1" style={{ height: 4 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute inset-y-0 left-0 rounded-full progress-fill" style={{ width: `${volume * 100}%` }} />
            <input
              type="range" min={0} max={1} step={0.01} value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume"
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              style={{ zIndex: 2 }}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile full-screen overlay ── */}
      <div
        className="md:hidden fixed inset-0 z-[200] flex flex-col fade-in"
        style={{
          background: 'rgba(9, 9, 15, 0.98)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-12 pb-4">
          <button className="btn-icon" onClick={toggleNowPlaying} aria-label="Close">
            <ChevronDown size={22} />
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            Now Playing
          </p>
          <button
            className="btn-icon"
            onClick={() => toggleFavorite(currentTrack)}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={17} fill={isFav ? 'var(--color-brand-to)' : 'none'} stroke={isFav ? 'var(--color-brand-to)' : 'currentColor'} />
          </button>
        </div>

        {/* Album art — large */}
        <div className="flex justify-center px-8 py-4 flex-1 items-center">
          <div className="relative" style={{ maxWidth: 320, width: '100%', aspectRatio: '1' }}>
            <div
              className="now-playing-ambient"
              style={{ background: 'radial-gradient(circle, rgba(200,56,154,0.45), rgba(124,63,228,0.25))' }}
            />
            <div
              className="relative rounded-3xl overflow-hidden glow-brand-lg w-full h-full"
              style={{ zIndex: 1 }}
            >
              {currentTrack.album_image ? (
                <img
                  src={currentTrack.album_image}
                  alt={`${currentTrack.album_name} cover`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(124,63,228,0.35), rgba(200,56,154,0.25))' }}>
                  <Music size={72} style={{ color: 'var(--color-text-muted)' }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="px-6 pb-6" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
          {/* Track info */}
          <div className="mb-6">
            <h2 className="text-xl font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
              {currentTrack.name}
            </h2>
            <p className="text-base mt-1.5 truncate" style={{ color: 'var(--color-text-muted)' }}>
              {currentTrack.artist_name}
            </p>
          </div>

          {/* Seek */}
          <div className="mb-6">
            <SeekBar height={6} />
          </div>

          {/* Main controls */}
          <div className="flex items-center justify-between mb-6">
            <button className="btn-icon" onClick={toggleShuffle} aria-label={`Shuffle ${shuffle ? 'on' : 'off'}`}
              style={{ color: shuffle ? 'var(--color-brand-to)' : undefined }}>
              <Shuffle size={19} />
            </button>
            <button className="btn-icon" aria-label="Previous" onClick={prev} style={{ width: 44, height: 44 }}>
              <SkipBack size={26} />
            </button>
            <PlayPauseBtn size={64} />
            <button className="btn-icon" aria-label="Next" onClick={next} style={{ width: 44, height: 44 }}>
              <SkipForward size={26} />
            </button>
            <button className="btn-icon" onClick={toggleRepeat} aria-label={`Repeat ${repeat}`}
              style={{ color: repeat !== 'none' ? 'var(--color-brand-to)' : undefined }}>
              {repeat === 'one' ? <Repeat1 size={19} /> : <Repeat size={19} />}
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3">
            <Volume2 size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <div className="relative flex-1" style={{ height: 4 }}>
              <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="absolute inset-y-0 left-0 rounded-full progress-fill" style={{ width: `${volume * 100}%` }} />
              <input
                type="range" min={0} max={1} step={0.01} value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                aria-label="Volume"
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                style={{ zIndex: 2 }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NowPlayingPanel
