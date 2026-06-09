import { useInfiniteQuery } from '@tanstack/react-query'
import { getTracks, getAlbumTracks, getArtistTracks } from '@/services/jamendoService'

const PAGE_SIZE = 20

export const useTracks = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ['tracks', params],
    queryFn: ({ pageParam = 0 }) =>
      getTracks({ ...params, offset: pageParam, limit: PAGE_SIZE }),
    getNextPageParam: (lastPage, pages) => {
      const totalLoaded = pages.length * PAGE_SIZE
      if (lastPage.results?.length < PAGE_SIZE) return undefined
      return totalLoaded
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAlbumTracks = (albumId) => {
  return useInfiniteQuery({
    queryKey: ['albumTracks', albumId],
    queryFn: ({ pageParam = 0 }) =>
      getAlbumTracks({ albumId, offset: pageParam, limit: PAGE_SIZE }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.results?.length < PAGE_SIZE) return undefined
      return pages.length * PAGE_SIZE
    },
    initialPageParam: 0,
    enabled: !!albumId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useArtistTracks = (artistId) => {
  return useInfiniteQuery({
    queryKey: ['artistTracks', artistId],
    queryFn: ({ pageParam = 0 }) =>
      getArtistTracks({ artistId, offset: pageParam, limit: PAGE_SIZE }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.results?.length < PAGE_SIZE) return undefined
      return pages.length * PAGE_SIZE
    },
    initialPageParam: 0,
    enabled: !!artistId,
    staleTime: 5 * 60 * 1000,
  })
}
