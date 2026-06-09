import { useQuery } from '@tanstack/react-query'
import { searchArtists, getArtistInfo, getArtistTopTracks, getArtistTopAlbums, getTopArtists } from '@/services/lastfmService'

export const useLastfmArtistSearch = (query, enabled = false) => {
  return useQuery({
    queryKey: ['lastfm-artist-search', query],
    queryFn: () => searchArtists(query),
    enabled: enabled && !!query,
    staleTime: 10 * 60 * 1000,
  })
}

export const useLastfmArtistInfo = (artistName, enabled = false) => {
  return useQuery({
    queryKey: ['lastfm-artist-info', artistName],
    queryFn: () => getArtistInfo(artistName),
    enabled: enabled && !!artistName,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  })
}

export const useLastfmTopTracks = (artistName, enabled = false) => {
  return useQuery({
    queryKey: ['lastfm-top-tracks', artistName],
    queryFn: () => getArtistTopTracks(artistName),
    enabled: enabled && !!artistName,
    staleTime: 30 * 60 * 1000,
  })
}

export const useLastfmTopAlbums = (artistName, enabled = false) => {
  return useQuery({
    queryKey: ['lastfm-top-albums', artistName],
    queryFn: () => getArtistTopAlbums(artistName),
    enabled: enabled && !!artistName,
    staleTime: 30 * 60 * 1000,
  })
}

export const useLastfmTopArtists = (limit = 24) => {
  return useQuery({
    queryKey: ['lastfm-top-artists', limit],
    queryFn: () => getTopArtists(limit),
    staleTime: 10 * 60 * 1000,
  })
}
