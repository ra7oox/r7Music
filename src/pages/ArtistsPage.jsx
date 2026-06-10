import { useQuery } from '@tanstack/react-query'
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

  return (
    <>
      <div className="page-container space-y-10 fade-in">
        {jamendoArtists.length > 0 && (
          <section>
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
              <h2 className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-white font-display">
                Jamendo Artists
              </h2>
            </div>
            <ArtistGrid
              artists={jamendoArtists}
              isLoading={jamendoLoading}
            />
          </section>
        )}

        {lastfmArtists && lastfmArtists.length > 0 && (
          <section>
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
                <Radio size={18} style={{ color: '#7C3FE4' }} />
              </div>
              <h2 className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-white font-display">
                Popular — Last.fm
              </h2>
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
