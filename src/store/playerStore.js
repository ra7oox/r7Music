import { create } from 'zustand'

const audio = new Audio()
audio.preload = 'auto'

let loadTimeout = null
let playingTrackId = null

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
      audio.play().then(() => {
        set({ isPlaying: true })
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
      get()._startProgress()
    }).catch(() => {})
  },

  pause: () => {
    audio.pause()
    set({ isPlaying: false })
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
