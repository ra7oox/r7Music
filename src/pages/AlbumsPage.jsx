import { useQuery } from '@tanstack/react-query'
import { AlbumGrid } from '@/components/albums/AlbumView'
import { getAlbums } from '@/services/jamendoService'
import { Disc3 } from 'lucide-react'

export const AlbumsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: () => getAlbums({ limit: 50 }),
    staleTime: 5 * 60 * 1000,
  })

  const albums = data?.results || []

  return (
    <>
      <div className="page-container fade-in">
        <div className="flex items-center gap-3 mb-8">
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
          <h2 className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-white font-display">
            Albums
          </h2>
        </div>
        <AlbumGrid albums={albums} isLoading={isLoading} />
      </div>
    </>
  )
}

export default AlbumsPage
