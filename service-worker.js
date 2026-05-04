const CACHE_NAME = 'beredskapskart-v4';
const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.webmanifest',
  '/icons/pwa-icon.svg',
  '/data/routing/agder-routing-graph.json.gz',
  '/data/datasett/tilfluktsrom.geojson',
  '/data/datasett/brannstasjoner.geojson',
  '/data/datasett/drikkevann.geojson',
  '/data/datasett/sykehus.geojson',
  'https://unpkg.com/maplibre-gl@5.1.0/dist/maplibre-gl.css',
  'https://unpkg.com/maplibre-gl@5.1.0/dist/maplibre-gl.js',
  'https://unpkg.com/pmtiles@3.2.0/dist/pmtiles.js',
  'https://unpkg.com/@turf/turf/turf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(APP_SHELL_ASSETS.map(async (url) => {
      try {
        await cache.add(url);
      } catch (error) {
        console.warn('Cache warmup skipped for', url, error);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

function isSameOriginAsset(requestUrl) {
  return requestUrl.origin === self.location.origin;
}

// JS/HTML/CSS — fetch from network first so code updates always take effect
function isAppShellCode(requestUrl) {
  const p = requestUrl.pathname;
  return p === '/' || p === '/index.html' || p === '/app.js' ||
    p.endsWith('.css') || p.endsWith('.js');
}

// GeoJSON data and icons — cache-first for offline availability
function isOfflineData(requestUrl) {
  const p = requestUrl.pathname;
  return p.startsWith('/data/') || p.startsWith('/icons/') ||
    p === '/manifest.webmanifest';
}

function isTileRequest(requestUrl) {
  return requestUrl.hostname.endsWith('tile.openstreetmap.org');
}

function isApiRequest(requestUrl) {
  return requestUrl.hostname.includes('supabase.co') ||
    requestUrl.hostname.includes('nominatim.openstreetmap.org') ||
    requestUrl.hostname.includes('routing.openstreetmap.de') ||
    requestUrl.hostname.includes('router.project-osrm.org') ||
    requestUrl.hostname.includes('overpass-api.de') ||
    requestUrl.hostname.includes('overpass.kumi.systems');
}

function shouldCacheNetworkResponse(response) {
  return !!response && response.ok;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(request);
        if (shouldCacheNetworkResponse(networkResponse)) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put('/index.html', networkResponse.clone());
        }
        return networkResponse;
      } catch {
        return (await caches.match('/index.html')) || Response.error();
      }
    })());
    return;
  }

  if (isSameOriginAsset(requestUrl)) {
    if (isAppShellCode(requestUrl)) {
      // Network-first: always load the latest JS/HTML/CSS when online
      event.respondWith((async () => {
        try {
          const networkResponse = await fetch(request);
          if (shouldCacheNetworkResponse(networkResponse)) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return (await caches.match(request)) || Response.error();
        }
      })());
    } else if (isOfflineData(requestUrl)) {
      // Cache-first: geojson/icons available offline
      event.respondWith((async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const networkResponse = await fetch(request);
          if (shouldCacheNetworkResponse(networkResponse)) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return Response.error();
        }
      })());
    }
    return;
  }

  if (isTileRequest(requestUrl) || isApiRequest(requestUrl)) {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(request);
        if (shouldCacheNetworkResponse(networkResponse)) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        return (await caches.match(request)) || Response.error();
      }
    })());
  }
});