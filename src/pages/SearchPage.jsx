import { useState } from 'react'
import { TrackList } from '@/components/tracks/TrackList'
import { AlbumGrid } from '@/components/albums/AlbumView'
import { ArtistGrid } from '@/components/artists/ArtistView'
import { TrackListSkeleton, CardGridSkeleton } from '@/components/ui/Skeleton'
import { useSearch } from '@/hooks/useSearch'
import { Music2, Disc3, Users, Search as SearchIcon, AlertCircle, Loader2 } from 'lucide-react'

export const SearchPage = () => {
  const { query, setQuery, tracks, albums, artists, isLoading, isFetching, isError, error, isSearching } = useSearch()
  const [activeTab, setActiveTab] = useState('all')

  const TABS = [
    { key: 'all', label: 'All' },
    { key: 'tracks', label: 'Tracks' },
    { key: 'albums', label: 'Albums' },
    { key: 'artists', label: 'Artists' },
  ]

  return (
    <div className="page-container fade-in">
      <div className="mx-auto mb-4">
        <h1 className="page-heading text-brand-gradient font-display font-extrabold">Search</h1>
      </div>

      {!query && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex items-center justify-center rounded-full mb-6"
            style={{ width: 88, height: 88, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <SearchIcon size={32} style={{ color: 'var(--color-text-secondary)', opacity: 0.5 }} />
          </div>
          <p className="text-base font-bold text-white">
            Find what you love
          </p>
          <p className="text-sm mt-1.5 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Type at least 2 characters to start browsing
          </p>
        </div>
      )}

      {isError && (
        <div role="alert" className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle size={36} style={{ color: '#ef4444', opacity: 0.7 }} />
          <p className="mt-3 text-sm font-extrabold text-white">
            Search failed
          </p>
          <p className="text-xs mt-1 max-w-md" style={{ color: 'var(--color-text-secondary)' }}>
            {error?.message || 'An unexpected error occurred'}
          </p>
        </div>
      )}

      {isSearching && isLoading && !isError && (
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            {TABS.map(({ key, label }) => (
              <button key={key} className="btn-pill">{label}</button>
            ))}
          </div>
          <TrackListSkeleton count={5} />
          <div className="mt-6">
            <CardGridSkeleton count={4} />
          </div>
        </div>
      )}

      {isSearching && !isLoading && !isError && query && (
        <>
          <div className="flex flex-wrap gap-2 mb-8">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`btn-pill ${activeTab === key ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-12">
            {(activeTab === 'all' || activeTab === 'tracks') && (
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
                    <Music2 size={18} style={{ color: '#7C3FE4' }} />
                  </div>
                  <h2 className="font-display font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
                    Tracks
                    {isFetching && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', color: '#7C3FE4' }} />}
                  </h2>
                </div>
                {tracks.length > 0 ? (
                  <TrackList tracks={tracks} isLoading={false} queueTracks={tracks} />
                ) : (
                  <p className="py-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>No tracks found</p>
                )}
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'albums') && (
              <section>
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
                  <h2 className="font-display font-extrabold text-lg tracking-tight text-white">Albums</h2>
                </div>
                {albums.length > 0 ? (
                  <AlbumGrid albums={albums} isLoading={false} />
                ) : (
                  <p className="py-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>No albums found</p>
                )}
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'artists') && (
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
                  <h2 className="font-display font-extrabold text-lg tracking-tight text-white">Artists</h2>
                </div>
                {artists.length > 0 ? (
                  <ArtistGrid artists={artists} isLoading={false} />
                ) : (
                  <p className="py-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>No artists found</p>
                )}
              </section>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SearchPage
