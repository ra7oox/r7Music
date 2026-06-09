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
    <div className="px-4 md:px-6 py-4">
      <div className="max-w-2xl mx-auto mb-6">
        <h1 className="text-2xl font-bold gradient-text mb-4">Search</h1>
        <SearchBar
          value={query}
          onChange={setQuery}
          autoFocus
          placeholder="Search tracks, artists, albums…"
        />
      </div>

      {/* Empty state — no query typed yet */}
      {!query && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <SearchIcon size={48} style={{ color: 'var(--color-text-muted)', opacity: 0.3 }} />
          <p className="mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Type at least 2 characters to search
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
            Press &mdash; to quickly search from anywhere
          </p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div role="alert" className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle size={36} style={{ color: '#ef4444', opacity: 0.7 }} />
          <p className="mt-3 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Search failed
          </p>
          <p className="text-xs mt-1 max-w-md" style={{ color: 'var(--color-text-muted)' }}>
            {error?.message || 'An unexpected error occurred. Check your API key in .env.local'}
          </p>
        </div>
      )}

      {/* Loading state — initial load */}
      {isSearching && isLoading && !isError && (
        <div>
          <div className="flex gap-1 mb-6 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
            {TABS.map(({ key, label }) => (
              <button key={key} className="px-4 py-2 text-sm font-medium rounded-full" style={{ color: 'var(--color-text-muted)' }}>
                {label}
              </button>
            ))}
          </div>
          <TrackListSkeleton count={5} />
          <div className="mt-6">
            <CardGridSkeleton count={4} />
          </div>
        </div>
      )}

      {/* Results */}
      {isSearching && !isLoading && !isError && query && (
        <>
          <div className="flex gap-1 mb-6 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="px-4 py-2 text-sm font-medium rounded-full transition-all"
                style={{
                  background: activeTab === key ? 'rgba(139,92,246,0.2)' : 'transparent',
                  color: activeTab === key ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {(activeTab === 'all' || activeTab === 'tracks') && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Music2 size={18} style={{ color: 'var(--color-accent-mid)' }} />
                  {isFetching && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent-mid)' }} />}
                  <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Tracks</h2>
                </div>
                {tracks.length > 0 ? (
                  <TrackList tracks={tracks} isLoading={false} queueTracks={tracks} />
                ) : (
                  <p className="text-xs py-4" style={{ color: 'var(--color-text-muted)' }}>No tracks found</p>
                )}
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'albums') && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Disc3 size={18} style={{ color: 'var(--color-accent-mid)' }} />
                  <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Albums</h2>
                </div>
                {albums.length > 0 ? (
                  <AlbumGrid albums={albums} isLoading={false} />
                ) : (
                  <p className="text-xs py-4" style={{ color: 'var(--color-text-muted)' }}>No albums found</p>
                )}
              </section>
            )}

            {(activeTab === 'all' || activeTab === 'artists') && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={18} style={{ color: 'var(--color-accent-mid)' }} />
                  <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Artists</h2>
                </div>
                {artists.length > 0 ? (
                  <ArtistGrid artists={artists} isLoading={false} />
                ) : (
                  <p className="text-xs py-4" style={{ color: 'var(--color-text-muted)' }}>No artists found</p>
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
