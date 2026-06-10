import { TrackList } from '@/components/tracks/TrackList'
import { useTracks } from '@/hooks/useTracks'
import { Music2 } from 'lucide-react'

export const TracksPage = () => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useTracks()

  const tracks = data?.pages?.flatMap((p) => p.results) || []

  return (
    <>
      <div className="page-container fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 38,
              height: 38,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: `inset 0 0 10px rgba(124, 63, 228, 0.05)`,
            }}
          >
            <Music2 size={18} style={{ color: '#7C3FE4' }} />
          </div>
          <h2 className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-white font-display">
            All Tracks
          </h2>
        </div>
        <TrackList
          tracks={tracks}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          queueTracks={tracks}
        />
      </div>
    </>
  )
}

export default TracksPage
