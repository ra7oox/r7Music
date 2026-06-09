import { Music, X, ChevronDown } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import { usePlayer } from '@/hooks/usePlayer'

export const NowPlayingPanel = () => {
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const showNowPlaying = usePlayerStore((s) => s.showNowPlaying)
  const toggleNowPlaying = usePlayerStore((s) => s.toggleNowPlaying)
  const { isPlaying, formattedCurrent, formattedDuration, progress, togglePlay, seekTo } = usePlayer()

  if (!currentTrack || !showNowPlaying) return null

  return (
    <>
      {/* Desktop side panel */}
      <div
        className="hidden md:flex slide-up"
        style={{
          gridColumn: 3,
          gridRow: 1,
          width: 280,
          borderLeft: '1px solid var(--color-border)',
          background: 'rgba(12, 12, 26, 0.95)',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px 20px',
          paddingBottom: '96px',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button
          className="btn-icon"
          onClick={toggleNowPlaying}
          aria-label="Close now playing"
          style={{ position: 'absolute', top: 12, right: 12 }}
        >
          <X size={16} />
        </button>

        <div
          className={`rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl mb-6 ${isPlaying ? 'spin-album' : 'spin-album paused'}`}
          style={{ width: 200, height: 200 }}
        >
          {currentTrack.album_image ? (
            <img src={currentTrack.album_image} alt={`${currentTrack.album_name} cover`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(67,56,202,0.4), rgba(99,102,241,0.3))' }}>
              <Music size={48} style={{ color: 'var(--color-text-muted)' }} />
            </div>
          )}
        </div>

        <div className="text-center w-full mb-6">
          <h2 className="text-lg font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>{currentTrack.name}</h2>
          <p className="text-sm mt-1 truncate" style={{ color: 'var(--color-text-muted)' }}>{currentTrack.artist_name}</p>
          {currentTrack.album_name && (
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-muted)', opacity: 0.7 }}>{currentTrack.album_name}</p>
          )}
        </div>

        <div className="w-full mb-4">
          <div className="relative w-full mb-1" style={{ height: 4 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${progress * 100}%`, background: 'linear-gradient(90deg, var(--color-accent-from), var(--color-play))', transition: 'width 150ms linear' }} />
            <input type="range" min={0} max={1} step={0.001} value={progress} onChange={(e) => seekTo(parseFloat(e.target.value))} aria-label="Seek" className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ zIndex: 2 }} />
          </div>
          <div className="flex justify-between text-[11px] tabular-nums" style={{ color: 'var(--color-text-muted)' }}>
            <span>{formattedCurrent}</span>
            <span>{formattedDuration}</span>
          </div>
        </div>

        <button className="btn-play" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} style={{ width: 56, height: 56, boxShadow: isPlaying ? '0 0 30px rgba(34,197,94,0.5)' : undefined }}>
          {isPlaying ? (
            <div className="flex items-end gap-[3px]" style={{ height: 18 }}>
              <div className="equalizer-bar" style={{ height: 8 }} />
              <div className="equalizer-bar" style={{ height: 14 }} />
              <div className="equalizer-bar" style={{ height: 10 }} />
            </div>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
          )}
        </button>
      </div>

      {/* Mobile full-screen overlay */}
      <div
        className="md:hidden fixed inset-0 z-[200] flex flex-col items-center justify-center animate-fade-in"
        style={{
          background: 'rgba(8, 8, 15, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '24px',
          paddingBottom: '72px',
        }}
      >
        <button className="btn-icon" onClick={toggleNowPlaying} aria-label="Close" style={{ position: 'absolute', top: 16, left: 16 }}>
          <ChevronDown size={24} />
        </button>

        <div className={`rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl mb-8 ${isPlaying ? 'spin-album' : 'spin-album paused'}`} style={{ width: 240, height: 240, maxWidth: '70vw', maxHeight: '70vw' }}>
          {currentTrack.album_image ? (
            <img src={currentTrack.album_image} alt={`${currentTrack.album_name} cover`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(67,56,202,0.4), rgba(99,102,241,0.3))' }}>
              <Music size={56} style={{ color: 'var(--color-text-muted)' }} />
            </div>
          )}
        </div>

        <div className="text-center w-full mb-8 max-w-sm">
          <h2 className="text-xl font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>{currentTrack.name}</h2>
          <p className="text-base mt-2 truncate" style={{ color: 'var(--color-text-muted)' }}>{currentTrack.artist_name}</p>
          {currentTrack.album_name && (
            <p className="text-sm mt-1 truncate" style={{ color: 'var(--color-text-muted)', opacity: 0.7 }}>{currentTrack.album_name}</p>
          )}
        </div>

        <div className="w-full max-w-sm mb-8">
          <div className="relative w-full mb-1" style={{ height: 6 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${progress * 100}%`, background: 'linear-gradient(90deg, var(--color-accent-from), var(--color-play))', transition: 'width 150ms linear' }} />
            <input type="range" min={0} max={1} step={0.001} value={progress} onChange={(e) => seekTo(parseFloat(e.target.value))} aria-label="Seek" className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ zIndex: 2 }} />
          </div>
          <div className="flex justify-between text-xs tabular-nums" style={{ color: 'var(--color-text-muted)' }}>
            <span>{formattedCurrent}</span>
            <span>{formattedDuration}</span>
          </div>
        </div>

        <button className="btn-play" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} style={{ width: 64, height: 64, boxShadow: isPlaying ? '0 0 40px rgba(34,197,94,0.6)' : undefined }}>
          {isPlaying ? (
            <div className="flex items-end gap-[4px]" style={{ height: 22 }}>
              <div className="equalizer-bar" style={{ height: 10 }} />
              <div className="equalizer-bar" style={{ height: 16 }} />
              <div className="equalizer-bar" style={{ height: 12 }} />
            </div>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
          )}
        </button>
      </div>
    </>
  )
}

export default NowPlayingPanel
