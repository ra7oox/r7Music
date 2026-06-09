import axios from 'axios'

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY
const isDev = import.meta.env.DEV

// Use Vite proxy in dev, direct URL in prod (won't work without proxy)
const BASE_URL = isDev ? '/api/lastfm' : 'https://ws.audioscrobbler.com/2.0'

const api = axios.create({ baseURL: BASE_URL })

const get = async (method, params = {}) => {
  if (!API_KEY) return null
  const { data } = await api.get('/', {
    params: { method, api_key: API_KEY, format: 'json', ...params },
  })
  if (data.error) {
    console.error('Last.fm API error:', data.message || data.error)
    return null
  }
  return data
}

const mapArtist = (a) => ({
  id: a.mbid || a.name,
  name: a.name,
  image: a.image?.find((i) => i.size === 'large' || i.size === 'extralarge')?.['#text'] || null,
  url: a.url,
  listeners: parseInt(a.listeners) || 0,
  streamable: a.streamable === '1',
})

const mapImage = (images) => {
  const img = images?.find((i) => i.size === 'mega' || i.size === 'extralarge')
  return img?.['#text'] || null
}

export const searchArtists = async (query, limit = 20) => {
  const data = await get('artist.search', { artist: query, limit })
  if (!data) return []
  const artists = data.results?.artistmatches?.artist || []
  return artists.map(mapArtist)
}

export const getArtistInfo = async (artist) => {
  const data = await get('artist.getinfo', { artist, autocorrect: 1 })
  if (!data?.artist) return null
  const a = data.artist
  return {
    id: a.mbid || a.name,
    name: a.name,
    image: mapImage(a.image),
    url: a.url,
    listeners: parseInt(a.stats?.listeners) || 0,
    playcount: parseInt(a.stats?.playcount) || 0,
    bio: a.bio?.content?.split('\n')[0] || '',
    summary: a.bio?.summary?.replace(/<a[^>]*>.*?<\/a>/g, '').trim() || '',
    tags: (a.tags?.tag || []).map((t) => t.name),
    similar: (a.similar?.artist || []).slice(0, 6).map(mapArtist),
  }
}

export const getArtistTopTracks = async (artist, limit = 10) => {
  const data = await get('artist.gettoptracks', { artist, limit })
  if (!data) return []
  return (data.toptracks?.track || []).map((t) => ({
    id: t.mbid || t.name,
    name: t.name,
    playcount: parseInt(t.playcount) || 0,
    listeners: parseInt(t.listeners) || 0,
    duration: t.duration ? parseInt(t.duration) : 0,
    url: t.url,
  }))
}

export const getArtistTopAlbums = async (artist, limit = 6) => {
  const data = await get('artist.gettopalbums', { artist, limit })
  if (!data) return []
  return (data.topalbums?.album || []).map((a) => ({
    id: a.mbid || a.name,
    name: a.name,
    image: mapImage(a.image),
    playcount: parseInt(a.playcount) || 0,
    url: a.url,
  }))
}

export const getTopArtists = async (limit = 20) => {
  const data = await get('chart.gettopartists', { limit })
  if (!data) return []
  return (data.artists?.artist || []).map(mapArtist)
}
