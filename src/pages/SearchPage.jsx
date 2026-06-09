import { useState } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
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
    <div className="px-4 md:px-6 py-5 fade-in">
      <div className="mx-auto mb-6">
        <h1 className="page-heading gradient-text">Search</h1>
        <SearchBar
          value={query}
          onChange={setQuery}
          autoFocus
          placeholder="Search tracks, artists, albums…"
        />
      </div>

      {!query && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex items-center justify-center rounded-full mb-6"
            style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.04)' }}>
            <SearchIcon size={36} style={{ color: 'var(--color-text-muted)', opacity: 0.3 }} />
          </div>
          <p className="text-base font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Find what you love
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Type at least 2 characters to start
          </p>
        </div>
      )}

      {isError && (
        <div role="alert" className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle size={36} style={{ color: '#ef4444', opacity: 0.7 }} />
          <p className="mt-3 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Search failed
          </p>
          <p className="text-xs mt-1 max-w-md" style={{ color: 'var(--color-text-muted)' }}>
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
          <div className="flex flex-wrap gap-2 mb-6">
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

          <div className="space-y-10">
            {(activeTab === 'all' || activeTab === 'tracks') && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Music2 size={18} style={{ color: 'var(--color-accent-mid)' }} />
                  {isFetching && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent-mid)' }} />}
                  <h2 className="section-heading" style={{ fontSize: '1.25rem', marginBottom: 0 }}>Tracks</h2>
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
                <div className="flex items-center gap-2 mb-4">
                  <Disc3 size={18} style={{ color: 'var(--color-accent-mid)' }} />
                  <h2 className="section-heading" style={{ fontSize: '1.25rem', marginBottom: 0 }}>Albums</h2>
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
                <div className="flex items-center gap-2 mb-4">
                  <Users size={18} style={{ color: 'var(--color-accent-mid)' }} />
                  <h2 className="section-heading" style={{ fontSize: '1.25rem', marginBottom: 0 }}>Artists</h2>
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
