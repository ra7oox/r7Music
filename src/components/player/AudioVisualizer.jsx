import { useEffect, useRef, useState } from 'react'
import { getFrequencyData } from '@/store/playerStore'

export const AudioVisualizer = ({ barCount = 16, height = 32, className = '' }) => {
  const [bars, setBars] = useState(() => Array(barCount).fill(0.05))
  const rafRef = useRef(null)

  useEffect(() => {
    const draw = () => {
      const data = getFrequencyData()
      if (data) {
        const len = data.length
        const step = Math.max(1, Math.floor(len / barCount))
        const next = []
        for (let i = 0; i < barCount; i++) {
          const idx = Math.min(i * step, len - 1)
          next.push(data[idx] / 255)
        }
        setBars(next)
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [barCount])

  return (
    <div className={`flex items-end gap-[2px] ${className}`} style={{ height }} aria-hidden>
      {bars.map((v, i) => (
        <div
          key={i}
          className="viz-bar"
          style={{
            height: `${Math.max(3, v * height * 1.2)}px`,
            transition: 'height 60ms linear',
            animationDelay: `${i * 0.02}s`,
            opacity: v > 0.05 ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}
