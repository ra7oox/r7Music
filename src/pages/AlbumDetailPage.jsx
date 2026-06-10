import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAlbumById, getAlbumTracks } from '@/services/jamendoService'
import { TrackList } from '@/components/tracks/TrackList'
import { Header } from '@/components/layout/Header'
import { TrackListSkeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, Disc3, Music } from 'lucide-react'

export const AlbumDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: album, isLoading: albumLoading } = useQuery({
    queryKey: ['album', id],
    queryFn: () => getAlbumById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })

  const { data: tracksData, isLoading: tracksLoading } = useQuery({
    queryKey: ['album-tracks', id],
    queryFn: () => getAlbumTracks({ albumId: id, limit: 50 }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })

  const tracks = tracksData?.results || []
  const isLoading = albumLoading || tracksLoading

  if (isLoading) {
    return (
      <div className="px-6 md:px-12 py-6 fade-in">
        <TrackListSkeleton count={10} />
      </div>
    )
  }

  return (
    <>
      <Header title={album?.name || 'Album'} />
      <div className="px-6 md:px-12 py-6 fade-in">
        <button
          className="btn-icon mb-6"
          aria-label="Go back"
          onClick={() => navigate(-1)}
          style={{ width: 38, height: 38 }}
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex gap-6 mb-10 flex-wrap items-end relative z-10">
          <div className="relative flex-shrink-0 group" style={{ width: 200, height: 200 }}>
            <img
              src={album?.image || album?.album_image || ''}
              alt={`${album?.name} cover`}
              className="rounded-2xl shadow-2xl w-full h-full object-cover"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            />
            {album?.image && (
              <div className="absolute inset-0 rounded-2xl -z-10 blur-2xl opacity-60 scale-95"
                style={{
                  background: `url(${album.image})`,
                  backgroundSize: 'cover',
                }} />
            )}
          </div>
          <div className="flex flex-col justify-end min-w-0 flex-1">
            <span className="badge badge-brand mb-3 inline-flex items-center gap-1.5 px-3 py-1 font-semibold tracking-wider text-[10px] uppercase w-fit">
              <Disc3 size={10} className="text-[#C8389A]" />
              Album
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight text-white font-display leading-tight">{album?.name}</h1>
            <p className="text-base font-bold text-brand-gradient">
              {album?.artist_name}
            </p>
            <div className="text-xs font-semibold mt-3 flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="flex items-center gap-1">
                <Music size={11} />
                {tracks.length} tracks
              </span>
              {album?.releasedate && (
                <span>
                  · Released {album.releasedate}
                </span>
              )}
            </div>
          </div>
        </div>

        {tracks.length > 0 ? (
          <TrackList tracks={tracks} queueTracks={tracks} />
        ) : (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No tracks available for this album.
          </p>
        )}
      </div>
    </>
  )
}

export default AlbumDetailPage
