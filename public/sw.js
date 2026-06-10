const CACHE = 'r7music-v1'
const ASSETS = ['/', '/index.html', '/manifest.json', '/r7music-logo.svg']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return

  const url = new URL(e.request.url)
  // Avoid caching non-HTTP protocols (like chrome extensions) and audio/video media streams
  if (
    !url.protocol.startsWith('http') ||
    e.request.destination === 'audio' ||
    e.request.destination === 'video' ||
    url.hostname.includes('jamendo.com')
  ) {
    return
  }

  e.respondWith(
    fetch(e.request)
      .then((r) => {
        // Only cache standard successful HTTP 200 responses (avoids 206 Partial Content range requests)
        if (r && r.status === 200) {
          const responseToCache = r.clone()
          caches.open(CACHE).then((c) => c.put(e.request, responseToCache))
        }
        return r
      })
      .catch(() => caches.match(e.request))
  )
})
