import { Music, X, ChevronDown, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Heart, Share2 } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import { usePlayer } from '@/hooks/usePlayer'
import { useFavorites } from '@/hooks/useFavorites'
import { AudioVisualizer } from './AudioVisualizer'

const formatTime = (s) => {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export const NowPlayingPanel = () => {
  const currentTrack    = usePlayerStore((s) => s.currentTrack)
  const showNowPlaying  = usePlayerStore((s) => s.showNowPlaying)
  const toggleNowPlaying = usePlayerStore((s) => s.toggleNowPlaying)
  const {
    isPlaying, isLoading, shuffle, repeat, progress,
    duration, currentTime,
    togglePlay, seekTo, next, prev, toggleShuffle, toggleRepeat,
  } = usePlayer()
  const { isFavorite, toggleFavorite } = useFavorites()

  if (!currentTrack || !showNowPlaying) return null

  const isFav = isFavorite(currentTrack.id)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${currentTrack.name} — ${currentTrack.artist_name}`,
        url: currentTrack.audio || window.location.href,
      }).catch(() => {})
    }
  }

  return (
    <>
      {/* ── Desktop side panel ── */}
      <div className="hidden md:flex slide-left scroll-col glass-strong"
        style={{
          gridColumn: 3, gridRow: 1,
          width: 300,
          flexDirection: 'column', alignItems: 'center',
          padding: '28px 22px', paddingBottom: '96px',
          position: 'relative',
        }}>
        <button className="btn-icon" onClick={toggleNowPlaying} aria-label="Close"
          style={{ position: 'absolute', top: 14, right: 14 }}>
          <X size={15} />
        </button>

        {/* Ambient glow */}
        <div className="now-playing-ambient" style={{
          background: currentTrack.album_image
            ? `radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)`
            : undefined,
        }} />

        {/* Album art */}
        <div className="relative mb-5" style={{ width: 200, height: 200, flexShrink: 0 }}>
          <div className={`w-full h-full rounded-2xl overflow-hidden shadow-2xl ${isPlaying ? 'shadow-glow' : ''}`}
            style={{ transition: 'box-shadow 0.6s ease' }}>
            {currentTrack.album_image ? (
              <img src={currentTrack.album_image} alt={`${currentTrack.album_name} cover`}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))' }}>
                <Music size={48} style={{ color: 'var(--color-text-muted)' }} />
              </div>
            )}
          </div>
          {/* Visualizer overlay */}
          {isPlaying && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 glass rounded-full px-3 py-1.5"
              style={{ zIndex: 2 }}>
              <AudioVisualizer barCount={8} height={16} className="gap-[2px]" />
            </div>
          )}
        </div>

        {/* Track info */}
        <div className="text-center w-full mb-6 z-10">
          <h2 className="text-lg font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
            {currentTrack.name}
          </h2>
          <p className="text-sm mt-1 truncate" style={{ color: 'var(--color-text-secondary)' }}>
            {currentTrack.artist_name}
          </p>
          {currentTrack.album_name && (
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-muted)' }}>
              {currentTrack.album_name}
            </p>
          )}
        </div>

        {/* Seek bar */}
        <div className="w-full mb-5 z-10">
          <div className="relative w-full mb-1.5 progress-track" style={{ height: 4 }}>
            <div className="progress-fill absolute inset-y-0 left-0" style={{ width: `${progress * 100}%`, transition: 'width 150ms linear' }} />
            <input type="range" min={0} max={1} step={0.001} value={progress}
              onChange={(e) => seekTo(parseFloat(e.target.value))} aria-label="Seek"
              className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ zIndex: 2 }} />
          </div>
          <div className="flex justify-between text-[11px] tabular-nums" style={{ color: 'var(--color-text-muted)' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 z-10">
          <button className="btn-icon" onClick={toggleShuffle} aria-label={`Shuffle ${shuffle ? 'on' : 'off'}`}
            style={{ color: shuffle ? 'var(--color-accent)' : undefined }}>
            <Shuffle size={16} />
          </button>
          <button className="btn-icon" onClick={prev} aria-label="Previous"><SkipBack size={20} /></button>

          <button className="btn-play" onClick={togglePlay} disabled={isLoading} aria-label={isPlaying ? 'Pause' : 'Play'}
            style={{ width: 56, height: 56 }}>
            {isLoading ? (
              <div className="flex items-end gap-[3px]" style={{ height: 16 }}>
                {[8,13,6].map((h,i) => <div key={i} className="equalizer-bar" style={{ height: h, background: '#000' }} />)}
              </div>
            ) : isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            )}
          </button>

          <button className="btn-icon" onClick={next} aria-label="Next"><SkipForward size={20} /></button>
          <button className="btn-icon" onClick={toggleRepeat} aria-label={`Repeat ${repeat}`}
            style={{ color: repeat !== 'none' ? 'var(--color-accent)' : undefined }}>
            {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>

        {/* Extra actions */}
        <div className="flex items-center gap-2 mt-6 z-10">
          <button className="btn-icon" onClick={() => toggleFavorite(currentTrack)} aria-label={isFav ? 'Unlike' : 'Like'}
            style={{ width: 40, height: 40, color: isFav ? 'var(--color-accent)' : undefined }}>
            <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button className="btn-icon" onClick={handleShare} aria-label="Share" style={{ width: 40, height: 40 }}>
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* ── Mobile full-screen overlay ── */}
      <div className="md:hidden fixed inset-0 z-[200] flex flex-col items-center justify-center"
        style={{
          background: 'rgba(8,8,12,0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '24px', paddingBottom: '80px',
        }}>
        <button className="btn-icon" onClick={toggleNowPlaying} aria-label="Close"
          style={{ position: 'absolute', top: 16, left: 16 }}>
          <ChevronDown size={24} />
        </button>

        <div className="relative mb-8" style={{ width: '65vw', maxWidth: 280, aspectRatio: 1 }}>
          <div className={`w-full h-full rounded-2xl overflow-hidden shadow-2xl`}>
            {currentTrack.album_image ? (
              <img src={currentTrack.album_image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))' }}>
                <Music size={56} style={{ color: 'var(--color-text-muted)' }} />
              </div>
            )}
          </div>
          {isPlaying && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 glass rounded-full px-3 py-1.5">
              <AudioVisualizer barCount={8} height={14} className="gap-[2px]" />
            </div>
          )}
        </div>

        <div className="text-center w-full mb-8 max-w-sm z-10">
          <h2 className="text-xl font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>{currentTrack.name}</h2>
          <p className="text-base mt-2 truncate" style={{ color: 'var(--color-text-secondary)' }}>{currentTrack.artist_name}</p>
          {currentTrack.album_name && (
            <p className="text-sm mt-1 truncate" style={{ color: 'var(--color-text-muted)' }}>{currentTrack.album_name}</p>
          )}
        </div>

        <div className="w-full max-w-sm mb-8">
          <div className="relative w-full mb-1.5 progress-track" style={{ height: 5 }}>
            <div className="progress-fill absolute inset-y-0 left-0" style={{ width: `${progress * 100}%`, transition: 'width 150ms linear' }} />
            <input type="range" min={0} max={1} step={0.001} value={progress}
              onChange={(e) => seekTo(parseFloat(e.target.value))} aria-label="Seek"
              className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ zIndex: 2 }} />
          </div>
          <div className="flex justify-between text-xs tabular-nums" style={{ color: 'var(--color-text-muted)' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 z-10">
          <button className="btn-icon" onClick={prev} aria-label="Previous"><SkipBack size={22} /></button>
          <button className="btn-play" onClick={togglePlay} disabled={isLoading} aria-label={isPlaying ? 'Pause' : 'Play'}
            style={{ width: 64, height: 64 }}>
            {isPlaying ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/>
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            )}
          </button>
          <button className="btn-icon" onClick={next} aria-label="Next"><SkipForward size={22} /></button>
        </div>

        <div className="flex items-center gap-4 mt-6 z-10">
          <button className="btn-icon" onClick={() => toggleFavorite(currentTrack)} aria-label={isFav ? 'Unlike' : 'Like'}
            style={{ color: isFav ? 'var(--color-accent)' : undefined }}>
            <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button className="btn-icon" onClick={handleShare} aria-label="Share">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </>
  )
}

export default NowPlayingPanel
