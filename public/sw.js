const CACHE = 'r7music-v2'
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
  if (!url.protocol.startsWith('http')) return

  e.respondWith(
    fetch(e.request)
      .then((r) => {
        // Clone the response immediately while the stream is unused
        if (r.status === 200) {
          const rClone = r.clone()
          caches.open(CACHE)
            .then((c) => {
              c.put(e.request, rClone).catch((err) => {
                console.warn('SW cache put failed:', err)
              })
            })
            .catch((err) => {
              console.warn('SW cache open failed:', err)
            })
        }
        return r
      })
      .catch(() => caches.match(e.request))
  )
})

