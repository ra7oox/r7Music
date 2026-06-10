import { useRef, useEffect, useCallback } from 'react'
import { usePlayerStore } from '@/store/playerStore'

const FFT_SIZE = 64

export const useAudioVisualizer = () => {
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const rafRef = useRef(null)
  const dataRef = useRef(new Uint8Array(FFT_SIZE / 2))
  const canvasRef = useRef(null)

  const setup = useCallback(() => {
    const audioEl = document.querySelector('audio')
    if (!audioEl || !audioEl.srcObject) return

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContext()
      const src = ctx.createMediaElementSource(audioEl)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = FFT_SIZE
      analyser.smoothingTimeConstant = 0.8
      src.connect(analyser)
      analyser.connect(ctx.destination)
      analyserRef.current = analyser
      sourceRef.current = src
    } catch {
      // not supported or already connected
    }
  }, [])

  const getFrequencyData = useCallback(() => {
    if (!analyserRef.current) return null
    analyserRef.current.getByteFrequencyData(dataRef.current)
    return dataRef.current
  }, [])

  return { setup, getFrequencyData, canvasRef }
}
