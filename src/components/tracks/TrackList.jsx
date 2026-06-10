import { useCallback, useRef, useEffect } from 'react'
import { TrackCard } from './TrackCard'
import { TrackListSkeleton } from '@/components/ui/Skeleton'
import { Clock } from 'lucide-react'

export const TrackList = ({
  tracks,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  queueTracks,
  emptyMessage = 'No tracks found',
}) => {
  const observerRef = useRef(null)

  const lastTrackRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage?.()
        }
      })
      if (node) observerRef.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  )

  useEffect(() => {
    return () => observerRef.current?.disconnect()
  }, [])

  if (isLoading) return <TrackListSkeleton count={10} />
  if (!tracks || tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div role="table" aria-label="Track list">
      {/* Table Header */}
      <div
        className="hidden sm:flex items-center gap-[14px] px-4 py-2.5 mb-3 text-xs font-bold tracking-wider uppercase border-b border-[rgba(255,255,255,0.05)]"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
      >
        <div className="flex-shrink-0 text-center" style={{ width: 24 }}>#</div>
        <div className="flex-1" style={{ paddingLeft: 58 }}>Titre</div>
        <div className="hidden lg:block flex-shrink-0" style={{ width: 180 }}>Album</div>
        <div className="flex-shrink-0 text-right" style={{ width: 120, paddingRight: 12 }}>
          <Clock size={13} style={{ display: 'inline-block', verticalAlign: 'middle', marginTop: -2 }} />
        </div>
      </div>

      {tracks.map((track, i) => {
        const isLast = i === tracks.length - 1
        return (
          <div key={track.id} ref={isLast ? lastTrackRef : undefined}>
            <TrackCard track={track} index={i} queueTracks={queueTracks} />
          </div>
        )
      })}
      {isFetchingNextPage && <TrackListSkeleton count={4} />}
    </div>
  )
}

export default TrackList
