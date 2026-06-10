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
      className="relative overflow-hidden rounded-3xl mb-10 cursor-pointer group featured-banner-glass transition-all duration-500 hover:border-[rgba(255,255,255,0.15)]"
      style={{ minHeight: 220 }}
      onClick={() => playTrack(track)}
      role="button"
      tabIndex={0}
      aria-label={`Play ${track.name} by ${track.artist_name}`}
      onKeyDown={(e) => e.key === 'Enter' && playTrack(track)}
    >
      {/* Background blurred image */}
      {track.album_image && (
        <img
          src={track.album_image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          style={{ transform: 'scale(1.15)', filter: 'blur(30px) brightness(0.25)', transition: 'transform 0.8s ease' }}
          aria-hidden
        />
      )}

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 select-none pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(12, 10, 20, 0.65) 0%, rgba(124, 63, 228, 0.08) 50%, rgba(200, 56, 154, 0.08) 100%)',
        }}
      />

      {/* Grid or Flex layout for content */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 h-full min-h-[220px]">
        {/* Cover image floating with brand shadow */}
        <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500" style={{ width: 120, height: 120 }}>
          <img
            src={track.album_image || ''}
            alt=""
            className="rounded-2xl w-full h-full object-cover shadow-2xl"
            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
          />
          {/* Subtle glowing reflection behind the art */}
          <div className="absolute inset-0 rounded-2xl -z-10 blur-xl opacity-60 scale-95" 
            style={{
              background: `url(${track.album_image})`,
              backgroundSize: 'cover'
            }} />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <span className="badge badge-brand mb-3 inline-flex items-center gap-1.5 px-3 py-1 font-semibold tracking-wider text-[10px] uppercase">
            <Music2 size={10} className="text-[#4A8FE8]" />
            Featured Track
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold truncate mb-2 tracking-tight text-white">
            {track.name}
          </h2>
          <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-secondary)' }}>
            {track.artist_name}
            {track.album_name && <span className="opacity-50"> · {track.album_name}</span>}
          </p>
        </div>

        {/* Play button */}
        <button
          className="btn-play flex-shrink-0"
          aria-label={isActive && isPlaying ? 'Pause' : 'Play'}
          style={{ width: 64, height: 64 }}
          onClick={(e) => { e.stopPropagation(); playTrack(track) }}
        >
          {isActive && isPlaying ? (
            <div className="flex items-end gap-[3px]" style={{ height: 18 }}>
              <div className="equalizer-bar" style={{ height: 8, background: 'white' }} />
              <div className="equalizer-bar" style={{ height: 15, background: 'white' }} />
              <div className="equalizer-bar" style={{ height: 7, background: 'white' }} />
              <div className="equalizer-bar" style={{ height: 11, background: 'white' }} />
            </div>
          ) : (
            <Play size={24} fill="white" style={{ marginLeft: 3 }} />
          )}
        </button>
      </div>
    </div>
  )
}

const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className="flex items-center gap-3 mb-6">
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
      <Icon size={18} style={{ color: color || 'var(--color-accent)' }} />
    </div>
    <h2
      className="font-display font-extrabold text-xl md:text-2xl tracking-tight"
      style={{ color: 'var(--color-text-primary)' }}
    >
      {title}
    </h2>
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
      <div className="px-6 md:px-12 py-6 space-y-12 fade-in">

        {/* ── Hero / Featured track ── */}
        {!tracksLoading && featuredTrack && (
          <FeaturedTrack track={featuredTrack} />
        )}
        {tracksLoading && (
          <div className="skeleton rounded-3xl mb-10" style={{ height: 220 }} />
        )}

        {/* ── Trending Tracks ── */}
        <section>
          <SectionHeader icon={TrendingUp} title="Trending Tracks" color="#7C3FE4" />
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
          <SectionHeader icon={Disc3} title="Popular Albums" color="#C8389A" />
          <AlbumGrid albums={albums} isLoading={albumsLoading} />
        </section>

        {/* ── Popular Artists ── */}
        <section>
          <SectionHeader icon={Users} title="Featured Artists" color="#4A8FE8" />
          <ArtistGrid artists={artists} isLoading={artistsLoading} />
        </section>

      </div>
    </>
  )
}

export default DiscoverPage
