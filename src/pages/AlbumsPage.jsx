import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
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
      <Header title="Albums" />
      <div className="px-4 md:px-6 py-5 fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Disc3 size={24} style={{ color: 'var(--color-accent-mid)' }} />
          <h2 className="section-heading" style={{ marginBottom: 0 }}>Albums</h2>
        </div>
        <AlbumGrid albums={albums} isLoading={isLoading} />
      </div>
    </>
  )
}

export default AlbumsPage
