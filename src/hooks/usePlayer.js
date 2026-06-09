import { usePlayerStore } from '@/store/playerStore'

export const usePlayer = () => {
  const {
    currentTrack,
    queue,
    currentIndex,
    isPlaying,
    isLoading,
    shuffle,
    repeat,
    volume,
    progress,
    duration,
    playTrack,
    play,
    pause,
    togglePlay,
    next,
    prev,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    clearQueue,
  } = usePlayerStore()

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const currentTime = progress * duration
  const formattedCurrent = formatTime(currentTime)
  const formattedDuration = formatTime(duration)

  return {
    currentTrack,
    queue,
    currentIndex,
    isPlaying,
    isLoading,
    shuffle,
    repeat,
    volume,
    progress,
    duration,
    currentTime,
    formattedCurrent,
    formattedDuration,
    playTrack,
    play,
    pause,
    togglePlay,
    next,
    prev,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    clearQueue,
  }
}
