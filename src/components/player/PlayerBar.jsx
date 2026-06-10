import { useCallback, useRef, useState } from 'react'
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1,
  Volume2, VolumeX, Heart, ChevronUp, Share2,
} from 'lucide-react'
import { usePlayer } from '@/hooks/usePlayer'
import { usePlayerStore } from '@/store/playerStore'
import { useFavorites } from '@/hooks/useFavorites'
import { AudioVisualizer } from './AudioVisualizer'
import { ParallaxBg } from './ParallaxBg'

const formatTime = (s) => {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export const PlayerBar = () => {
  const {
    currentTrack, isPlaying, isLoading, shuffle, repeat, volume, progress,
    duration, currentTime,
    togglePlay, next, prev, seekTo,
    setVolume, toggleShuffle, toggleRepeat, queue,
  } = usePlayer()
  const toggleNowPlaying = usePlayerStore((s) => s.toggleNowPlaying)
  const { isFavorite, toggleFavorite } = useFavorites()

  const seekRef = useRef(null)
  const volRef = useRef(null)
  const [showVol, setShowVol] = useState(false)
  const [hoverTime, setHoverTime] = useState(null)
  const [hoverPos, setHoverPos] = useState(null)

  if (!currentTrack) return null

  const isFav = isFavorite(currentTrack.id)

  const handleSeek = useCallback(() => seekTo(parseFloat(seekRef.current?.value || 0)), [seekTo])
  const handleVolume = useCallback(() => setVolume(parseFloat(volRef.current?.value || 0.8)), [setVolume])

  const handleSeekHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    setHoverPos(ratio * 100)
    setHoverTime(formatTime(ratio * duration))
  }
  const handleSeekLeave = () => { setHoverTime(null); setHoverPos(null) }
  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    seekTo((e.clientX - rect.left) / rect.width)
  }

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
      {/* Parallax background */}
      <ParallaxBg imageUrl={currentTrack.album_image} isVisible={isPlaying} />

      <div className="player-bar" role="region" aria-label="Music player">

        {/* ═══ MOBILE ═══ */}
        <div className="md:hidden w-full">
          {/* Seek strip */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 2 }}>
            <div className="progress-track" style={{ height: 3, borderRadius: 0 }}>
              <div className="progress-fill" style={{ width: `${progress * 100}%`, height: 3, borderRadius: 0 }} />
            </div>
            <input ref={seekRef} type="range" min={0} max={1} step={0.001} value={progress}
              onChange={handleSeek} aria-label="Seek"
              style={{ position: 'absolute', inset: 0, opacity: 0, zIndex: 3, margin: 0, cursor: 'pointer' }} />
          </div>

          <div className="flex items-center gap-2 w-full px-2" style={{ paddingTop: 4 }}>
            <button className="flex items-center gap-3 min-w-0 flex-1 text-left"
              onClick={toggleNowPlaying} aria-label="Open now playing"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              {currentTrack.album_image ? (
                <img src={currentTrack.album_image} alt="" className="rounded flex-shrink-0"
                  style={{ width: 48, height: 48, objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} />
              ) : (
                <div className="rounded flex-shrink-0" style={{ width: 48, height: 48, background: 'var(--color-bg-card)' }} />
              )}
              <div className="min-w-0">
                <p className="font-semibold truncate" style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                  {currentTrack.name}
                </p>
                <p className="truncate mt-0.5" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  {currentTrack.artist_name}
                </p>
              </div>
            </button>

            <div className="flex items-center gap-1.5">
              <button className="btn-icon" onClick={() => toggleFavorite(currentTrack)} aria-label={isFav ? 'Unlike' : 'Like'}
                style={{ width: 32, height: 32, color: isFav ? 'var(--color-accent)' : undefined }}>
                <Heart size={16} fill={isFav ? 'currentColor' : 'none'} strokeWidth={1.8} />
              </button>
              <button className="btn-play" onClick={togglePlay} disabled={isLoading} aria-label={isPlaying ? 'Pause' : 'Play'}
                style={{ width: 42, height: 42 }}>
                {isLoading ? (
                  <div className="flex items-end gap-[2px]" style={{ height: 12 }}>
                    {[1,2,3].map(i => <div key={i} className="equalizer-bar" style={{ height: [5,9,4][i-1], background: '#000' }} />)}
                  </div>
                ) : isPlaying ? <Pause size={17} fill="white" /> : <Play size={17} fill="white" style={{ marginLeft: 1 }} />}
              </button>
              <button className="btn-icon" onClick={next} aria-label="Next" style={{ width: 32, height: 32 }}>
                <SkipForward size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ DESKTOP ═══ */}
        <div className="hidden md:flex items-center w-full" style={{ gap: 12 }}>
          {/* Left — Track info + Like + Share */}
          <div className="flex items-center gap-3 min-w-0" style={{ flex: '0 0 280px' }}>
            <button onClick={toggleNowPlaying} aria-label="Open now playing"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div className="relative flex-shrink-0">
                <img src={currentTrack.album_image || ''} alt=""
                  className="rounded flex-shrink-0"
                  style={{ width: 56, height: 56, objectFit: 'cover', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }} />
                {isPlaying && (
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center"
                    style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)' }}>
                    <AudioVisualizer barCount={3} height={10} className="gap-[1.5px]" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate" style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                  {currentTrack.name}
                </p>
                <p className="truncate mt-0.5" style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  {currentTrack.artist_name}
                </p>
              </div>
            </button>

            <button className="btn-icon flex-shrink-0" onClick={() => toggleFavorite(currentTrack)}
              aria-label={isFav ? 'Unlike' : 'Like'}
              style={{ color: isFav ? 'var(--color-accent)' : undefined }}>
              <Heart size={16} fill={isFav ? 'currentColor' : 'none'} strokeWidth={1.8} />
            </button>
            <button className="btn-icon flex-shrink-0" onClick={handleShare} aria-label="Share track" title="Share">
              <Share2 size={15} />
            </button>
          </div>

          {/* Center — Controls + Seeker */}
          <div className="flex flex-col items-center gap-1.5 flex-1" style={{ maxWidth: 600 }}>
            {/* Transport controls + visualizer */}
            <div className="flex items-center gap-4">
              <button className="btn-icon" onClick={toggleShuffle} aria-label={`Shuffle ${shuffle ? 'on' : 'off'}`}
                style={{ color: shuffle ? 'var(--color-accent)' : undefined }}>
                <Shuffle size={15} />
                {shuffle && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: 'var(--color-accent)' }} />}
              </button>
              <button className="btn-icon" onClick={prev} aria-label="Previous"><SkipBack size={19} /></button>

              <button className="btn-play" onClick={togglePlay} disabled={isLoading} aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isLoading ? (
                  <div className="flex items-end gap-[2px]" style={{ height: 14 }}>
                    {[6,10,5].map((h, i) => <div key={i} className="equalizer-bar" style={{ height: h, background: '#000' }} />)}
                  </div>
                ) : isPlaying ? (
                  <Pause size={20} fill="white" />
                ) : (
                  <Play size={20} fill="white" style={{ marginLeft: 2 }} />
                )}
              </button>

              <button className="btn-icon" onClick={next} aria-label="Next"><SkipForward size={19} /></button>
              <button className="btn-icon" onClick={toggleRepeat} aria-label={`Repeat ${repeat}`}
                style={{ color: repeat !== 'none' ? 'var(--color-accent)' : undefined }}>
                {repeat === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
                {repeat !== 'none' && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: 'var(--color-accent)' }} />}
              </button>
            </div>

            {/* Seek bar with time preview */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-[11px] tabular-nums flex-shrink-0" style={{ minWidth: 32, textAlign: 'right', color: 'var(--color-text-muted)' }}>
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 group/seek"
                style={{ height: 20, display: 'flex', alignItems: 'center' }}
                onMouseMove={handleSeekHover}
                onMouseLeave={handleSeekLeave}
                onClick={handleSeekClick}>
                {/* Track background */}
                <div className="absolute inset-x-0 rounded-full" style={{ height: 3, background: 'rgba(255,255,255,0.08)', transition: 'height 120ms' }} />
                {/* Fill */}
                <div className="absolute left-0 rounded-full progress-fill"
                  style={{ width: `${progress * 100}%`, height: 3, transition: 'height 120ms' }} />
                {/* Hover preview dot */}
                {hoverTime && (
                  <>
                    <div className="absolute top-0 rounded-full bg-white"
                      style={{ left: `${hoverPos}%`, width: 6, height: 6, transform: 'translate(-50%, -50%)', zIndex: 3,
                        boxShadow: '0 0 0 3px var(--color-accent-glow)' }} />
                    <div className="absolute -top-7 px-2 py-0.5 rounded text-[10px] font-medium tabular-nums whitespace-nowrap"
                      style={{ left: `${hoverPos}%`, transform: 'translateX(-50%)',
                        background: 'var(--color-bg-card)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
                      {hoverTime}
                    </div>
                  </>
                )}
                {/* Slider input */}
                <input ref={seekRef} type="range" min={0} max={1} step={0.001} value={progress}
                  onChange={handleSeek} aria-label="Seek"
                  className="absolute inset-0 w-full opacity-0 cursor-pointer" style={{ zIndex: 2, margin: 0 }} />
              </div>

              <span className="text-[11px] tabular-nums flex-shrink-0" style={{ minWidth: 32, color: 'var(--color-text-muted)' }}>
                {formatTime(duration)}
              </span>

              {/* Visualizer inside center block */}
              {isPlaying && <AudioVisualizer barCount={6} height={16} className="flex-shrink-0" />}
            </div>
          </div>

          {/* Right — Volume (vertical on hover) */}
          <div className="flex items-center justify-end gap-2" style={{ flex: '0 0 200px' }}>
            <div className="relative flex items-center"
              onMouseEnter={() => setShowVol(true)}
              onMouseLeave={() => setShowVol(false)}>
              <button className="btn-icon" aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                onClick={() => setVolume(volume === 0 ? 0.8 : 0)}>
                {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              {/* Vertical volume slider */}
              {showVol && (
                <div className="absolute -top-28 left-1/2 -translate-x-1/2 flex items-center justify-center"
                  style={{
                    width: 36, height: 120,
                    background: 'rgba(13,13,13,0.95)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: 20,
                    border: '1px solid rgba(139,92,246,0.12)',
                    zIndex: 50,
                  }}>
                  <div className="relative" style={{ width: 4, height: 80 }}>
                    <div className="absolute inset-x-0 bottom-0 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', height: '100%' }} />
                    <div className="absolute inset-x-0 bottom-0 rounded-full progress-fill"
                      style={{ height: `${volume * 100}%`, transition: 'height 80ms' }} />
                    <input type="range" min={0} max={1} step={0.01} value={volume} ref={volRef}
                      onChange={handleVolume} aria-label="Volume"
                      className="volume-thumb"
                      style={{ position: 'absolute', inset: 0, opacity: 0, zIndex: 2, cursor: 'pointer', margin: 0,
                        writingMode: 'vertical-lr', direction: 'rtl' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Queue count */}
            {queue.length > 1 && (
              <span className="text-[11px] tabular-nums" style={{ color: 'var(--color-text-muted)' }}>
                {queue.length} {/* total */}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayerBar
