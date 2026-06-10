import { useCallback, useRef, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { TrackCard } from './TrackCard'
import { TrackListSkeleton } from '@/components/ui/Skeleton'

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
    <div role="table" aria-label="Track list" className="w-full flex flex-col">
      {/* Table Header — aligned with the track rows */}
      <div
        className="hidden md:grid track-row border-b border-white/5 pb-2 mb-2 text-xs font-bold uppercase tracking-wider text-muted cursor-default hover:bg-transparent"
        style={{ pointerEvents: 'none' }}
      >
        <span className="text-center" style={{ color: 'var(--color-text-muted)' }}>#</span>
        <span style={{ color: 'var(--color-text-muted)' }}>Titre</span>
        <span style={{ color: 'var(--color-text-muted)' }}>Album</span>
        <span></span> {/* Empty space for actions */}
        <span className="text-right flex justify-end items-center pr-2" style={{ color: 'var(--color-text-muted)' }}>
          <Clock size={15} />
        </span>
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
