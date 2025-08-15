// Service Worker simple: offline fallback + cache runtime
const CACHE = 'taskio-v1'
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    await cache.addAll([
      OFFLINE_URL,
      '/manifest.webmanifest'
    ])
  })())
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.map(k => k === CACHE ? null : caches.delete(k)))
    self.clients.claim()
  })())
})

// Navigation requests -> réseau puis fallback offline
self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req)
        return fresh
      } catch {
        const cache = await caches.open(CACHE)
        const cached = await cache.match(OFFLINE_URL)
        return cached
      }
    })())
    return
  }

  // Runtime cache (stale-while-revalidate)
  if (req.method === 'GET' && req.url.startsWith(self.location.origin)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE)
      const cached = await cache.match(req)
      const fetchPromise = fetch(req).then((res) => {
        cache.put(req, res.clone())
        return res
      }).catch(() => cached)
      return cached || fetchPromise
    })())
  }
})
