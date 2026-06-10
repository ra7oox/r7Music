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
  e.respondWith(
    fetch(e.request)
      .then((r) => (caches.open(CACHE).then((c) => c.put(e.request, r.clone())), r))
      .catch(() => caches.match(e.request))
  )
})
