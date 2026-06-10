import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getArtistById, getArtistTracks, getAlbums } from '@/services/jamendoService'
import { getArtistInfo } from '@/services/lastfmService'
import { TrackList } from '@/components/tracks/TrackList'
import { AlbumGrid } from '@/components/albums/AlbumView'
import { TrackListSkeleton } from '@/components/ui/Skeleton'
import { useLastfmArtistInfo, useLastfmTopTracks, useLastfmTopAlbums } from '@/hooks/useLastfm'
import { ArrowLeft, Users, Disc3, Globe, Music, ExternalLink, Info } from 'lucide-react'

export const ArtistDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: artist, isLoading: artistLoading } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => getArtistById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })

  const { data: tracksData, isLoading: tracksLoading } = useQuery({
    queryKey: ['artist-tracks', id],
    queryFn: () => getArtistTracks({ artistId: id, limit: 50 }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })

  const { data: albumsData, isLoading: albumsLoading } = useQuery({
    queryKey: ['artist-albums', id],
    queryFn: () => getAlbums({ limit: 50 }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })

  const artistName = artist?.name

  const { data: lastfm } = useLastfmArtistInfo(artistName, !!artistName)
  const { data: lastfmTracks } = useLastfmTopTracks(artistName, !!artistName)
  const { data: lastfmAlbums } = useLastfmTopAlbums(artistName, !!artistName)

  const tracks = tracksData?.results || []
  const artistAlbums = (albumsData?.results || []).filter(
    (a) => a.artist_id === id || a.artist_id === parseInt(id)
  )
  const isLoading = artistLoading || tracksLoading

  if (isLoading) {
    return (
      <div className="page-container fade-in">
        <TrackListSkeleton count={10} />
      </div>
    )
  }

  const imageSrc = artist?.image || artist?.artist_image || lastfm?.image || ''

  return (
    <>
      <div className="page-container fade-in">
        <button
          className="btn-icon mb-6"
          aria-label="Go back"
          onClick={() => navigate(-1)}
          style={{ width: 38, height: 38 }}
        >
          <ArrowLeft size={18} />
        </button>

        {/* Artist header */}
        <div className="flex gap-6 mb-10 flex-wrap items-end relative z-10">
          <div className="relative flex-shrink-0 group" style={{ width: 160, height: 160 }}>
            <img
              src={imageSrc}
              alt={artist?.name || lastfm?.name}
              className="rounded-full shadow-2xl w-full h-full object-cover"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            />
            {imageSrc && (
              <div className="absolute inset-0 rounded-full -z-10 blur-2xl opacity-60 scale-95"
                style={{
                  background: `url(${imageSrc})`,
                  backgroundSize: 'cover',
                }} />
            )}
          </div>
          <div className="flex flex-col justify-center min-w-0 max-w-xl flex-1">
            <span className="badge badge-brand mb-3 inline-flex items-center gap-1.5 px-3 py-1 font-semibold tracking-wider text-[10px] uppercase w-fit">
              <Users size={10} className="text-[#4A8FE8]" />
              Artist
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight text-white font-display leading-tight">{artist?.name || lastfm?.name}</h1>

            {artist?.artist_location && (
              <p className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                {artist.artist_location}
              </p>
            )}

            {lastfm && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {lastfm.listeners > 0 && (
                  <span className="text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                    {lastfm.listeners.toLocaleString()} listeners
                  </span>
                )}
                {lastfm.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {lastfm.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="badge badge-brand text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-4">
              {artist?.website && (
                <a
                  href={artist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold flex items-center gap-1 hover:underline text-brand-gradient"
                >
                  <Globe size={12} className="text-[#4A8FE8]" />
                  Website
                </a>
              )}
              {lastfm?.url && (
                <a
                  href={lastfm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold flex items-center gap-1 hover:underline text-brand-gradient"
                >
                  <ExternalLink size={12} className="text-[#7C3FE4]" />
                  Last.fm
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {lastfm?.summary && (
          <section className="mb-10">
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
                <Info size={18} style={{ color: '#7C3FE4' }} />
              </div>
              <h2 className="font-display font-extrabold text-xl tracking-tight text-white">
                About
              </h2>
            </div>
            <p
              className="text-sm leading-relaxed max-w-2xl font-medium"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {lastfm.summary}
            </p>
          </section>
        )}

        {/* Tracks */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 38,
                height: 38,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: `inset 0 0 10px rgba(74, 143, 232, 0.05)`,
              }}
            >
              <Music size={18} style={{ color: '#4A8FE8' }} />
            </div>
            <h2 className="font-display font-extrabold text-xl tracking-tight text-white">
              Tracks
            </h2>
          </div>
          {tracks.length > 0 ? (
            <TrackList tracks={tracks} queueTracks={tracks} />
          ) : lastfmTracks && lastfmTracks.length > 0 ? (
            <div className="space-y-1">
              {lastfmTracks.map((t, i) => (
                <div
                  key={t.id || i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <span className="text-xs font-semibold tabular-nums w-6 text-right" style={{ color: 'var(--color-text-muted)' }}>
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="text-sm font-semibold flex-1 truncate text-white">
                    {t.name}
                  </span>
                  <span className="text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                    {t.playcount.toLocaleString()} plays
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              No tracks available.
            </p>
          )}
        </section>

        {/* Albums */}
        {artistAlbums.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 38,
                  height: 38,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: `inset 0 0 10px rgba(200, 56, 154, 0.05)`,
                }}
              >
                <Disc3 size={18} style={{ color: '#C8389A' }} />
              </div>
              <h2 className="font-display font-extrabold text-xl tracking-tight text-white font-display">
                Albums
              </h2>
            </div>
            <AlbumGrid albums={artistAlbums} isLoading={albumsLoading} />
          </section>
        )}

        {/* Similar artists */}
        {lastfm?.similar && lastfm.similar.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 38,
                  height: 38,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: `inset 0 0 10px rgba(74, 143, 232, 0.05)`,
                }}
              >
                <Users size={18} style={{ color: '#4A8FE8' }} />
              </div>
              <h2 className="font-display font-extrabold text-xl tracking-tight text-white font-display">
                Similar Artists
              </h2>
            </div>
            <ArtistGrid artists={lastfm.similar} isLoading={false} />
          </section>
        )}
      </div>
    </>
  )
}

export default ArtistDetailPage
