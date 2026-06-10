import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchTracks, searchAlbums, searchArtists } from '@/services/jamendoService'
import { searchArtists as lastfmSearchArtists } from '@/services/lastfmService'

import { useSearchStore } from '@/store/searchStore'

const DEBOUNCE_MS = 400

const dedupeByName = (arr) => {
  const seen = new Set()
  return arr.filter((a) => {
    const key = (a.name || '').toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export const useSearch = () => {
  const query = useSearchStore((s) => s.query)
  const setQuery = useSearchStore((s) => s.setQuery)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, DEBOUNCE_MS)
    return () => clearTimeout(timerRef.current)
  }, [query])

  const enabled = debouncedQuery.trim().length >= 2

  const tracksQuery = useQuery({
    queryKey: ['search-tracks', debouncedQuery],
    queryFn: () => searchTracks({ query: debouncedQuery, limit: 20 }),
    enabled,
    staleTime: 2 * 60 * 1000,
  })

  const albumsQuery = useQuery({
    queryKey: ['search-albums', debouncedQuery],
    queryFn: () => searchAlbums({ query: debouncedQuery, limit: 10 }),
    enabled,
    staleTime: 2 * 60 * 1000,
  })

  const jamendoArtistsQuery = useQuery({
    queryKey: ['search-artists', debouncedQuery],
    queryFn: () => searchArtists({ query: debouncedQuery, limit: 8 }),
    enabled,
    staleTime: 2 * 60 * 1000,
  })

  const lastfmArtistsQuery = useQuery({
    queryKey: ['search-lastfm-artists', debouncedQuery],
    queryFn: () => lastfmSearchArtists(debouncedQuery, 8),
    enabled,
    staleTime: 5 * 60 * 1000,
  })

  const jamendoArtists = jamendoArtistsQuery.data?.results || []
  const lastfmArtists = lastfmArtistsQuery.data || []

  const artists = dedupeByName([...jamendoArtists, ...lastfmArtists])

  return {
    query,
    setQuery,
    debouncedQuery,
    isSearching: enabled,
    tracks: tracksQuery.data?.results || [],
    albums: albumsQuery.data?.results || [],
    artists,
    isLoading: tracksQuery.isLoading || albumsQuery.isLoading || jamendoArtistsQuery.isLoading,
    isFetching: tracksQuery.isFetching || albumsQuery.isFetching || jamendoArtistsQuery.isFetching,
    isError: tracksQuery.isError || albumsQuery.isError || jamendoArtistsQuery.isError,
    error: tracksQuery.error || albumsQuery.error || jamendoArtistsQuery.error,
  }
}
