import { Header } from '@/components/layout/Header'
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
      <Header title="All Tracks" />
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Music2 size={20} style={{ color: 'var(--color-accent-mid)' }} />
          <h2 className="text-lg font-bold">Browse Tracks</h2>
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
