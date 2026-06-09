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
      <Header title="Tracks" />
      <div className="px-4 md:px-6 py-5 fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Music2 size={24} style={{ color: 'var(--color-accent-mid)' }} />
          <h2 className="section-heading" style={{ marginBottom: 0 }}>All Tracks</h2>
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
