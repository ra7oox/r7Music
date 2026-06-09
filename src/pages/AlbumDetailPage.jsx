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
      <div className="px-4 md:px-6 py-5 fade-in">
        <TrackListSkeleton count={10} />
      </div>
    )
  }

  return (
    <>
      <Header title={album?.name || 'Album'} />
      <div className="px-4 md:px-6 py-5 fade-in">
        <button
          className="btn-icon mb-4"
          aria-label="Go back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex gap-6 mb-8 flex-wrap">
          <img
            src={album?.image || album?.album_image || ''}
            alt={`${album?.name} cover`}
            className="rounded-2xl shadow-glow flex-shrink-0"
            style={{ width: 200, height: 200, objectFit: 'cover' }}
          />
          <div className="flex flex-col justify-end min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
              <Disc3 size={14} style={{ display: 'inline', marginRight: 4 }} />
              Album
            </p>
            <h1 className="text-3xl font-bold mb-2">{album?.name}</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {album?.artist_name}
            </p>
            <p className="text-xs mt-2 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
              <Music size={12} />
              {tracks.length} tracks
              {album?.releasedate && ` · ${album.releasedate}`}
            </p>
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
