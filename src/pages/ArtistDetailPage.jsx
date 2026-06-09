import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getArtistById, getArtistTracks, getAlbums } from '@/services/jamendoService'
import { ArtistGrid } from '@/components/artists/ArtistView'
import { TrackList } from '@/components/tracks/TrackList'
import { AlbumGrid } from '@/components/albums/AlbumView'
import { Header } from '@/components/layout/Header'
import { TrackListSkeleton } from '@/components/ui/Skeleton'
import { useLastfmArtistInfo, useLastfmTopTracks, useLastfmTopAlbums } from '@/hooks/useLastfm'
import { ArrowLeft, Users, Disc3, Globe, Music, ExternalLink } from 'lucide-react'

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
      <div className="px-4 md:px-6 py-5 fade-in">
        <TrackListSkeleton count={10} />
      </div>
    )
  }

  const imageSrc = artist?.image || artist?.artist_image || lastfm?.image || ''

  return (
    <>
      <Header title={artist?.name || lastfm?.name || 'Artist'} />
      <div className="px-4 md:px-6 py-5 fade-in">
        <button
          className="btn-icon mb-4"
          aria-label="Go back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Artist header */}
        <div className="flex gap-6 mb-8 flex-wrap items-start">
          <img
            src={imageSrc}
            alt={artist?.name || lastfm?.name}
            className="rounded-full shadow-glow flex-shrink-0"
            style={{ width: 160, height: 160, objectFit: 'cover' }}
          />
          <div className="flex flex-col justify-center min-w-0 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
              <Users size={14} style={{ display: 'inline', marginRight: 4 }} />
              Artist
            </p>
            <h1 className="text-3xl font-bold mb-2">{artist?.name || lastfm?.name}</h1>

            {artist?.artist_location && (
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {artist.artist_location}
              </p>
            )}

            {lastfm && (
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {lastfm.listeners > 0 && (
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {lastfm.listeners.toLocaleString()} listeners
                  </span>
                )}
                {lastfm.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {lastfm.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(34,197,94,0.15)',
                          color: 'var(--color-play)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-3">
              {artist?.website && (
                <a
                  href={artist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 hover:underline"
                  style={{ color: 'var(--color-accent-mid)' }}
                >
                  <Globe size={12} />
                  Website
                </a>
              )}
              {lastfm?.url && (
                <a
                  href={lastfm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 hover:underline"
                  style={{ color: 'var(--color-accent-mid)' }}
                >
                  <ExternalLink size={12} />
                  Last.fm
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {lastfm?.summary && (
          <section className="mb-10">
            <h2 className="section-heading">About</h2>
            <p
              className="text-sm leading-relaxed max-w-2xl"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {lastfm.summary}
            </p>
          </section>
        )}

        {/* Tracks */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <Music size={20} style={{ color: 'var(--color-accent-mid)' }} />
            <h2 className="section-heading" style={{ marginBottom: 0 }}>Tracks</h2>
          </div>
          {tracks.length > 0 ? (
            <TrackList tracks={tracks} queueTracks={tracks} />
          ) : lastfmTracks && lastfmTracks.length > 0 ? (
            <div className="space-y-1">
              {lastfmTracks.map((t, i) => (
                <div
                  key={t.id || i}
                  className="flex items-center gap-3 p-2 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <span className="text-xs tabular-nums w-6 text-right" style={{ color: 'var(--color-text-muted)' }}>
                    {i + 1}
                  </span>
                  <span className="text-sm flex-1 truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {t.name}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
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
            <div className="flex items-center gap-3 mb-5">
              <Disc3 size={20} style={{ color: 'var(--color-accent-mid)' }} />
              <h2 className="section-heading" style={{ marginBottom: 0 }}>Albums</h2>
            </div>
            <AlbumGrid albums={artistAlbums} isLoading={albumsLoading} />
          </section>
        )}

        {/* Similar artists */}
        {lastfm?.similar && lastfm.similar.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <Users size={20} style={{ color: 'var(--color-accent-mid)' }} />
              <h2 className="section-heading" style={{ marginBottom: 0 }}>Similar Artists</h2>
            </div>
            <ArtistGrid artists={lastfm.similar} isLoading={false} />
          </section>
        )}
      </div>
    </>
  )
}

export default ArtistDetailPage
