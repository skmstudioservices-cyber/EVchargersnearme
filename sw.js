/* ============================================================
   Service worker — offline shell + static data cache.
   Cache-first for the app shell and station JSON so repeat visits
   never touch the network (and never touch D1).
   ============================================================ */

const VERSION = 'evnm-v1';
const SHELL = [
  '/',
  '/index.html',
  '/src/styles/tokens.css',
  '/src/styles/components.css',
  '/src/js/app.js',
  '/src/data/stations.js',
  '/manifest.webmanifest',
  '/icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Never cache analytics or reports.
  if (url.pathname.startsWith('/api/')) return;

  // Map tiles: cache-first, bounded by the browser cache.
  if (/tile|basemaps|arcgisonline/.test(url.hostname)) {
    e.respondWith(
      caches.match(request).then(hit => hit || fetch(request).then(res => {
        const copy = res.clone();
        caches.open(VERSION + '-tiles').then(c => c.put(request, copy)).catch(() => {});
        return res;
      }).catch(() => hit))
    );
    return;
  }

  // Navigation + shell + data: cache-first, then network, offline fallback to '/'.
  e.respondWith(
    caches.match(request).then(hit => {
      if (hit) return hit;
      return fetch(request).then(res => {
        if (res.ok && (url.origin === location.origin)) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
