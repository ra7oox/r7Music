import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAlbumById, getAlbumTracks } from '@/services/jamendoService'
import { TrackList } from '@/components/tracks/TrackList'
import { TrackListSkeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, Disc3, Music, Play, Pause, Shuffle, Download } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'

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

  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const playTrack = usePlayerStore((s) => s.playTrack)
  const togglePlay = usePlayerStore((s) => s.togglePlay)

  const isAlbumPlaying = isPlaying && tracks.length > 0 && tracks.some((t) => t.id === currentTrack?.id)

  const handlePlayAlbum = () => {
    if (tracks.length === 0) return
    if (isAlbumPlaying) {
      togglePlay()
    } else {
      const isInAlbum = tracks.some((t) => t.id === currentTrack?.id)
      if (isInAlbum) {
        togglePlay()
      } else {
        playTrack(tracks[0], tracks)
      }
    }
  }

  const handleDownloadAll = () => {
    tracks.forEach((track) => {
      if (track.audiodownload) {
        window.open(track.audiodownload, '_blank')
      }
    })
  }

  if (isLoading) {
    return (
      <div className="page-container fade-in">
        <TrackListSkeleton count={10} />
      </div>
    )
  }

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

        {/* Album Header Container */}
        <div className="relative overflow-hidden rounded-[24px] mb-8 border border-[rgba(255,255,255,0.06)] shadow-xl"
          style={{ background: 'rgba(255, 255, 255, 0.015)' }}>
          
          {/* Dynamic background blur representing the album artwork color theme */}
          {album?.image && (
            <div className="absolute inset-0 -z-10 blur-[80px] opacity-[0.12] scale-110 pointer-events-none select-none"
              style={{
                backgroundImage: `url(${album.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
          )}
          {/* Linear gradient overlay */}
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(to bottom, rgba(14, 13, 22, 0.2) 0%, rgba(14, 13, 22, 0.85) 100%)' }} />

          <div className="p-6 md:p-8 flex gap-6 flex-wrap items-end relative z-10">
            {/* Album Cover */}
            <div className="relative flex-shrink-0 group mx-auto sm:mx-0" style={{ width: 190, height: 190 }}>
              <img
                src={album?.image || album?.album_image || ''}
                alt={`${album?.name} cover`}
                className="rounded-2xl shadow-2xl w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              />
              {album?.image && (
                <div className="absolute inset-0 rounded-2xl -z-10 blur-xl opacity-50 scale-95"
                  style={{
                    background: `url(${album.image})`,
                    backgroundSize: 'cover',
                  }} />
              )}
            </div>

            {/* Info details */}
            <div className="flex flex-col justify-end min-w-0 flex-1 text-center sm:text-left">
              <span className="badge badge-brand mb-3 inline-flex items-center gap-1.5 px-3 py-1 font-semibold tracking-wider text-[10px] uppercase w-fit mx-auto sm:mx-0">
                <Disc3 size={10} className="text-[#C8389A]" />
                Album
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight text-white font-display leading-tight">{album?.name}</h1>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm font-bold">
                <span className="text-brand-gradient">{album?.artist_name}</span>
                <span className="opacity-40 text-white">·</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <Music size={12} className="opacity-70" />
                  {tracks.length} titres
                </span>
                {album?.releasedate && (
                  <>
                    <span className="opacity-40 text-white">·</span>
                    <span className="text-white font-medium">Released {new Date(album.releasedate).getFullYear() || album.releasedate}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Row */}
        {tracks.length > 0 && (
          <div className="flex items-center gap-5 mb-8 pl-2">
            <button
              className="btn-play flex items-center justify-center"
              style={{ width: 56, height: 56 }}
              onClick={handlePlayAlbum}
              aria-label={isAlbumPlaying ? 'Pause album' : 'Play album'}
            >
              {isAlbumPlaying ? (
                <Pause size={22} fill="white" />
              ) : (
                <Play size={22} fill="white" style={{ marginLeft: 2 }} />
              )}
            </button>

            <button
              className="btn-icon"
              style={{ width: 42, height: 42 }}
              onClick={() => {
                const shuffleState = usePlayerStore.getState().shuffle
                if (!shuffleState) {
                  usePlayerStore.getState().toggleShuffle()
                }
                if (!isAlbumPlaying && tracks.length > 0) {
                  playTrack(tracks[Math.floor(Math.random() * tracks.length)], tracks)
                }
              }}
              aria-label="Shuffle play"
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>

            <button
              className="btn-icon"
              style={{ width: 42, height: 42 }}
              onClick={handleDownloadAll}
              aria-label="Download album"
              title="Download all"
            >
              <Download size={18} />
            </button>
          </div>
        )}

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
