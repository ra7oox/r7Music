import { Play, Pause, Music, X, ChevronDown, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Heart, Share2, Music2 } from 'lucide-react'
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
          width: 320,
          flexDirection: 'column', alignItems: 'center',
          padding: '32px 24px', paddingBottom: '110px',
          position: 'relative',
          borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
          zIndex: 10,
        }}>
        <button className="btn-icon" onClick={toggleNowPlaying} aria-label="Close"
          style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32 }}>
          <X size={15} />
        </button>

        <span className="badge badge-brand mb-6 inline-flex items-center gap-1.5 px-3 py-1 font-semibold tracking-wider text-[10px] uppercase">
          <Music2 size={10} className="text-[#7C3FE4]" />
          Now Playing
        </span>

        {/* Album art floating with glow */}
        <div className="relative mb-6 group" style={{ width: 220, height: 220, flexShrink: 0 }}>
          <div className={`w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-102 ${isPlaying ? 'shadow-glow' : ''}`}>
            {currentTrack.album_image ? (
              <img src={currentTrack.album_image} alt={`${currentTrack.album_name} cover`}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(74, 143, 232, 0.2), rgba(200, 56, 154, 0.2))' }}>
                <Music size={48} style={{ color: 'var(--color-text-muted)' }} />
              </div>
            )}
          </div>
          {/* Ambient blurred reflection behind the cover */}
          {currentTrack.album_image && (
            <div className="absolute inset-0 rounded-2xl -z-10 blur-2xl opacity-60 scale-95 transition-opacity"
              style={{
                background: `url(${currentTrack.album_image})`,
                backgroundSize: 'cover',
              }} />
          )}
          
          {/* Visualizer overlay */}
          {isPlaying && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 glass rounded-full px-3 py-1.5 shadow-lg"
              style={{ zIndex: 2 }}>
              <AudioVisualizer barCount={8} height={16} className="gap-[2px]" />
            </div>
          )}
        </div>

        {/* Track info */}
        <div className="text-center w-full mb-6 z-10">
          <h2 className="text-lg font-extrabold truncate text-white tracking-tight">
            {currentTrack.name}
          </h2>
          <p className="text-sm font-semibold mt-1 truncate" style={{ color: 'var(--color-text-secondary)' }}>
            {currentTrack.artist_name}
          </p>
          {currentTrack.album_name && (
            <p className="text-xs mt-1 truncate opacity-60" style={{ color: 'var(--color-text-muted)' }}>
              {currentTrack.album_name}
            </p>
          )}
        </div>

        {/* Seek bar */}
        <div className="w-full mb-6 z-10">
          <div className="relative w-full mb-2 progress-track" style={{ height: 4 }}>
            <div className="progress-fill absolute inset-y-0 left-0" style={{ width: `${progress * 100}%`, transition: 'width 150ms linear' }} />
            <input type="range" min={0} max={1} step={0.001} value={progress}
              onChange={(e) => seekTo(parseFloat(e.target.value))} aria-label="Seek"
              className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ zIndex: 2 }} />
          </div>
          <div className="flex justify-between text-[11px] font-semibold tabular-nums" style={{ color: 'var(--color-text-secondary)' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3.5 z-10">
          <button className="btn-icon relative" onClick={toggleShuffle} aria-label={`Shuffle ${shuffle ? 'on' : 'off'}`}
            style={{ width: 36, height: 36, color: shuffle ? '#4A8FE8' : undefined, borderColor: shuffle ? 'rgba(74,143,232,0.15)' : undefined }}>
            <Shuffle size={16} />
            {shuffle && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4A8FE8]" />}
          </button>
          <button className="btn-icon" onClick={prev} aria-label="Previous" style={{ width: 36, height: 36 }}><SkipBack size={18} /></button>

          <button className="btn-play" onClick={togglePlay} disabled={isLoading} aria-label={isPlaying ? 'Pause' : 'Play'}
            style={{ width: 52, height: 52 }}>
            {isLoading ? (
              <div className="flex items-end gap-[3px]" style={{ height: 16 }}>
                {[8,13,6].map((h,i) => <div key={i} className="equalizer-bar" style={{ height: h, background: '#fff' }} />)}
              </div>
            ) : isPlaying ? (
              <Pause size={20} fill="white" />
            ) : (
              <Play size={20} fill="white" style={{ marginLeft: 2 }} />
            )}
          </button>

          <button className="btn-icon" onClick={next} aria-label="Next" style={{ width: 36, height: 36 }}><SkipForward size={18} /></button>
          <button className="btn-icon relative" onClick={toggleRepeat} aria-label={`Repeat ${repeat}`}
            style={{ width: 36, height: 36, color: repeat !== 'none' ? '#7C3FE4' : undefined, borderColor: repeat !== 'none' ? 'rgba(124,63,228,0.15)' : undefined }}>
            {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            {repeat !== 'none' && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7C3FE4]" />}
          </button>
        </div>

        {/* Extra actions */}
        <div className="flex items-center gap-3 mt-8 z-10 w-full justify-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
          <button className="btn-icon" onClick={() => toggleFavorite(currentTrack)} aria-label={isFav ? 'Unlike' : 'Like'}
            style={{ width: 42, height: 42, color: isFav ? '#C8389A' : undefined, borderColor: isFav ? 'rgba(200,56,154,0.15)' : undefined }}>
            <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button className="btn-icon" onClick={handleShare} aria-label="Share" style={{ width: 42, height: 42 }}>
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* ── Mobile full-screen overlay ── */}
      <div className="md:hidden fixed inset-0 z-[200] flex flex-col items-center justify-center fade-in"
        style={{
          background: 'rgba(5, 4, 9, 0.96)',
          backdropFilter: 'blur(36px)',
          WebkitBackdropFilter: 'blur(36px)',
          padding: '24px', paddingBottom: '90px',
        }}>
        <button className="btn-icon" onClick={toggleNowPlaying} aria-label="Close"
          style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40 }}>
          <ChevronDown size={22} />
        </button>

        <span className="badge badge-brand mb-6 inline-flex items-center gap-1.5 px-3 py-1 font-semibold tracking-wider text-[10px] uppercase">
          <Music2 size={10} className="text-[#7C3FE4]" />
          Now Playing
        </span>

        <div className="relative mb-8 group" style={{ width: '70vw', maxWidth: 280, aspectRatio: 1 }}>
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {currentTrack.album_image ? (
              <img src={currentTrack.album_image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(74, 143, 232, 0.2), rgba(200, 56, 154, 0.2))' }}>
                <Music size={56} style={{ color: 'var(--color-text-muted)' }} />
              </div>
            )}
          </div>
          {currentTrack.album_image && (
            <div className="absolute inset-0 rounded-2xl -z-10 blur-2xl opacity-60 scale-95"
              style={{
                background: `url(${currentTrack.album_image})`,
                backgroundSize: 'cover',
              }} />
          )}
          {isPlaying && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 glass rounded-full px-3 py-1.5 shadow-lg">
              <AudioVisualizer barCount={8} height={14} className="gap-[2px]" />
            </div>
          )}
        </div>

        <div className="text-center w-full mb-8 max-w-sm z-10">
          <h2 className="text-xl font-extrabold truncate text-white tracking-tight">{currentTrack.name}</h2>
          <p className="text-base font-semibold mt-2 truncate text-brand-gradient">{currentTrack.artist_name}</p>
          {currentTrack.album_name && (
            <p className="text-sm mt-1 truncate opacity-60" style={{ color: 'var(--color-text-muted)' }}>{currentTrack.album_name}</p>
          )}
        </div>

        <div className="w-full max-w-sm mb-8">
          <div className="relative w-full mb-2 progress-track" style={{ height: 4 }}>
            <div className="progress-fill absolute inset-y-0 left-0" style={{ width: `${progress * 100}%`, transition: 'width 150ms linear' }} />
            <input type="range" min={0} max={1} step={0.001} value={progress}
              onChange={(e) => seekTo(parseFloat(e.target.value))} aria-label="Seek"
              className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ zIndex: 2 }} />
          </div>
          <div className="flex justify-between text-xs font-semibold tabular-nums" style={{ color: 'var(--color-text-secondary)' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-5 z-10">
          <button className="btn-icon" onClick={prev} aria-label="Previous" style={{ width: 44, height: 44 }}><SkipBack size={20} /></button>
          <button className="btn-play" onClick={togglePlay} disabled={isLoading} aria-label={isPlaying ? 'Pause' : 'Play'}
            style={{ width: 60, height: 60 }}>
            {isPlaying ? (
              <Pause size={24} fill="white" />
            ) : (
              <Play size={24} fill="white" style={{ marginLeft: 2 }} />
            )}
          </button>
          <button className="btn-icon" onClick={next} aria-label="Next" style={{ width: 44, height: 44 }}><SkipForward size={20} /></button>
        </div>

        <div className="flex items-center gap-4 mt-8 z-10">
          <button className="btn-icon" onClick={() => toggleFavorite(currentTrack)} aria-label={isFav ? 'Unlike' : 'Like'}
            style={{ width: 44, height: 44, color: isFav ? '#C8389A' : undefined, borderColor: isFav ? 'rgba(200,56,154,0.15)' : undefined }}>
            <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button className="btn-icon" onClick={handleShare} aria-label="Share" style={{ width: 44, height: 44 }}>
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </>
  )
}

export default NowPlayingPanel
