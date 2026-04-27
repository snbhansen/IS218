// --- TRANSLATIONS ---
const TRANSLATIONS = {
    en: {
        searchPlaceholder: 'Search address...',
        chipDrinkingWater: 'Drinking Water',
        chipFireStations: 'Fire Stations',
        chipHospitals: 'Hospitals',
        chipShelters: 'Shelters',
        advanced: 'Advanced',
        view2d: '2D Map',
        viewTerrain: '3D Terrain',
        view3d: '3D City',
        view3dLoading: 'Loading 3D...',
        languageLabel: 'Language',
        findNearest: 'Find nearest',
        catShelter: 'Shelter',
        catHospital: 'Hospital',
        catFireStation: 'Fire Station',
        catWater: 'Water',
        modeWalk: 'Walk',
        modeDrive: 'Drive',
        resultLabel: 'Distance / Time',
        resultTo: 'To:',
        resultFrom: 'From pin',
        findAllInRange: 'Find all within range',
        clickToSearch: 'Click map to search',
        clickModeOn: 'Click mode ON – click map',
        pinpointMode: 'Pin location → route',
        pinpointModeOn: 'Tap map to drop pin',
        clearRoute: 'Clear',
        layers: 'Layers',
        noResults: 'No resources found within radius.',
        resourcesWithin: 'resource(s) within',
        meters: 'm',
    },
    no: {
        searchPlaceholder: 'Søk etter adresse...',
        chipDrinkingWater: 'Drikkevann',
        chipFireStations: 'Brannstasjoner',
        chipHospitals: 'Sykehus',
        chipShelters: 'Tilfluktsrom',
        advanced: 'Avansert',
        view2d: '2D-kart',
        viewTerrain: '3D-terreng',
        view3d: '3D-by',
        view3dLoading: 'Laster 3D...',
        languageLabel: 'Språk',
        findNearest: 'Finn nærmeste',
        catShelter: 'Tilfluktsrom',
        catHospital: 'Sykehus',
        catFireStation: 'Brannstasjon',
        catWater: 'Vann',
        modeWalk: 'Gå',
        modeDrive: 'Kjør',
        resultLabel: 'Avstand / Tid',
        resultTo: 'Til:',
        resultFrom: 'Fra pin',
        findAllInRange: 'Finn alle i nærheten',
        clickToSearch: 'Klikk på kartet for å søke',
        clickModeOn: 'Klikkemodus PÅ – klikk på kart',
        pinpointMode: 'Fest pin → rute',
        pinpointModeOn: 'Trykk på kartet for å feste pin',
        clearRoute: 'Fjern',
        layers: 'Lag',
        noResults: 'Ingen ressurser funnet innenfor radius.',
        resourcesWithin: 'ressurs(er) innenfor',
        meters: 'm',
    },
    de: {
        searchPlaceholder: 'Adresse suchen...',
        chipDrinkingWater: 'Trinkwasser',
        chipFireStations: 'Feuerwehrstationen',
        chipHospitals: 'Krankenhäuser',
        chipShelters: 'Schutzräume',
        advanced: 'Erweitert',
        view2d: '2D-Karte',
        viewTerrain: '3D-Gelände',
        view3d: '3D-Stadt',
        view3dLoading: 'Lädt 3D...',
        languageLabel: 'Sprache',
        findNearest: 'Nächste finden',
        catShelter: 'Schutzraum',
        catHospital: 'Krankenhaus',
        catFireStation: 'Feuerwehr',
        catWater: 'Wasser',
        modeWalk: 'Zu Fuß',
        modeDrive: 'Fahren',
        resultLabel: 'Entfernung / Zeit',
        resultTo: 'Nach:',
        resultFrom: 'Von Pin',
        findAllInRange: 'Alle im Umkreis finden',
        clickToSearch: 'Karte klicken zum Suchen',
        clickModeOn: 'Klickmodus AN – Karte klicken',
        pinpointMode: 'Pin setzen → Route',
        pinpointModeOn: 'Karte tippen für Pin',
        clearRoute: 'Löschen',
        layers: 'Ebenen',
        noResults: 'Keine Ressourcen im Radius gefunden.',
        resourcesWithin: 'Ressource(n) innerhalb',
        meters: 'm',
    },
    fr: {
        searchPlaceholder: 'Rechercher une adresse...',
        chipDrinkingWater: 'Eau potable',
        chipFireStations: 'Casernes de pompiers',
        chipHospitals: 'Hôpitaux',
        chipShelters: 'Abris',
        advanced: 'Avancé',
        view2d: 'Carte 2D',
        viewTerrain: 'Terrain 3D',
        view3d: 'Ville 3D',
        view3dLoading: 'Chargement 3D...',
        languageLabel: 'Langue',
        findNearest: 'Trouver le plus proche',
        catShelter: 'Abri',
        catHospital: 'Hôpital',
        catFireStation: 'Pompiers',
        catWater: 'Eau',
        modeWalk: 'Marcher',
        modeDrive: 'Conduire',
        resultLabel: 'Distance / Temps',
        resultTo: 'Vers:',
        resultFrom: 'Depuis pin',
        findAllInRange: 'Trouver tous dans le rayon',
        clickToSearch: 'Cliquer sur la carte',
        clickModeOn: 'Mode clic ACTIF – cliquer sur la carte',
        pinpointMode: 'Épingler → itinéraire',
        pinpointModeOn: 'Toucher la carte pour épingler',
        clearRoute: 'Effacer',
        layers: 'Couches',
        noResults: 'Aucune ressource trouvée dans le rayon.',
        resourcesWithin: 'ressource(s) dans',
        meters: 'm',
    },
    uk: {
        searchPlaceholder: 'Пошук адреси...',
        chipDrinkingWater: 'Питна вода',
        chipFireStations: 'Пожежні станції',
        chipHospitals: 'Лікарні',
        chipShelters: 'Укриття',
        advanced: 'Розширений',
        view2d: '2D-карта',
        viewTerrain: '3D-рельєф',
        view3d: '3D-місто',
        view3dLoading: 'Завантаження 3D...',
        languageLabel: 'Мова',
        findNearest: 'Знайти найближче',
        catShelter: 'Укриття',
        catHospital: 'Лікарня',
        catFireStation: 'Пожежна',
        catWater: 'Вода',
        modeWalk: 'Пішки',
        modeDrive: 'Їхати',
        resultLabel: 'Відстань / Час',
        resultTo: 'До:',
        resultFrom: 'Від піна',
        findAllInRange: 'Знайти всіх у радіусі',
        clickToSearch: 'Клікніть на карті для пошуку',
        clickModeOn: 'Режим кліку УВІМК – клікніть на карті',
        pinpointMode: 'Пін → маршрут',
        pinpointModeOn: 'Натисніть карту для піна',
        clearRoute: 'Очистити',
        layers: 'Шари',
        noResults: 'Ресурсів у радіусі не знайдено.',
        resourcesWithin: 'ресурс(ів) у межах',
        meters: 'м',
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    const t = TRANSLATIONS[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key] !== undefined) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key] !== undefined) el.placeholder = t[key];
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    const clickBtn = document.getElementById('btn-click-mode');
    if (clickBtn) {
        clickBtn.innerHTML = clickModeActive
            ? `<i class="fa-solid fa-circle-xmark"></i> ${t.clickModeOn}`
            : `<i class="fa-solid fa-crosshairs"></i> ${t.clickToSearch}`;
    }

    const pinBtn = document.getElementById('btn-pinpoint-mode');
    if (pinBtn) {
        pinBtn.innerHTML = pinpointModeActive
            ? `<i class="fa-solid fa-circle-xmark"></i> <span>${t.pinpointModeOn}</span>`
            : `<i class="fa-solid fa-map-pin"></i> <span>${t.pinpointMode}</span>`;
    }
}

// --- SUPABASE KONFIGURASJON ---
const SUPABASE_URL = 'https://wqfpqpvdicvejbvnplcf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZnBxcHZkaWN2ZWpidm5wbGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDMyMzEsImV4cCI6MjA4NTc3OTIzMX0.S7Hl1YuOmzN6VpZTUnHus1PGUNb8r7bWGdcDdubys9o';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// GLOBAL VARIABLES
let map;
let currentPos = null;
let transportMode = 'walking';
let userMarker = null;
let mapLoaded = false;
let dataCache = {
    tilfluktsrom: null,
    brannstasjoner: null,
    drikkevann: null,
    sykehus: null
};
const NORWAY_3D_SOURCE_ID = 'norway-3d-buildings-source';
const NORWAY_3D_LAYER_ID = 'norway-3d-buildings-layer';
const NORWAY_3D_FOOTPRINT_LAYER_ID = 'norway-3d-footprints-layer';
const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
];
const NORWAY_BOUNDS = {
    west: 4.0,
    south: 57.7,
    east: 31.5,
    north: 81.0
};
const NORWAY_3D_CAMERA = {
    zoom: 16.3,
    pitch: 60,
    bearing: -18
};
const MIN_3D_BUILDING_ZOOM = 14.2;
let terrainActive = false;
let city3DActive = false;
let activeCategory = 'tilfluktsrom';
let viewStateBefore3D = null;
const norway3DBuildingCache = new Map();
let current3DBuildingAreaKey = null;
let pending3DBuildingAreaKey = null;
let norway3DBuildingsPromise = null;
let suppress3DBuildingRefresh = false;
let threeDViewTrackingBound = false;
// --- NY HJELPEFUNKSJON SOM HÅNDTERER HEX-KODE ---
async function fetchGeoJSON(tableName) {
    console.log(`Henter data fra tabell: ${tableName}...`);

    // Vi henter alt data som det er
    const { data, error } = await supabaseClient
        .from(tableName)
        .select('*');

    if (error) {
        console.error(`Feil fra Supabase (${tableName}):`, error);
        return null;
    }

    const features = data.map(row => {
        const { location, ...properties } = row;
        if (!location) return null;

        // Helper: parse 8-byte float from hex (little-endian)
        const parseHexFloat = (h) => {
            const bytes = h.match(/.{1,2}/g) || [];
            if (bytes.length !== 8) throw new Error('Invalid float hex');
            const view = new DataView(new ArrayBuffer(8));
            bytes.forEach((b, i) => view.setUint8(i, parseInt(b, 16)));
            return view.getFloat64(0, true);
        };

        let geometry = null;

        // Case A: location is a JSON string (GeoJSON)
        if (typeof location === 'string') {
            try {
                const parsed = JSON.parse(location);
                if (parsed && parsed.type) geometry = parsed;
            } catch (e) {
                // Fallback: try to interpret as PostGIS WKB hex (very common prefix 01010000)
                const hex = location.replace(/^0x/i, '');
                if (hex && hex.length >= 50 && /^01010000/i.test(hex)) {
                    try {
                        const lonHex = hex.substring(18, 34);
                        const latHex = hex.substring(34, 50);
                        const lon = parseHexFloat(lonHex);
                        const lat = parseHexFloat(latHex);
                        geometry = { type: 'Point', coordinates: [lon, lat] };
                    } catch (err) {
                        console.warn('Kunne ikke tolke WKB-hex for rad:', err);
                    }
                }
            }
        }

        // Case B: location is already an object
        if (!geometry && typeof location === 'object') {
            if (location.type) geometry = location;
            else if (location.coordinates) geometry = { type: 'Point', coordinates: location.coordinates };
        }

        if (!geometry) return null;

        // Convert non-point geometries to a representative point
        if (geometry.type !== 'Point') {
            try {
                const pt = turf.pointOnFeature(geometry);
                geometry = pt.geometry;
            } catch (err) {
                console.warn('Kunne ikke regne ut punkt fra geometri:', err);
                return null;
            }
        }

        return { type: 'Feature', geometry, properties };

    }).filter(f => f !== null);

    console.log(`Ferdig behandlet ${features.length} punkter for ${tableName}.`);
    return { type: 'FeatureCollection', features: features };
}

// MAP SETUP
const mapStyle = {
    'version': 8,
    'sources': {
        'osm': {
            'type': 'raster',
            'tiles': ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            'tileSize': 256,
            'maxzoom': 19,
            'attribution': '&copy; OpenStreetMap Contributors'
        },
        'kartverket-topo': {
            'type': 'raster',
            'tiles': ['https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png'],
            'tileSize': 256,
            'maxzoom': 20,
            'attribution': '&copy; Kartverket'
        },
        'kartverket-farger': {
            'type': 'raster',
            'tiles': ['https://cache.kartverket.no/v1/wmts/1.0.0/topograatone/default/webmercator/{z}/{y}/{x}.png'],
            'tileSize': 256,
            'maxzoom': 20,
            'attribution': '&copy; Kartverket'
        },
        'kartverket-graatone': {
            'type': 'raster',
            'tiles': ['https://cache.kartverket.no/v1/wmts/1.0.0/toporaster/default/webmercator/{z}/{y}/{x}.png'],
            'tileSize': 256,
            'maxzoom': 20,
            'attribution': '&copy; Kartverket'
        }
    },
    'layers': [
        {
            'id': 'osm-layer',
            'type': 'raster',
            'source': 'osm'
        },
        {
            'id': 'kartverket-topo-layer',
            'type': 'raster',
            'source': 'kartverket-topo',
            'layout': { 'visibility': 'none' }
        },
        {
            'id': 'kartverket-farger-layer',
            'type': 'raster',
            'source': 'kartverket-farger',
            'layout': { 'visibility': 'none' }
        },
        {
            'id': 'kartverket-graatone-layer',
            'type': 'raster',
            'source': 'kartverket-graatone',
            'layout': { 'visibility': 'none' }
        }
    ]
};

try {
    map = new maplibregl.Map({
        container: 'map',
        style: mapStyle,
        center: [8.0182, 58.1467], // Kristiansand
        zoom: 12,
        canvasContextAttributes: { antialias: true }
    });
    // Standard navigation control (zoom in/out) er fjernet herfra for å gi plass til vår custom 2x2 grid.
} catch (err) { console.error("Map error:", err); }

// DATA LOADING
map.on('load', async () => {
    console.log("Map loaded. Fetching data from Supabase...");
    mapLoaded = true;

    // Satelittlag — legges til FØRST slik at de alltid ligger under alle andre lag
    map.addSource('sentinel2-source', {
        type: 'raster',
        tiles: ['https://wms.geonorge.no/skwms1/wms.sentinel2?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=2025'],
        tileSize: 256,
        maxzoom: 14
    });
    map.addLayer({ id: 'sentinel2-layer', type: 'raster', source: 'sentinel2-source', layout: { visibility: 'none' } });

    // Flybilder — høyoppløselig flyfoto via Esri World Imagery, brukes ved høy zoom
    map.addSource('ortofoto-source', {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        maxzoom: 17,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS'
    });
    map.addLayer({ id: 'ortofoto-layer', type: 'raster', source: 'ortofoto-source', layout: { visibility: 'none' } });

    // Prøv å laste ikon
    let iconLoaded = false;
    try { await loadTilfluktsromIcon(map); iconLoaded = true; } catch (e) { }

    // 1. Hent Tilfluktsrom
    const shelters = await fetchGeoJSON('tilfluktsrom');
    if (shelters) {
        dataCache.tilfluktsrom = shelters;
        map.addSource('tilfluktsrom-source', { type: 'geojson', data: shelters });

        if (iconLoaded) {
            map.addLayer({
                id: 'tilfluktsrom-layer',
                type: 'symbol',
                source: 'tilfluktsrom-source',
                layout: { 'icon-image': 'tilfluktsrom-icon', 'icon-size': 0.2, 'icon-allow-overlap': true }
            });
        } else {
            map.addLayer({
                id: 'tilfluktsrom-layer',
                type: 'circle',
                source: 'tilfluktsrom-source',
                paint: { 'circle-radius': 8, 'circle-color': '#FFD700', 'circle-stroke-width': 2, 'circle-stroke-color': '#000' }
            });
        }
    }

    // 2. Hent Brannstasjoner
    const stations = await fetchGeoJSON('brannstasjoner');
    if (stations) {
        dataCache.brannstasjoner = stations;
        map.addSource('brannstasjoner', { type: 'geojson', data: stations });
        map.addLayer({
            id: 'brannstasjoner-layer',
            type: 'circle',
            source: 'brannstasjoner',
            paint: { 'circle-radius': 6, 'circle-color': '#ef4444', 'circle-stroke-width': 1, 'circle-stroke-color': '#FFF' }
        });
    }

    // 3. Hent Drikkevann 
    const drinkingWater = await fetchGeoJSON('drikkevann');
    if (drinkingWater) {
        dataCache.drikkevann = drinkingWater;
        map.addSource('drikkevann-source', { type: 'geojson', data: drinkingWater });
        map.addLayer({
            id: 'drikkevann-layer',
            type: 'circle',
            source: 'drikkevann-source',
            paint: { 'circle-radius': 6, 'circle-color': '#3b82f6', 'circle-stroke-width': 1, 'circle-stroke-color': '#FFF' }
        });
    }

    // 4. Hent Sykehuser
    // Her må vi håndtere det spesielle WKT-formatet som Supabase returnerer for geometri.
    async function fetchHospitals() {
        console.log("Henter data fra sykehus...");
        const { data, error } = await supabaseClient
            .from('sykehus')
            .select('name, phone, WKT');

        if (error) {
            console.error("Feil fra Supabase (sykehus):", error);
            return null;
        }

        const features = data.map(row => {
            if (!row.WKT || row.WKT.type !== 'Point') return null;

            return {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: row.WKT.coordinates },
                properties: {
                    name: row.name,
                    phone: row.phone || null
                }
            };
        }).filter(f => f !== null);

        console.log(`Ferdig behandlet ${features.length} sykehus-punkter.`);
        return { type: 'FeatureCollection', features };
    }
    const hospitals = await fetchHospitals();

    if (hospitals) {
        dataCache.sykehus = hospitals;
        map.addSource('sykehus', { type: 'geojson', data: hospitals });
        map.addLayer({
            id: 'sykehus-layer',
            type: 'circle',
            source: 'sykehus',
            paint: { 'circle-radius': 6, 'circle-color': '#10b981', 'circle-stroke-width': 1, 'circle-stroke-color': '#FFF' }
        });
    }

    // 4. Rute-lag (tomt foreløpig) - bruk FeatureCollection som utgangspunkt
    map.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.addLayer({
        id: 'route-layer-casing',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#ffffff', 'line-width': 10, 'line-opacity': 0.8 }
    });
    map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#1d4ed8', 'line-width': 5, 'line-opacity': 0.95 }
    });

    // Base map switcher
    const BASE_LAYERS = {
        'osm':      'osm-layer',
        'raster':   'kartverket-topo-layer',
        'farger':   'kartverket-farger-layer',
        'graatone': 'kartverket-graatone-layer'
    };
    let activeBaseMap = 'osm';

    const FLYBILDER_ZOOM_THRESHOLD = 13;
    const SATELLITE_MAX_ZOOM = 18;

    function updateSatelliteLayers(isActive) {
        if (!isActive) {
            map.setLayoutProperty('sentinel2-layer', 'visibility', 'none');
            map.setLayoutProperty('ortofoto-layer', 'visibility', 'none');
            updateFlybilderBadge(false);
            return;
        }
        const useFlybilder = map.getZoom() >= FLYBILDER_ZOOM_THRESHOLD;
        map.setLayoutProperty('sentinel2-layer', 'visibility', useFlybilder ? 'none' : 'visible');
        map.setLayoutProperty('ortofoto-layer', 'visibility', useFlybilder ? 'visible' : 'none');
        updateFlybilderBadge(useFlybilder);
    }

    function updateFlybilderBadge(show) {
        let badge = document.getElementById('flybilder-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'flybilder-badge';
            badge.textContent = 'Flybilder';
            badge.style.cssText = [
                'position:absolute', 'bottom:40px', 'left:50%', 'transform:translateX(-50%)',
                'background:rgba(26,115,232,0.88)', 'color:#fff', 'font-size:12px',
                'font-weight:700', 'padding:4px 12px', 'border-radius:12px',
                'pointer-events:none', 'z-index:1200', 'display:none',
                'box-shadow:0 2px 8px rgba(0,0,0,0.22)', 'transition:opacity 0.3s ease',
                'font-family:Inter,Arial,sans-serif'
            ].join(';');
            document.body.appendChild(badge);
        }
        badge.style.display = show ? 'block' : 'none';
    }

    function switchBaseMap(key) {
        activeBaseMap = key;
        const isSatellite = key === 'satellite';
        Object.entries(BASE_LAYERS).forEach(([k, layerId]) => {
            map.setLayoutProperty(layerId, 'visibility', (!isSatellite && k === key) ? 'visible' : 'none');
        });
        if (isSatellite) {
            map.setMaxZoom(SATELLITE_MAX_ZOOM);
        } else {
            map.setMaxZoom(22);
        }
        updateSatelliteLayers(isSatellite);
        document.querySelectorAll('#basemap-selector .basemap-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.basemap === key);
        });
    }

    document.querySelectorAll('#basemap-selector .basemap-btn').forEach(btn => {
        btn.addEventListener('click', () => switchBaseMap(btn.dataset.basemap));
    });

    map.on('zoom', () => {
        if (activeBaseMap === 'satellite') updateSatelliteLayers(true);
    });

    // Terrain DEM source — AWS Terrain Tiles (Terrarium encoding, no API key needed)
    map.addSource('terrain-dem', {
        type: 'raster-dem',
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        tileSize: 256,
        encoding: 'terrarium'
    });

    setupControls();
    setTimeout(function () { if (typeof startInfoBarSync === 'function') startInfoBarSync(); }, 400);
});
// --- 2D / 3D VIEW MODE HELPERS ---
function setupViewModeToggle() {
    const btn2D = document.getElementById('btn-view-2d');
    const btn3D = document.getElementById('btn-view-3d');
    const btnTerrain = document.getElementById('btn-view-terrain');
    if (!btn2D || !btn3D || !btnTerrain || btn2D.dataset.bound === 'true') return;

    btn2D.dataset.bound = 'true';
    btn2D.addEventListener('click', restore2DMapView);
    btnTerrain.addEventListener('click', toggleTerrainView);
    btn3D.addEventListener('click', toggle3DCityView);
    updateViewModeToggle(false);
}

function setup3DViewTracking() {
    if (threeDViewTrackingBound) return;

    threeDViewTrackingBound = true;
    map.on('moveend', () => {
        if (!city3DActive || suppress3DBuildingRefresh) return;

        syncNorway3DBuildingsToCurrentView().catch(error => {
            console.warn('Could not refresh Norway 3D buildings after moving the map:', error);
        });
    });
}

function updateViewModeToggle(isLoading) {
    const btn2D = document.getElementById('btn-view-2d');
    const btn3D = document.getElementById('btn-view-3d');
    const btnTerrain = document.getElementById('btn-view-terrain');
    if (!btn2D || !btn3D || !btnTerrain) return;

    const in2D = !terrainActive && !city3DActive;

    btn2D.classList.toggle('active', in2D);
    btnTerrain.classList.toggle('active', terrainActive);
    btn3D.classList.toggle('active', city3DActive);

    btn2D.setAttribute('aria-pressed', in2D ? 'true' : 'false');
    btnTerrain.setAttribute('aria-pressed', terrainActive ? 'true' : 'false');
    btn3D.setAttribute('aria-pressed', city3DActive ? 'true' : 'false');

    btn2D.disabled = !!isLoading;
    btnTerrain.disabled = !!isLoading;
    btn3D.disabled = !!isLoading;
    btn3D.textContent = isLoading
        ? TRANSLATIONS[currentLang].view3dLoading
        : TRANSLATIONS[currentLang].view3d;
}

function readCameraState() {
    const center = map.getCenter();
    return {
        center: [center.lng, center.lat],
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch()
    };
}

function buildViewModeCameraOptions(baseOptions) {
    const options = { ...baseOptions };
    if (city3DActive) {
        if (typeof options.pitch !== 'number') options.pitch = map.getPitch();
        if (typeof options.bearing !== 'number') options.bearing = map.getBearing();
    }
    return options;
}

function readCurrentMapCenter() {
    const center = map.getCenter();
    return [center.lng, center.lat];
}

function isCoordinateInNorway(coords) {
    const [lng, lat] = coords;
    return lng >= NORWAY_BOUNDS.west && lng <= NORWAY_BOUNDS.east && lat >= NORWAY_BOUNDS.south && lat <= NORWAY_BOUNDS.north;
}

function get3DActivationCenter() {
    const currentCenter = readCurrentMapCenter();
    if (isCoordinateInNorway(currentCenter)) return currentCenter;
    if (currentPos && isCoordinateInNorway(currentPos)) return currentPos;
    return null;
}

function getNorway3DInsertBeforeId() {
    const candidates = ['tilfluktsrom-layer', 'brannstasjoner-layer', 'drikkevann-layer', 'sykehus-layer', 'route-layer-casing', 'route-layer'];
    return candidates.find(layerId => map.getLayer(layerId));
}

function get3DBuildingSearchSizeMeters(zoom) {
    if (zoom >= 16) return 850;
    if (zoom >= 15) return 1200;
    if (zoom >= 14) return 1700;
    return 2400;
}

function build3DBuildingBBox(center, zoom, scale = 1) {
    const [lng, lat] = center;
    const halfSizeMeters = get3DBuildingSearchSizeMeters(zoom) * scale;
    const latDelta = halfSizeMeters / 111320;
    const cosLat = Math.max(Math.cos((lat * Math.PI) / 180), 0.25);
    const lngDelta = halfSizeMeters / (111320 * cosLat);

    return {
        south: Math.max(NORWAY_BOUNDS.south, lat - latDelta),
        west: Math.max(NORWAY_BOUNDS.west, lng - lngDelta),
        north: Math.min(NORWAY_BOUNDS.north, lat + latDelta),
        east: Math.min(NORWAY_BOUNDS.east, lng + lngDelta)
    };
}

function build3DBuildingCacheKey(bbox) {
    return [bbox.south, bbox.west, bbox.north, bbox.east].map(value => value.toFixed(3)).join(':');
}

function buildOverpassBuildingsQuery(bbox) {
    // We only request a small bbox around the current Norway location so the 3D mode can work anywhere in the country.
    return `[out:json][timeout:25];way["building"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});out body geom;`;
}

function parseNumericValue(rawValue) {
    if (rawValue === null || rawValue === undefined) return null;
    const match = String(rawValue).replace(',', '.').match(/-?\d+(\.\d+)?/);
    if (!match) return null;
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : null;
}

function estimateBuildingHeight(tags, featureIndex) {
    const explicitHeight = parseNumericValue(tags && tags.height);
    if (explicitHeight && explicitHeight > 0) return explicitHeight;

    const buildingLevels = parseNumericValue(tags && tags['building:levels']);
    if (buildingLevels && buildingLevels > 0) return Math.max(8, buildingLevels * 3.2);

    const buildingType = tags && tags.building ? tags.building : '';
    const amenity = tags && tags.amenity ? tags.amenity : '';
    if (buildingType === 'church' || buildingType === 'cathedral' || amenity === 'place_of_worship') return 24;
    if (buildingType === 'hospital') return 20;
    if (buildingType === 'commercial' || buildingType === 'office') return 18;

    return 10 + ((featureIndex % 5) * 2);
}

function estimateBuildingBaseHeight(tags) {
    const explicitBaseHeight = parseNumericValue(tags && tags.min_height);
    if (explicitBaseHeight && explicitBaseHeight > 0) return explicitBaseHeight;

    const minLevels = parseNumericValue(tags && tags['building:min_level']);
    if (minLevels && minLevels > 0) return minLevels * 3.2;

    return 0;
}

function pickBuildingColor(tags) {
    const buildingType = tags && tags.building ? tags.building : '';
    const amenity = tags && tags.amenity ? tags.amenity : '';

    if (buildingType === 'church' || buildingType === 'cathedral' || amenity === 'place_of_worship') return '#d97706';
    if (buildingType === 'commercial' || buildingType === 'office') return '#94a3b8';
    if (buildingType === 'hospital') return '#fca5a5';

    return '#d6d3d1';
}

// Overpass returns OSM JSON, so we convert it into GeoJSON before sending it to the MapLibre source.
function convertOverpassBuildingsToGeoJSON(overpassResponse) {
    const elements = overpassResponse && Array.isArray(overpassResponse.elements) ? overpassResponse.elements : [];

    const features = elements
        .filter(element => element.type === 'way' && Array.isArray(element.geometry) && element.geometry.length >= 3)
        .map((element, featureIndex) => {
            const ring = element.geometry
                .map(point => [point.lon, point.lat])
                .filter(coords => Number.isFinite(coords[0]) && Number.isFinite(coords[1]));

            if (ring.length < 3) return null;

            const first = ring[0];
            const last = ring[ring.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
                ring.push([first[0], first[1]]);
            }

            const tags = element.tags || {};
            return {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [ring]
                },
                properties: {
                    osm_id: element.id,
                    name: tags.name || '',
                    height: estimateBuildingHeight(tags, featureIndex),
                    base_height: estimateBuildingBaseHeight(tags),
                    color: pickBuildingColor(tags)
                }
            };
        })
        .filter(feature => feature !== null);

    return {
        type: 'FeatureCollection',
        features
    };
}

async function fetchOverpassBuildings(endpoint, query) {
    const response = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, {
        headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
        throw new Error(`Overpass request failed with status ${response.status}`);
    }

    return response.json();
}

function ensureNorway3DBuildingsLayer(geojson) {
    if (map.getSource(NORWAY_3D_SOURCE_ID)) {
        map.getSource(NORWAY_3D_SOURCE_ID).setData(geojson);
        return;
    }

    map.addSource(NORWAY_3D_SOURCE_ID, {
        type: 'geojson',
        data: geojson
    });

    const beforeId = getNorway3DInsertBeforeId();

    // The Overpass response is converted to GeoJSON so MapLibre can reuse the existing map instance for 3D.
    map.addLayer({
        id: NORWAY_3D_LAYER_ID,
        type: 'fill-extrusion',
        source: NORWAY_3D_SOURCE_ID,
        minzoom: MIN_3D_BUILDING_ZOOM,
        layout: { visibility: 'none' },
        paint: {
            'fill-extrusion-color': ['coalesce', ['get', 'color'], '#d6d3d1'],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['coalesce', ['get', 'base_height'], 0],
            'fill-extrusion-opacity': 0.92,
            'fill-extrusion-vertical-gradient': true
        }
    }, beforeId);

    map.addLayer({
        id: NORWAY_3D_FOOTPRINT_LAYER_ID,
        type: 'line',
        source: NORWAY_3D_SOURCE_ID,
        minzoom: MIN_3D_BUILDING_ZOOM,
        layout: { visibility: 'none' },
        paint: {
            'line-color': '#94a3b8',
            'line-width': 0.6,
            'line-opacity': 0.5
        }
    }, beforeId);
}

function setNorway3DLayerVisibility(isVisible) {
    [NORWAY_3D_LAYER_ID, NORWAY_3D_FOOTPRINT_LAYER_ID].forEach(layerId => {
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
        }
    });
}

async function loadNorway3DBuildingsForBBox(bbox, cacheKey) {
    if (norway3DBuildingCache.has(cacheKey)) {
        ensureNorway3DBuildingsLayer(norway3DBuildingCache.get(cacheKey));
        current3DBuildingAreaKey = cacheKey;
        return;
    }

    if (norway3DBuildingsPromise && pending3DBuildingAreaKey === cacheKey) {
        await norway3DBuildingsPromise;
        return;
    }

    const query = buildOverpassBuildingsQuery(bbox);
    pending3DBuildingAreaKey = cacheKey;
    norway3DBuildingsPromise = (async () => {
        let lastError = null;

        for (const endpoint of OVERPASS_ENDPOINTS) {
            try {
                const overpassResponse = await fetchOverpassBuildings(endpoint, query);
                const geojson = convertOverpassBuildingsToGeoJSON(overpassResponse);
                if (!geojson.features.length) throw new Error('No building footprints returned for this Norway location.');
                norway3DBuildingCache.set(cacheKey, geojson);
                ensureNorway3DBuildingsLayer(geojson);
                current3DBuildingAreaKey = cacheKey;
                return;
            } catch (error) {
                lastError = error;
                console.warn(`3D city load failed from ${endpoint}:`, error);
            }
        }

        throw lastError || new Error('Could not load Norway 3D buildings.');
    })();

    try {
        await norway3DBuildingsPromise;
    } finally {
        norway3DBuildingsPromise = null;
        pending3DBuildingAreaKey = null;
    }
}

async function loadNorway3DBuildingsForCenter(center, zoom = map.getZoom()) {
    if (!isCoordinateInNorway(center)) {
        throw new Error('The 3D city view is only available for locations in Norway.');
    }

    const bboxCandidates = [
        build3DBuildingBBox(center, zoom, 1),
        build3DBuildingBBox(center, zoom, 1.8)
    ];
    let lastError = null;

    for (const bbox of bboxCandidates) {
        const cacheKey = build3DBuildingCacheKey(bbox);

        if (cacheKey === current3DBuildingAreaKey && map.getSource(NORWAY_3D_SOURCE_ID)) {
            return;
        }

        try {
            await loadNorway3DBuildingsForBBox(bbox, cacheKey);
            return;
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('Could not load Norway 3D buildings.');
}

async function syncNorway3DBuildingsToCurrentView() {
    if (!city3DActive) return;

    const center = readCurrentMapCenter();
    if (!isCoordinateInNorway(center) || map.getZoom() < MIN_3D_BUILDING_ZOOM) {
        setNorway3DLayerVisibility(false);
        return;
    }

    await loadNorway3DBuildingsForCenter(center, map.getZoom());
    setNorway3DLayerVisibility(true);
}

async function toggle3DCityView() {
    if (!mapLoaded) return;

    if (city3DActive) {
        city3DActive = false;
        suppress3DBuildingRefresh = false;
        setNorway3DLayerVisibility(false);
        if (!terrainActive) map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
        updateViewModeToggle(false);
        return;
    }

    const targetCenter = get3DActivationCenter();
    if (!targetCenter) {
        alert('Zoom or search to a location in Norway before opening the 3D city view.');
        return;
    }

    updateViewModeToggle(true);

    if (!terrainActive && !city3DActive) viewStateBefore3D = readCameraState();

    try {
        await loadNorway3DBuildingsForCenter(targetCenter, NORWAY_3D_CAMERA.zoom);
        city3DActive = true;
        setNorway3DLayerVisibility(true);

        suppress3DBuildingRefresh = true;
        map.once('moveend', () => {
            suppress3DBuildingRefresh = false;
            syncNorway3DBuildingsToCurrentView().catch(error => {
                console.warn('Could not sync Norway 3D buildings after entering 3D mode:', error);
            });
        });

        map.easeTo({
            center: targetCenter,
            zoom: Math.max(map.getZoom(), NORWAY_3D_CAMERA.zoom),
            pitch: NORWAY_3D_CAMERA.pitch,
            bearing: NORWAY_3D_CAMERA.bearing,
            duration: 2200,
            essential: true
        });
    } catch (error) {
        console.error('Could not activate 3D city view:', error);
        alert('No 3D city buildings were found for that Norway location yet. Try zooming closer to a town or city and try again.');
    } finally {
        updateViewModeToggle(false);
    }
}

function restore2DMapView() {
    if (!mapLoaded || (!terrainActive && !city3DActive)) return;

    const targetState = viewStateBefore3D || {
        center: [8.0182, 58.1467],
        zoom: 12,
        bearing: 0,
        pitch: 0
    };

    terrainActive = false;
    city3DActive = false;
    suppress3DBuildingRefresh = false;
    setNorway3DLayerVisibility(false);

    map.setTerrain(null);
    if (map.getLayer('sky-layer')) map.removeLayer('sky-layer');

    map.flyTo({
        center: targetState.center,
        zoom: targetState.zoom,
        bearing: targetState.bearing,
        pitch: targetState.pitch,
        duration: 1700,
        essential: true
    });
    updateViewModeToggle(false);
}

function toggleTerrainView() {
    if (!mapLoaded) return;

    if (terrainActive) {
        terrainActive = false;
        map.setTerrain(null);
        if (!city3DActive) {
            if (map.getLayer('sky-layer')) map.removeLayer('sky-layer');
            map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
        }
        updateViewModeToggle(false);
        return;
    }

    if (!terrainActive && !city3DActive) viewStateBefore3D = readCameraState();

    terrainActive = true;

    // Set terrain and sky BEFORE flyTo — setting terrain mid-animation freezes the renderer
    map.setTerrain({ source: 'terrain-dem', exaggeration: 1.5 });

    if (!map.getLayer('sky-layer')) {
        try {
            map.addLayer({
                id: 'sky-layer',
                type: 'sky',
                paint: {
                    'sky-type': 'atmosphere',
                    'sky-atmosphere-sun': [0.0, 90.0],
                    'sky-atmosphere-sun-intensity': 15
                }
            });
        } catch (e) { console.warn('sky layer not supported:', e); }
    }

    if (!city3DActive) {
        const center = map.getCenter();
        map.flyTo({
            center: [center.lng, center.lat],
            zoom: map.getZoom(),
            pitch: 55,
            bearing: -20,
            duration: 1800,
            essential: true
        });
    }

    updateViewModeToggle(false);
}
let clickModeActive = false;
let clickMarker = null;
let nearbyMarkers = [];
let pinpointModeActive = false;
let pinpointMarker = null;
let destinationMarker = null;

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('radius-slider');
    const label = document.getElementById('radius-label');
    if (slider) slider.addEventListener('input', () => { label.textContent = slider.value + ' m'; });

    const btn = document.getElementById('btn-click-mode');
    if (btn) btn.addEventListener('click', () => {
        clickModeActive = !clickModeActive;
        btn.classList.toggle('active', clickModeActive);
        const t = TRANSLATIONS[currentLang];
        btn.innerHTML = clickModeActive
            ? `<i class="fa-solid fa-circle-xmark"></i> ${t.clickModeOn}`
            : `<i class="fa-solid fa-crosshairs"></i> ${t.clickToSearch}`;
        map.getCanvas().style.cursor = clickModeActive ? 'crosshair' : '';
        if (!clickModeActive) clearNearbyResults();
    });
});

map.on('click', async (e) => {
    if (pinpointModeActive) {
        setPinpointLocation([e.lngLat.lng, e.lngLat.lat]);
        return;
    }
    if (!clickModeActive) return;
    const lng = e.lngLat.lng;
    const lat = e.lngLat.lat;
    const radius = parseInt(document.getElementById('radius-slider').value, 10);
    showClickCircle(lng, lat, radius);
    const { data, error } = await supabaseClient.rpc('finn_naerliggende', {
        klikk_lng: lng, klikk_lat: lat, radius_m: radius
    });
    if (error) {
        console.error('Supabase RPC-feil:', error);
        const panel = document.getElementById('nearby-results');
        panel.style.display = 'block';
        panel.innerHTML = '<span style="color:red;">Feil ved romlig spørring. Sjekk konsollen.</span>';
        return;
    }
    renderNearbyResults(data);
});

function showClickCircle(lng, lat, radius) {
    const circle = turf.circle([lng, lat], radius / 1000, { steps: 64, units: 'kilometers' });
    if (map.getSource('click-circle')) {
        map.getSource('click-circle').setData(circle);
    } else {
        map.addSource('click-circle', { type: 'geojson', data: circle });
        map.addLayer({
            id: 'click-circle-fill', type: 'fill', source: 'click-circle',
            paint: { 'fill-color': '#7c3aed', 'fill-opacity': 0.12 }
        });
        map.addLayer({
            id: 'click-circle-outline', type: 'line', source: 'click-circle',
            paint: { 'line-color': '#7c3aed', 'line-width': 2, 'line-dasharray': [3, 2] }
        });
    }
    if (clickMarker) clickMarker.remove();
    const el = document.createElement('div');
    el.innerHTML = '<i class="fa-solid fa-crosshairs" style="color:#7c3aed;font-size:26px;filter:drop-shadow(0 0 3px #fff);"></i>';
    clickMarker = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([lng, lat]).addTo(map);
}

function renderNearbyResults(data) {
    nearbyMarkers.forEach(m => m.remove());
    nearbyMarkers = [];
    const panel = document.getElementById('nearby-results');
    panel.style.display = 'block';
    if (!data || data.length === 0) {
        panel.innerHTML = `<span style="color:#888;">${TRANSLATIONS[currentLang].noResults}</span>`;
        return;
    }
    const colors = { tilfluktsrom: '#FFD700', brannstasjon: '#ef4444', sykehus: '#10b981', drikkevann: '#3b82f6' };
    const ikoner = { tilfluktsrom: '🟡', brannstasjon: '🔴', sykehus: '🟢', drikkevann: '🔵' };
    data.forEach(item => {
        const el = document.createElement('div');
        el.style.cssText = `width:13px;height:13px;background:${colors[item.ressurs_type] || '#888'};border-radius:50%;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.4);`;
        nearbyMarkers.push(new maplibregl.Marker({ element: el }).setLngLat([item.lon, item.lat_out]).addTo(map));
    });
    const grouped = {};
    data.forEach(d => { if (!grouped[d.ressurs_type]) grouped[d.ressurs_type] = []; grouped[d.ressurs_type].push(d); });
    const _t = TRANSLATIONS[currentLang];
    let html = `<div style="font-weight:bold;margin-bottom:6px;">📍 ${data.length} ${_t.resourcesWithin} ${document.getElementById('radius-slider').value} ${_t.meters}:</div>`;
    for (const [type, items] of Object.entries(grouped)) {
        html += `<div style="margin-top:5px;font-weight:bold;">${ikoner[type] || '📌'} ${type} (${items.length})</div>`;
        items.forEach(it => { html += `<div class="nearby-item" style="margin-left:14px;">${it.navn} <span style="color:#888;">– ${Math.round(it.distanse_m)} m</span></div>`; });
    }
    panel.innerHTML = html;
}

function clearNearbyResults() {
    nearbyMarkers.forEach(m => m.remove());
    nearbyMarkers = [];
    if (clickMarker) { clickMarker.remove(); clickMarker = null; }
    ['click-circle-fill', 'click-circle-outline'].forEach(id => { if (map.getLayer(id)) map.removeLayer(id); });
    if (map.getSource('click-circle')) map.removeSource('click-circle');
    const panel = document.getElementById('nearby-results');
    if (panel) { panel.style.display = 'none'; panel.innerHTML = ''; }
}

// ── PINPOINT ROUTING ────────────────────────────────────────────────────────

function startPinpointMode() {
    if (clickModeActive) {
        clickModeActive = false;
        const btn = document.getElementById('btn-click-mode');
        if (btn) {
            btn.classList.remove('active');
            btn.innerHTML = `<i class="fa-solid fa-crosshairs"></i> ${TRANSLATIONS[currentLang].clickToSearch}`;
        }
        map.getCanvas().style.cursor = '';
        clearNearbyResults();
    }
    pinpointModeActive = true;
    const btn = document.getElementById('btn-pinpoint-mode');
    if (btn) {
        btn.classList.add('active');
        btn.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <span>${TRANSLATIONS[currentLang].pinpointModeOn}</span>`;
    }
    map.getCanvas().style.cursor = 'crosshair';
}

function stopPinpointMode() {
    pinpointModeActive = false;
    map.getCanvas().style.cursor = '';
    const btn = document.getElementById('btn-pinpoint-mode');
    if (btn) {
        btn.classList.remove('active');
        btn.innerHTML = `<i class="fa-solid fa-map-pin"></i> <span>${TRANSLATIONS[currentLang].pinpointMode}</span>`;
    }
}

function setPinpointLocation(coords) {
    stopPinpointMode();
    currentPos = coords;

    if (userMarker) { userMarker.remove(); userMarker = null; }
    if (pinpointMarker) { pinpointMarker.remove(); pinpointMarker = null; }

    const el = document.createElement('div');
    el.className = 'pinpoint-marker-el';
    el.innerHTML = `<i class="fa-solid fa-location-dot" style="color:#e11d48;font-size:38px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.4));"></i>`;
    pinpointMarker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(coords)
        .addTo(map);

    calculateRoute();
}

function clearRoute() {
    currentPos = null;
    if (pinpointMarker) { pinpointMarker.remove(); pinpointMarker = null; }
    if (userMarker) { userMarker.remove(); userMarker = null; }
    if (destinationMarker) { destinationMarker.remove(); destinationMarker = null; }
    if (map.getSource('route')) {
        map.getSource('route').setData({ type: 'FeatureCollection', features: [] });
    }
    const resultArea = document.getElementById('result-area');
    if (resultArea) resultArea.style.display = 'none';
    stopPinpointMode();
}
// ────────────────────────────────────────────────────────────────────────────

// MOUSE COORDINATE DISPLAY + SCALE INDICATOR
const mouseCoordsEl = document.getElementById('mouse-coords');
const mapScaleEl = document.getElementById('map-scale');

function updateMapScale() {
    const zoom = map.getZoom();
    const lat = map.getCenter().lat;
    // metres per pixel at current zoom & latitude (Web Mercator)
    const metersPerPixel = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
    // assume 96 dpi screen → pixels per metre on screen
    const scaleDenominator = Math.round(metersPerPixel * (96 * window.devicePixelRatio / 0.0254));
    mapScaleEl.textContent = `Scale = 1:${scaleDenominator.toLocaleString()}`;
}

map.on('mousemove', (e) => {
    const { lng, lat } = e.lngLat;
    mouseCoordsEl.textContent = `Lat: ${lat.toFixed(5)}  Lng: ${lng.toFixed(5)}`;
});
map.on('mouseleave', () => {
    mouseCoordsEl.textContent = 'Lat: —   Lng: —';
});

map.on('zoom', updateMapScale);
map.on('move', updateMapScale);
map.on('load', updateMapScale);

// INTERACTION
map.on('click', 'tilfluktsrom-layer', (e) => {
    const p = e.features[0].properties;
    const plasser = p.plasser ? `<br><b>Capacity:</b> ${p.plasser}` : '';
    const adresse = p.adresse ? `<br><b>Address:</b> ${p.adresse}` : '';
    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<b>SHELTER</b>${adresse}${plasser}`).addTo(map);
});

map.on('click', 'brannstasjoner-layer', (e) => {
    const p = e.features[0].properties;
    const brannstasjon = p.brannstasjon ? `<br><b>Location:</b> ${p.brannstasjon}` : '';
    const brannvesen = p.brannvesen ? `<br><b>Fire Deptartment:</b> ${p.brannvesen}` : '';
    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<b>FIRE STATION</b>${brannstasjon}${brannvesen}`).addTo(map);
});

map.on('click', 'drikkevann-layer', (e) => {
    const p = e.features[0].properties;
    const navn = p.name ? `<br><b>Name:</b> ${p.name}` : '';
    const description = p.description ? `<br><b>Description:</b> ${p.description}` : '';
    const operator = p.operator ? `<br><b>Operator:</b> ${p.operator}` : '';
    const hours = p.opening_hours ? `<br><b>Hours:</b> ${p.opening_hours}` : '';
    const wheelchair = p.wheelchair ? `<br><b>Wheelchair Access:</b> ${p.wheelchair}` : '';
    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<b>DRINKING WATER</b>${navn}${description}${operator}${hours}${wheelchair}`).addTo(map);
});

map.on('click', 'sykehus-layer', (e) => {
    const p = e.features[0].properties;
    const name = p.name ? `<br><b>Name:</b> ${p.name}` : '';
    const phone = p.phone ? `<br><b>Phone:</b> ${p.phone}` : '';
    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<b>HOSPITAL</b>${name}${phone}`).addTo(map);
});

// UI CONTROLS
function setupControls() {
    setupViewModeToggle();
    setup3DViewTracking();

    // Find me (hidden button, kept for JS compat)
    document.getElementById('btn-find-me').addEventListener('click', () => {
        if (!navigator.geolocation) return alert("No GPS support.");
        navigator.geolocation.getCurrentPosition(pos => {
            setUserLocation([pos.coords.longitude, pos.coords.latitude], pos.coords.accuracy);
        }, () => alert("Could not find position."),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    });

    // Zoom inn og ut (fra egendefinert 2x2 grid)
    const btnZoomIn = document.getElementById('btn-zoom-in');
    if (btnZoomIn) {
        btnZoomIn.addEventListener('click', () => {
            map.zoomTo(map.getZoom() + 1, { duration: 250 });
        });
    }

    const btnZoomOut = document.getElementById('btn-zoom-out');
    if (btnZoomOut) {
        btnZoomOut.addEventListener('click', () => {
            map.zoomTo(map.getZoom() - 1, { duration: 250 });
        });
    }

    // Zoom til land-nivå (Norge)
    const btnOverview = document.getElementById('btn-overview');
    if (btnOverview) {
        btnOverview.addEventListener('click', () => {
            map.flyTo(buildViewModeCameraOptions({
                center: [15.0, 65.0], // Sirka midt i Norge
                zoom: 4.5,
                duration: 1500
            }));
        });
    }

    // Locate button
    const btnLocate = document.getElementById('btn-locate');
    if (btnLocate) {
        btnLocate.addEventListener('click', () => {
            if (!navigator.geolocation) return alert("No GPS support.");
            navigator.geolocation.getCurrentPosition(pos => {
                setUserLocation([pos.coords.longitude, pos.coords.latitude]);
            }, () => alert("Could not find position."),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
        });
    }

    // Search
    const searchBtn = document.getElementById('btn-search');
    const searchInput = document.getElementById('search-input');
    const performSearch = async () => {
        const query = searchInput.value;
        if (!query) return;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Norway&limit=1`);
            const data = await res.json();
            if (data.length > 0) setUserLocation([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
            else alert("Address not found.");
        } catch (e) { console.error(e); }
    };
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });

    // Category buttons
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            if (currentPos) calculateRoute();
        });
    });

    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    // Advanced view toggle
    const btnAdvanced = document.getElementById('btn-advanced-toggle');
    const viewModePanel = document.getElementById('view-mode-toggle');
    const advChevron = document.getElementById('advanced-chevron');
    if (btnAdvanced && viewModePanel) {
        btnAdvanced.addEventListener('click', () => {
            const isOpen = viewModePanel.classList.toggle('open');
            if (advChevron) advChevron.style.transform = isOpen ? 'rotate(180deg)' : '';
        });
    }

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            transportMode = e.currentTarget.dataset.mode;
            if (currentPos) calculateRoute();
        });
    });

    const btnPinpoint = document.getElementById('btn-pinpoint-mode');
    if (btnPinpoint) {
        btnPinpoint.addEventListener('click', () => {
            if (pinpointModeActive) stopPinpointMode();
            else startPinpointMode();
        });
    }

    const btnClearRoute = document.getElementById('btn-clear-route');
    if (btnClearRoute) {
        btnClearRoute.addEventListener('click', clearRoute);
    }

    // Layer Checkboxes
    const toggles = [
        { id: 'toggle-tilfluktsrom', layer: 'tilfluktsrom-layer' },
        { id: 'toggle-brannstasjoner', layer: 'brannstasjoner-layer' },
        { id: 'toggle-drikkevann', layer: 'drikkevann-layer' },
        { id: 'toggle-sykehus', layer: 'sykehus-layer' },
    ];
    toggles.forEach(t => {
        const el = document.getElementById(t.id);
        if (el) el.addEventListener('change', (e) => {
            if (mapLoaded && map.getLayer(t.layer)) {
                map.setLayoutProperty(t.layer, 'visibility', e.target.checked ? 'visible' : 'none');
            }
        });
    });
}

// ROUTING LOGIC
function updateAccuracyCircle(coords, accuracyMeters) {
    const geojson = turf.circle(coords, accuracyMeters / 1000, { steps: 64, units: 'kilometers' });
    if (map.getSource('accuracy-circle')) {
        map.getSource('accuracy-circle').setData(geojson);
    } else {
        map.addSource('accuracy-circle', { type: 'geojson', data: geojson });
        const beforeId = getNorway3DInsertBeforeId();
        map.addLayer({
            id: 'accuracy-circle-fill',
            type: 'fill',
            source: 'accuracy-circle',
            paint: { 'fill-color': '#4285f4', 'fill-opacity': 0.12 }
        }, beforeId);
        map.addLayer({
            id: 'accuracy-circle-border',
            type: 'line',
            source: 'accuracy-circle',
            paint: { 'line-color': '#4285f4', 'line-width': 1.5, 'line-opacity': 0.55 }
        }, beforeId);
    }

    // Show accuracy badge on the marker
    const badge = document.getElementById('accuracy-badge');
    if (badge) badge.textContent = `±${Math.round(accuracyMeters)} m`;
}

function setUserLocation(coords, accuracyMeters) {
    currentPos = coords;
    map.flyTo(buildViewModeCameraOptions({ center: coords, zoom: 14 }));

    if (userMarker) userMarker.remove();
    const el = document.createElement('div');
    el.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;';
    el.innerHTML = `
        <i class="fa-solid fa-circle-user" style="color:#2563eb;font-size:35px;background:white;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,0.3);"></i>
        <span id="accuracy-badge" style="background:rgba(66,133,244,0.85);color:white;font-size:10px;font-weight:700;padding:2px 6px;border-radius:8px;white-space:nowrap;font-family:Inter,Arial,sans-serif;"></span>
    `;
    userMarker = new maplibregl.Marker({ element: el, anchor: 'top' }).setLngLat(coords).addTo(map);

    if (accuracyMeters) updateAccuracyCircle(coords, accuracyMeters);

    calculateRoute();
}

async function calculateRoute() {
    if (!currentPos || !mapLoaded) return;
    const category = activeCategory;
    const targetData = dataCache[category];

    if (!targetData) return alert("Data not loaded yet.");

    const userPoint = turf.point(currentPos);
    const nearest = turf.nearestPoint(userPoint, targetData);
    if (!nearest) return;

    const destCoords = nearest.geometry.coordinates;
    const props = nearest.properties;

    let serviceUrl = 'https://router.project-osrm.org/route/v1';
    let profile = 'driving';
    if (transportMode === 'walking') {
        serviceUrl = 'https://routing.openstreetmap.de/routed-foot/route/v1';
        profile = 'foot';
    }

    try {
        const res = await fetch(`${serviceUrl}/${profile}/${currentPos[0]},${currentPos[1]};${destCoords[0]},${destCoords[1]}?overview=full&geometries=geojson`);
        const json = await res.json();

        if (json.routes && json.routes.length > 0) {
            const route = json.routes[0];
            map.getSource('route').setData(route.geometry);

            const bounds = new maplibregl.LngLatBounds();
            route.geometry.coordinates.forEach(c => bounds.extend(c));
            map.fitBounds(bounds, buildViewModeCameraOptions({ padding: 60 }));

            if (destinationMarker) destinationMarker.remove();
            const destEl = document.createElement('div');
            destEl.className = 'destination-marker-el';
            const catColors = { tilfluktsrom: '#f59e0b', brannstasjoner: '#ef4444', sykehus: '#10b981', drikkevann: '#3b82f6' };
            const catIcons = { tilfluktsrom: 'fa-shield-halved', brannstasjoner: 'fa-fire-extinguisher', sykehus: 'fa-hospital', drikkevann: 'fa-droplet' };
            const iconColor = catColors[category] || '#374151';
            const iconName = catIcons[category] || 'fa-location-dot';
            destEl.innerHTML = `<div style="background:white;border:3px solid ${iconColor};border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.3);"><i class="fa-solid ${iconName}" style="color:${iconColor};font-size:16px;"></i></div>`;
            destinationMarker = new maplibregl.Marker({ element: destEl, anchor: 'center' })
                .setLngLat(destCoords)
                .addTo(map);

            const mins = Math.round(route.duration / 60);
            const km = (route.distance / 1000).toFixed(1);
            document.getElementById('result-area').style.display = 'block';
            document.getElementById('res-info').innerText = `${mins} min  ·  ${km} km`;

            const destName = props.navn || props.name || props.adresse || props.brannstasjon || 'Destination';
            const t = TRANSLATIONS[currentLang];
            const fromLabel = pinpointMarker ? `<span style="font-size:11px;color:#6b7280;font-weight:600;"><i class="fa-solid fa-map-pin" style="color:#e11d48;margin-right:3px;"></i>${t.resultFrom}</span><br>` : '';
            document.getElementById('res-dest').innerHTML = `${fromLabel}${t.resultTo} <b>${destName}</b>`;
        }
    } catch (err) { console.error("Routing error:", err); }
}

function loadTilfluktsromIcon(mapInstance) {
    if (mapInstance.hasImage('tilfluktsrom-icon')) return Promise.resolve();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <rect x="2" y="2" width="28" height="28" fill="#FFD700" stroke="#000" stroke-width="2"/>
        <text x="16" y="22" font-size="18" font-weight="700" text-anchor="middle" fill="#000">T</text>
    </svg>`;
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            if (!mapInstance.hasImage('tilfluktsrom-icon')) mapInstance.addImage('tilfluktsrom-icon', img, { pixelRatio: 2 });
            resolve();
        };
        img.onerror = reject;
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    });
}