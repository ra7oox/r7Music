import { useQuery } from '@tanstack/react-query'
import { getAlbums, getArtists } from '@/services/jamendoService'
import { Header } from '@/components/layout/Header'
import { TrackList } from '@/components/tracks/TrackList'
import { AlbumGrid } from '@/components/albums/AlbumView'
import { ArtistGrid } from '@/components/artists/ArtistView'
import { useTracks } from '@/hooks/useTracks'
import { usePlayer } from '@/hooks/usePlayer'
import { usePlayerStore } from '@/store/playerStore'
import { TrendingUp, Disc3, Users, Play, Music2 } from 'lucide-react'

/* ── Hero banner for the featured track ─────────────────────────────────── */
const FeaturedTrack = ({ track }) => {
  const { currentTrack, isPlaying } = usePlayer()
  const playTrack = usePlayerStore((s) => s.playTrack)
  if (!track) return null

  const isActive = currentTrack?.id === track.id

  return (
    <div
      className="relative overflow-hidden rounded-2xl mb-8 cursor-pointer group"
      style={{ minHeight: 200 }}
      onClick={() => playTrack(track)}
      role="button"
      tabIndex={0}
      aria-label={`Play ${track.name} by ${track.artist_name}`}
      onKeyDown={(e) => e.key === 'Enter' && playTrack(track)}
    >
      {/* Background image */}
      {track.album_image && (
        <img
          src={track.album_image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scale(1.05)', transition: 'transform 0.6s ease', filter: 'brightness(0.45)' }}
          aria-hidden
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: track.album_image
            ? 'linear-gradient(90deg, rgba(9,9,15,0.85) 0%, rgba(9,9,15,0.4) 60%, transparent 100%)'
            : 'linear-gradient(135deg, rgba(124,63,228,0.4), rgba(200,56,154,0.3))',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 flex items-center gap-6">
        {/* Cover thumbnail */}
        <div className="flex-shrink-0 hidden sm:block">
          <img
            src={track.album_image || ''}
            alt=""
            className="rounded-xl shadow-2xl"
            style={{ width: 100, height: 100, objectFit: 'cover' }}
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <span className="badge badge-brand mb-2 inline-flex">
            <Music2 size={9} />
            Featured Track
          </span>
          <h2 className="text-xl md:text-2xl font-bold truncate mb-1" style={{ color: '#fff' }}>
            {track.name}
          </h2>
          <p className="text-sm truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {track.artist_name}
            {track.album_name && ` · ${track.album_name}`}
          </p>
        </div>

        {/* Play button */}
        <button
          className="btn-play btn-play-lg flex-shrink-0 group-hover:scale-110 transition-transform"
          aria-label={isActive && isPlaying ? 'Pause' : 'Play'}
          style={{ width: 58, height: 58 }}
          onClick={(e) => { e.stopPropagation(); playTrack(track) }}
        >
          {isActive && isPlaying ? (
            <div className="flex items-end gap-[3px]" style={{ height: 16 }}>
              <div className="equalizer-bar" style={{ height: 8 }} />
              <div className="equalizer-bar" style={{ height: 13 }} />
              <div className="equalizer-bar" style={{ height: 6 }} />
            </div>
          ) : (
            <Play size={22} fill="white" style={{ marginLeft: 2 }} />
          )}
        </button>
      </div>
    </div>
  )
}

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-5">
    <Icon size={22} style={{ color: 'var(--color-accent-mid)' }} />
    <h2 className="section-heading" style={{ marginBottom: 0 }}>{title}</h2>
  </div>
)

/* ── Main page ───────────────────────────────────────────────────────────── */
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

  const tracks  = tracksPages?.pages?.flatMap((p) => p.results) || []
  const albums  = albumsData?.results || []
  const artists = artistsData?.results || []
  const featuredTrack = tracks[0] || null

  return (
    <>
      <Header title="Discover" />
      <div className="px-4 md:px-6 py-5 space-y-10 fade-in">

        {/* ── Hero / Featured track ── */}
        {!tracksLoading && featuredTrack && (
          <FeaturedTrack track={featuredTrack} />
        )}
        {tracksLoading && (
          <div className="skeleton rounded-2xl" style={{ height: 200 }} />
        )}

        {/* ── Trending Tracks ── */}
        <section>
          <SectionHeader icon={TrendingUp} title="Trending Tracks" color="var(--color-brand-via)" />
          <TrackList
            tracks={tracks}
            isLoading={tracksLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            queueTracks={tracks}
          />
        </section>

        {/* ── Popular Albums ── */}
        <section>
          <SectionHeader icon={Disc3} title="Popular Albums" color="var(--color-brand-to)" />
          <AlbumGrid albums={albums} isLoading={albumsLoading} />
        </section>

        {/* ── Popular Artists ── */}
        <section>
          <SectionHeader icon={Users} title="Featured Artists" color="var(--color-brand-from)" />
          <ArtistGrid artists={artists} isLoading={artistsLoading} />
        </section>

      </div>
    </>
  )
}

export default DiscoverPage
