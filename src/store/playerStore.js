import { create } from 'zustand'

const audio = new Audio()
audio.preload = 'auto'

let loadTimeout = null
let playingTrackId = null

// ── Audio Visualizer (AnalyserNode) ──────────────────────────────────────────
let analyserNode = null
let audioCtx = null

try {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  audioCtx = new AudioCtx()
  analyserNode = audioCtx.createAnalyser()
  analyserNode.fftSize = 128
  analyserNode.smoothingTimeConstant = 0.8
  const srcNode = audioCtx.createMediaElementSource(audio)
  srcNode.connect(analyserNode)
  // Don't connect analyser → destination to avoid double-audio.
  // Visualizer only reads, doesn't route to speakers.
} catch {}

// Resume AudioContext on first user gesture (browser policy)
const resumeAudioCtx = () => {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  document.removeEventListener('pointerdown', resumeAudioCtx, true)
  document.removeEventListener('keydown', resumeAudioCtx, true)
}
document.addEventListener('pointerdown', resumeAudioCtx, { once: true, capture: true })
document.addEventListener('keydown', resumeAudioCtx, { once: true, capture: true })

export const getFrequencyData = () => {
  if (!analyserNode) return null
  const data = new Uint8Array(analyserNode.frequencyBinCount)
  analyserNode.getByteFrequencyData(data)
  return data
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Media Session helpers ────────────────────────────────────────────────────
// Music note SVG used as notification artwork (avoids showing the app logo)
const MUSIC_NOTE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#1a1a2e"/>
  <defs>
    <linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4A8FE8"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#C8389A"/>
    </linearGradient>
  </defs>
  <!-- note head 1 -->
  <ellipse cx="160" cy="360" rx="70" ry="50" fill="url(#ng)"/>
  <!-- note head 2 -->
  <ellipse cx="352" cy="310" rx="70" ry="50" fill="url(#ng)"/>
  <!-- stems -->
  <rect x="218" y="140" width="26" height="230" rx="13" fill="url(#ng)"/>
  <rect x="410" y="90" width="26" height="228" rx="13" fill="url(#ng)"/>
  <!-- beam -->
  <path d="M218 140 L436 90 L436 130 L218 184 Z" fill="url(#ng)"/>
</svg>`

const MUSIC_NOTE_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(MUSIC_NOTE_SVG)}`

const MS_ARTWORK = [
  { src: MUSIC_NOTE_URL, sizes: '512x512', type: 'image/svg+xml' },
]

function updateMediaSession(track, isPlaying) {
  if (!('mediaSession' in navigator)) return
  if (track) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.name || 'Unknown',
      artist: track.artist_name || '',
      album: track.album_name || '',
      artwork: MS_ARTWORK,   // ← always the music note, never the app icon
    })
  }
  navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'
}

function registerMediaSessionHandlers() {
  if (!('mediaSession' in navigator)) return
  navigator.mediaSession.setActionHandler('play', () => usePlayerStore.getState().play())
  navigator.mediaSession.setActionHandler('pause', () => usePlayerStore.getState().pause())
  navigator.mediaSession.setActionHandler('previoustrack', () => usePlayerStore.getState().prev())
  navigator.mediaSession.setActionHandler('nexttrack', () => usePlayerStore.getState().next())
  navigator.mediaSession.setActionHandler('stop', () => usePlayerStore.getState().pause())
  navigator.mediaSession.setActionHandler('seekto', (details) => {
    if (details.seekTime !== undefined) {
      const { duration } = usePlayerStore.getState()
      const ratio = duration > 0 ? details.seekTime / duration : 0
      usePlayerStore.getState().seekTo(ratio)
    }
  })
}

registerMediaSessionHandlers()
// ─────────────────────────────────────────────────────────────────────────────

audio.addEventListener('ended', () => {
  const state = usePlayerStore.getState()
  if (!playingTrackId) return
  if (state.repeat === 'one') {
    audio.currentTime = 0
    audio.play()
    return
  }
  if (state.repeat === 'all' || state.currentIndex < state.queue.length - 1) {
    state.next()
  } else {
    state.pause()
    state._stopProgress()
    usePlayerStore.setState({ progress: 0 })
  }
})

audio.addEventListener('error', () => {
  if (!playingTrackId) return
  clearTimeout(loadTimeout)
  loadTimeout = null
  usePlayerStore.setState({ isLoading: false, isPlaying: false })
})

export const usePlayerStore = create((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  isLoading: false,
  shuffle: false,
  repeat: 'none',
  volume: 0.8,
  progress: 0,
  duration: 0,
  currentTrack: null,
  showNowPlaying: false,
  _progressInterval: null,

  _startProgress: () => {
    const { _progressInterval } = get()
    if (_progressInterval) clearInterval(_progressInterval)
    const interval = setInterval(() => {
      const { currentTrack } = get()
      if (!currentTrack || audio.paused) return
      const seek = audio.currentTime || 0
      const dur = audio.duration || 1
      set({ progress: seek / dur, duration: dur })
    }, 250)
    set({ _progressInterval: interval })
  },

  _stopProgress: () => {
    const { _progressInterval } = get()
    if (_progressInterval) clearInterval(_progressInterval)
    set({ _progressInterval: null })
  },

  playTrack: (track, queueTracks = null) => {
    const { queue } = get()
    let newQueue = queueTracks || queue
    let idx = newQueue.findIndex((t) => t.id === track.id)
    if (idx === -1) {
      newQueue = [track, ...queue]
      idx = 0
    }

    if (!track.audio) {
      console.error('No audio URL', track.id, track.name)
      set({ isLoading: false, isPlaying: false, currentTrack: track, queue: newQueue, currentIndex: idx })
      return
    }

    get()._stopProgress()
    audio.pause()

    set({ isLoading: true, isPlaying: false, progress: 0, duration: 0, currentTrack: track, showNowPlaying: true, queue: newQueue, currentIndex: idx })

    if (loadTimeout) clearTimeout(loadTimeout)
    loadTimeout = setTimeout(() => {
      if (get().isLoading) {
        console.warn('Track load timeout', track.id, track.name)
        set({ isLoading: false, isPlaying: false })
        playingTrackId = null
      }
    }, 20000)

    playingTrackId = track.id
    audio.src = track.audio
    audio.volume = get().volume

    const onCanPlay = () => {
      if (playingTrackId !== track.id) return
      audio.removeEventListener('canplay', onCanPlay)
      clearTimeout(loadTimeout)
      loadTimeout = null
      const dur = audio.duration || 0
      set({ isLoading: false, duration: dur })
      updateMediaSession(track, false)
      audio.play().then(() => {
        set({ isPlaying: true })
        updateMediaSession(track, true)
        get()._startProgress()
      }).catch(() => {
        set({ isPlaying: false })
        const retry = () => {
          if (playingTrackId !== track.id) return
          audio.play().then(() => {
            set({ isPlaying: true })
            get()._startProgress()
          }).catch(() => {})
          document.removeEventListener('pointerdown', retry, true)
          document.removeEventListener('keydown', retry, true)
        }
        document.addEventListener('pointerdown', retry, { once: true, capture: true })
        document.addEventListener('keydown', retry, { once: true, capture: true })
      })
    }

    audio.addEventListener('canplay', onCanPlay, { once: true })
    audio.load()
  },

  play: () => {
    if (!audio.src) return
    const { currentTrack } = get()
    if (!currentTrack) return
    playingTrackId = currentTrack.id
    audio.play().then(() => {
      set({ isPlaying: true })
      updateMediaSession(currentTrack, true)
      get()._startProgress()
    }).catch(() => {})
  },

  pause: () => {
    audio.pause()
    set({ isPlaying: false })
    updateMediaSession(get().currentTrack, false)
    get()._stopProgress()
  },

  togglePlay: () => {
    const { isPlaying } = get()
    isPlaying ? get().pause() : get().play()
  },

  next: () => {
    const { queue, currentIndex, shuffle } = get()
    if (queue.length === 0) return
    let nextIdx
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length)
    } else {
      nextIdx = (currentIndex + 1) % queue.length
    }
    get().playTrack(queue[nextIdx])
    set({ currentIndex: nextIdx })
  },

  prev: () => {
    const { queue, currentIndex } = get()
    if (queue.length === 0) return
    if (audio.currentTime > 3) {
      audio.currentTime = 0
      set({ progress: 0 })
      return
    }
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : queue.length - 1
    get().playTrack(queue[prevIdx])
    set({ currentIndex: prevIdx })
  },

  seekTo: (ratio) => {
    const { duration } = get()
    audio.currentTime = ratio * duration
    set({ progress: ratio })
  },

  setVolume: (vol) => {
    audio.volume = vol
    set({ volume: vol })
  },

  toggleNowPlaying: () => set((s) => ({ showNowPlaying: !s.showNowPlaying })),

  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

  toggleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === 'none' ? 'all' : s.repeat === 'all' ? 'one' : 'none',
    })),

  addToQueue: (track) =>
    set((s) => ({ queue: [...s.queue, track] })),

  clearQueue: () => {
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
    playingTrackId = null
    set({ queue: [], currentIndex: -1, isPlaying: false, currentTrack: null, showNowPlaying: false, progress: 0, duration: 0 })
    get()._stopProgress()
  },
}))
