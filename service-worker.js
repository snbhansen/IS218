const CACHE_NAME = 'beredskapskart-v2';
const PMTILES_PATH = '/data/tiles/norway.pmtiles';
const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.webmanifest',
  '/icons/pwa-icon.svg',
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
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    // Best-effort warmup of the PMTiles archive to make offline basemap deterministic after first load.
    await warmPmtilesCache();
    await self.clients.claim();
  })());
});

function isSameOriginAsset(requestUrl) {
  return requestUrl.origin === self.location.origin;
}

function isPmtilesRequest(requestUrl) {
  return requestUrl.pathname === PMTILES_PATH;
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

function getPmtilesAbsoluteUrl() {
  return new URL(PMTILES_PATH, self.location.origin).toString();
}

function shouldCacheNetworkResponse(response) {
  // Never cache failed/opaque error responses for core app flows.
  // This avoids poisoning Cache Storage with unusable entries.
  return !!response && response.ok;
}

async function warmPmtilesCache() {
  const cache = await caches.open(CACHE_NAME);
  const pmtilesUrl = getPmtilesAbsoluteUrl();
  const cached = await cache.match(pmtilesUrl);
  if (cached) return;

  try {
    // Do not trust navigator.onLine in a service worker; attempt fetch directly.
    const response = await fetch(pmtilesUrl, { cache: 'no-store' });
    if (shouldCacheNetworkResponse(response)) {
      await cache.put(pmtilesUrl, response.clone());
    }
  } catch {
    // Keep activation resilient if warmup fails.
  }
}

async function getOrCacheFullPmtilesResponse() {
  const cache = await caches.open(CACHE_NAME);
  const pmtilesUrl = getPmtilesAbsoluteUrl();
  let fullResponse = await cache.match(pmtilesUrl);
  if (fullResponse) return fullResponse;

  const networkResponse = await fetch(pmtilesUrl, { cache: 'no-store' });
  if (!networkResponse || !networkResponse.ok) {
    return null;
  }

  await cache.put(pmtilesUrl, networkResponse.clone());
  return networkResponse;
}

function parseByteRangeHeader(rangeHeader, totalLength) {
  if (!rangeHeader || !rangeHeader.startsWith('bytes=')) return null;
  const rangeSpec = rangeHeader.replace('bytes=', '').split(',')[0].trim();
  const [startStr, endStr] = rangeSpec.split('-');

  let start;
  let end;

  if (startStr === '') {
    // Suffix-byte range: bytes=-N
    const suffixLength = Number(endStr);
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) return null;
    start = Math.max(totalLength - suffixLength, 0);
    end = totalLength - 1;
  } else {
    start = Number(startStr);
    end = endStr === '' ? totalLength - 1 : Number(endStr);
  }

  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (start < 0 || end < 0 || start > end || start >= totalLength) return null;

  end = Math.min(end, totalLength - 1);
  return { start, end };
}

function buildPartialContentResponse(fullResponse, fullArrayBuffer, range) {
  const totalLength = fullArrayBuffer.byteLength;
  const { start, end } = range;
  const slice = fullArrayBuffer.slice(start, end + 1);
  const contentType = fullResponse.headers.get('Content-Type') || 'application/octet-stream';

  return new Response(slice, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${totalLength}`,
      'Content-Length': String(end - start + 1)
    }
  });
}

async function handlePmtilesRequest(request) {
  const rangeHeader = request.headers.get('Range');

  let fullResponse;
  try {
    fullResponse = await getOrCacheFullPmtilesResponse();
  } catch {
    fullResponse = null;
  }

  if (!fullResponse) {
    return new Response('PMTiles archive is not cached yet and network is unavailable.', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }

  if (!rangeHeader) {
    return fullResponse;
  }

  const fullArrayBuffer = await fullResponse.clone().arrayBuffer();
  const totalLength = fullArrayBuffer.byteLength;
  const parsedRange = parseByteRangeHeader(rangeHeader, totalLength);

  if (!parsedRange) {
    return new Response(null, {
      status: 416,
      statusText: 'Range Not Satisfiable',
      headers: {
        'Content-Range': `bytes */${totalLength}`,
        'Accept-Ranges': 'bytes'
      }
    });
  }

  return buildPartialContentResponse(fullResponse, fullArrayBuffer, parsedRange);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);

  if (isPmtilesRequest(requestUrl)) {
    event.respondWith(handlePmtilesRequest(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        if (shouldCacheNetworkResponse(networkResponse)) {
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
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        if (shouldCacheNetworkResponse(networkResponse)) {
          await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        return cached || Response.error();
      }
    })());
    return;
  }

  if (isTileRequest(requestUrl) || isApiRequest(requestUrl)) {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        if (shouldCacheNetworkResponse(networkResponse)) {
          await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        return (await caches.match(request)) || Response.error();
      }
    })());
  }
});
