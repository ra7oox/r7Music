import { useQuery } from '@tanstack/react-query'
import { getAlbums, getArtists } from '@/services/jamendoService'
import { Header } from '@/components/layout/Header'
import { TrackList } from '@/components/tracks/TrackList'
import { AlbumGrid } from '@/components/albums/AlbumView'
import { ArtistGrid } from '@/components/artists/ArtistView'
import { useTracks } from '@/hooks/useTracks'
import { TrendingUp, Disc3, Users } from 'lucide-react'

export const DiscoverPage = () => {
  const {
    data: tracksPages,
    isLoading: tracksLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useTracks()

  const { data: albumsData, isLoading: albumsLoading } = useQuery({
    queryKey: ['albums-discover'],
    queryFn: () => getAlbums({ limit: 8 }),
    staleTime: 5 * 60 * 1000,
  })

  const { data: artistsData, isLoading: artistsLoading } = useQuery({
    queryKey: ['artists-discover'],
    queryFn: () => getArtists({ limit: 8 }),
    staleTime: 5 * 60 * 1000,
  })

  const tracks = tracksPages?.pages?.flatMap((p) => p.results) || []
  const albums = albumsData?.results || []
  const artists = artistsData?.results || []

  return (
    <>
      <Header title="Discover" />
      <div className="px-4 md:px-6 py-4 space-y-8">
        {/* Trending Tracks */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} style={{ color: 'var(--color-accent-mid)' }} />
            <h2 className="text-lg font-bold">Trending Tracks</h2>
          </div>
          <TrackList
            tracks={tracks}
            isLoading={tracksLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            queueTracks={tracks}
          />
        </section>

        {/* Popular Albums */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Disc3 size={20} style={{ color: 'var(--color-accent-mid)' }} />
            <h2 className="text-lg font-bold">Popular Albums</h2>
          </div>
          <AlbumGrid albums={albums} isLoading={albumsLoading} />
        </section>

        {/* Popular Artists */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} style={{ color: 'var(--color-accent-mid)' }} />
            <h2 className="text-lg font-bold">Popular Artists</h2>
          </div>
          <ArtistGrid artists={artists} isLoading={artistsLoading} />
        </section>
      </div>
    </>
  )
}

export default DiscoverPage
