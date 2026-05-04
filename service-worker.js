const CACHE_NAME = 'beredskapskart-v3';
const TILE_CACHE_NAME = 'beredskapskart-tiles-v3';
const MAX_TILE_CACHE_ENTRIES = 500;

// Same-origin paths resolved relative to self.registration.scope at install time.
const SAME_ORIGIN_PATHS = [
  '',
  'index.html',
  'app.js',
  'manifest.webmanifest',
  'icons/pwa-icon.svg',
  'data/routing/agder-routing-graph.json.gz',
  'data/datasett/tilfluktsrom.geojson',
  'data/datasett/brannstasjoner.geojson',
  'data/datasett/drikkevann.geojson',
  'data/datasett/sykehus.geojson',
];

const CDN_ASSETS = [
  'https://unpkg.com/maplibre-gl@5.1.0/dist/maplibre-gl.css',
  'https://unpkg.com/maplibre-gl@5.1.0/dist/maplibre-gl.js',
  'https://unpkg.com/pmtiles@3.2.0/dist/pmtiles.js',
  'https://unpkg.com/@turf/turf/turf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const scope = self.registration.scope;
    const cache = await caches.open(CACHE_NAME);
    const sameOriginUrls = SAME_ORIGIN_PATHS.map(p => new URL(p, scope).href);
    await Promise.allSettled([...sameOriginUrls, ...CDN_ASSETS].map(async (url) => {
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
      keys.filter((key) => key !== CACHE_NAME && key !== TILE_CACHE_NAME).map((key) => caches.delete(key))
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

// CDN origins whose assets are pre-cached during install and should be served cache-first.
function isCdnAsset(requestUrl) {
  return requestUrl.hostname === 'unpkg.com' ||
    requestUrl.hostname === 'cdnjs.cloudflare.com' ||
    requestUrl.hostname === 'cdn.jsdelivr.net';
}

function isApiRequest(requestUrl) {
  return requestUrl.hostname.includes('supabase.co') ||
    requestUrl.hostname.includes('nominatim.openstreetmap.org') ||
    requestUrl.hostname.includes('routing.openstreetmap.de') ||
    requestUrl.hostname.includes('router.project-osrm.org') ||
    requestUrl.hostname.includes('overpass-api.de') ||
    requestUrl.hostname.includes('overpass.kumi.systems');
}

// allowOpaque: also accept opaque (no-cors cross-origin) responses, e.g. map tiles and CDN assets.
function shouldCacheNetworkResponse(response, allowOpaque = false) {
  if (!response) return false;
  if (response.ok) return true;
  return allowOpaque && response.type === 'opaque';
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await Promise.all(keys.slice(0, keys.length - maxEntries).map(key => cache.delete(key)));
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const indexUrl = new URL('index.html', self.registration.scope).href;
      try {
        const networkResponse = await fetch(request);
        if (shouldCacheNetworkResponse(networkResponse)) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(indexUrl, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        return (await caches.match(indexUrl)) || Response.error();
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

  // CDN assets (pre-cached at install): serve from cache first, fall back to network.
  if (isCdnAsset(requestUrl)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      try {
        const networkResponse = await fetch(request);
        if (shouldCacheNetworkResponse(networkResponse, true)) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        return Response.error();
      }
    })());
    return;
  }

  // Map tiles: network-first with a bounded cache to avoid unbounded storage growth.
  if (isTileRequest(requestUrl)) {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(request);
        if (shouldCacheNetworkResponse(networkResponse, true)) {
          const cache = await caches.open(TILE_CACHE_NAME);
          await cache.put(request, networkResponse.clone());
          await trimCache(TILE_CACHE_NAME, MAX_TILE_CACHE_ENTRIES);
        }
        return networkResponse;
      } catch {
        return (await caches.match(request)) || Response.error();
      }
    })());
    return;
  }

  // API requests (routing, geocoding, database): pass through without caching to avoid
  // unbounded cache growth and persisting user-specific location queries.
  if (isApiRequest(requestUrl)) {
    event.respondWith(fetch(request).catch(() => Response.error()));
  }
});
