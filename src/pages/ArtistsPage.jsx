import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { ArtistGrid } from '@/components/artists/ArtistView'
import { getArtists } from '@/services/jamendoService'
import { getTopArtists } from '@/services/lastfmService'
import { Users, Radio } from 'lucide-react'

export const ArtistsPage = () => {
  const { data: jamendoData, isLoading: jamendoLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: () => getArtists({ limit: 50 }),
    staleTime: 5 * 60 * 1000,
  })

  const { data: lastfmArtists, isLoading: lastfmLoading } = useQuery({
    queryKey: ['lastfm-top-artists'],
    queryFn: () => getTopArtists(24),
    staleTime: 10 * 60 * 1000,
  })

  const jamendoArtists = jamendoData?.results || []
  const isLoading = jamendoLoading || lastfmLoading

  const seenNames = new Set()
  const combined = []
  for (const a of jamendoArtists) {
    const name = (a.name || '').toLowerCase()
    if (!seenNames.has(name)) {
      seenNames.add(name)
      combined.push({ ...a, source: 'jamendo' })
    }
  }
  for (const a of lastfmArtists || []) {
    const name = (a.name || '').toLowerCase()
    if (!seenNames.has(name)) {
      seenNames.add(name)
      combined.push({ ...a, source: 'lastfm' })
    }
  }

  return (
    <>
      <Header title="Artists" />
      <div className="px-4 md:px-6 py-5 space-y-8 fade-in">
        {jamendoArtists.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <Users size={24} style={{ color: 'var(--color-accent-mid)' }} />
              <h2 className="section-heading" style={{ marginBottom: 0 }}>Jamendo Artists</h2>
            </div>
            <ArtistGrid
              artists={jamendoArtists}
              isLoading={jamendoLoading}
            />
          </section>
        )}

        {lastfmArtists && lastfmArtists.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <Radio size={24} style={{ color: 'var(--color-accent-mid)' }} />
              <h2 className="section-heading" style={{ marginBottom: 0 }}>Popular — Last.fm</h2>
            </div>
            <ArtistGrid
              artists={lastfmArtists}
              isLoading={lastfmLoading}
              emptyMessage="Enable Last.fm API key for more artists"
            />
          </section>
        )}
      </div>
    </>
  )
}

export default ArtistsPage
