import { useEffect } from 'react'
import { usePlayerStore } from '@/store/playerStore'

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handler = (e) => {
      const active = document.activeElement?.tagName
      if (active === 'INPUT' || active === 'TEXTAREA' || active === 'SELECT') return

      const store = usePlayerStore.getState()
      const { isPlaying, currentTrack } = store

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          if (currentTrack) store.togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          store.prev()
          break
        case 'ArrowRight':
          e.preventDefault()
          store.next()
          break
        case 'KeyM':
          e.preventDefault()
          store.setVolume(store.volume > 0 ? 0 : 0.8)
          break
        case 'KeyS':
          e.preventDefault()
          store.toggleShuffle()
          break
        case 'KeyR':
          e.preventDefault()
          store.toggleRepeat()
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}

/* ── Mobile swipe gesture ──────────────────────────────────────────────────── */
export const useSwipeGesture = (ref, { onSwipeLeft, onSwipeRight, threshold = 60 } = {}) => {
  useEffect(() => {
    const el = ref?.current
    if (!el) return

    let startX = 0
    let startY = 0

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy) * 1.5) {
        dx > 0 ? onSwipeRight?.() : onSwipeLeft?.()
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [ref, onSwipeLeft, onSwipeRight, threshold])
}
