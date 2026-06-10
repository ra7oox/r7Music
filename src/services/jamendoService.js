import axios from 'axios'
import { cacheGet, cacheSet } from './cache'

const BASE_URL = 'https://api.jamendo.com/v3.0'
const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || 'f282da85'

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    client_id: CLIENT_ID,
    format: 'json',
  },
})

// ─── SessionStorage cache interceptor ────────────────────────────────────────
const CACHEABLE = ['/tracks', '/albums', '/artists']
api.interceptors.request.use((config) => {
  if (CACHEABLE.some((p) => config.url?.startsWith(p))) {
    const key = config.url + JSON.stringify(config.params)
    const cached = cacheGet(key)
    if (cached) {
      config.adapter = () => Promise.resolve({ data: cached, status: 200, statusText: 'OK', headers: {}, config })
    } else {
      const orig = config.adapter || axios.defaults.adapter
      config.adapter = (...args) => orig(...args).then((res) => {
        cacheSet(key, res.data)
        return res
      })
    }
  }
  return config
})

// ─── Tracks ────────────────────────────────────────────────────────────────

export const getTracks = async ({
  offset = 0,
  limit = 20,
  order = 'popularity_total',
  tags = '',
  fuzzytags = '',
} = {}) => {
  const { data } = await api.get('/tracks', {
    params: {
      offset,
      limit,
      order,
      tags: tags || undefined,
      fuzzytags: fuzzytags || undefined,
      include: 'musicinfo licenses',
      imagesize: 200,
      audioformat: 'mp31',
    },
  })
  return data
}

export const searchTracks = async ({ query = '', offset = 0, limit = 20 } = {}) => {
  const { data } = await api.get('/tracks', {
    params: {
      search: query,
      offset,
      limit,
      order: 'relevance',
      include: 'musicinfo licenses',
      imagesize: 200,
      audioformat: 'mp31',
    },
  })
  if (data.headers?.status === 'failed') {
    throw new Error(data.headers.error_message || 'Jamendo API search failed')
  }
  return data
}

export const getTrackById = async (id) => {
  const { data } = await api.get('/tracks', {
    params: { id, include: 'musicinfo licenses', imagesize: 200 },
  })
  return data.results?.[0] || null
}

export const getAlbumTracks = async ({ albumId, offset = 0, limit = 20 } = {}) => {
  const { data } = await api.get('/tracks', {
    params: {
      album_id: albumId,
      offset,
      limit,
      include: 'musicinfo licenses',
      imagesize: 200,
      audioformat: 'mp31',
    },
  })
  return data
}

export const getArtistTracks = async ({ artistId, offset = 0, limit = 20 } = {}) => {
  const { data } = await api.get('/tracks', {
    params: {
      artist_id: artistId,
      offset,
      limit,
      include: 'musicinfo licenses',
      imagesize: 200,
      audioformat: 'mp31',
    },
  })
  return data
}

// ─── Albums ─────────────────────────────────────────────────────────────────

export const getAlbums = async ({ offset = 0, limit = 20, order = 'popularity_total' } = {}) => {
  const { data } = await api.get('/albums', {
    params: { offset, limit, order, imagesize: 200, include: 'tracks' },
  })
  return data
}

export const getAlbumById = async (id) => {
  const { data } = await api.get('/albums', {
    params: { id, imagesize: 200, include: 'tracks' },
  })
  return data.results?.[0] || null
}

export const searchAlbums = async ({ query = '', offset = 0, limit = 20 } = {}) => {
  const { data } = await api.get('/albums', {
    params: { namesearch: query, offset, limit, imagesize: 200 },
  })
  if (data.headers?.status === 'failed') {
    throw new Error(data.headers.error_message || 'Jamendo API search failed')
  }
  return data
}

// ─── Artists ─────────────────────────────────────────────────────────────────

export const getArtists = async ({ offset = 0, limit = 20, order = 'popularity_total' } = {}) => {
  const { data } = await api.get('/artists', {
    params: { offset, limit, order, imagesize: 200 },
  })
  return data
}

export const getArtistById = async (id) => {
  const { data } = await api.get('/artists', {
    params: { id, imagesize: 200 },
  })
  return data.results?.[0] || null
}

export const searchArtists = async ({ query = '', offset = 0, limit = 20 } = {}) => {
  const { data } = await api.get('/artists', {
    params: { namesearch: query, offset, limit, imagesize: 200 },
  })
  if (data.headers?.status === 'failed') {
    throw new Error(data.headers.error_message || 'Jamendo API search failed')
  }
  return data
}

// ─── Download URL helper ──────────────────────────────────────────────────

export const getDownloadUrl = (trackId) =>
  `https://mp3l.jamendo.com/?trackid=${trackId}&format=mp31&from=app-devsite`

export const getStreamUrl = (audioUrl) => audioUrl
