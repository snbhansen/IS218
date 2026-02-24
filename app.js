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
        if (!row.location) return null;

        let coords = [];

        // SJEKK 1: Er det Hex-kode? (Starter ofte på 0101000020...)
        if (typeof row.location === 'string' && row.location.length > 20) {
            try {
                // Magisk formel for å lese PostGIS Hex-format (Little Endian)
                const hex = row.location;
                // Lengdegrad ligger fra tegn 18 til 34, Breddegrad fra 34 til 50
                const lonHex = hex.substring(18, 34);
                const latHex = hex.substring(34, 50);
                
                // Hjelper for å gjøre om hex til tall
                const parseHexFloat = (h) => {
                    const view = new DataView(new ArrayBuffer(8));
                    h.match(/.{1,2}/g).forEach((b, i) => view.setUint8(i, parseInt(b, 16)));
                    return view.getFloat64(0, true); // true betyr Little Endian
                };

                coords = [parseHexFloat(lonHex), parseHexFloat(latHex)];
            } catch (e) {
                console.error("Kunne ikke lese hex-kode:", row.location);
                return null;
            }
        } 
        // SJEKK 2: Er det JSON? (Hvis Supabase endrer format i fremtiden)
        else if (row.location.coordinates) {
            coords = row.location.coordinates;
        }

        const { location, ...properties } = row;

        if (row.location && row.location.type) {
            const point = turf.pointOnFeature(row.location);

            return {
                type: 'Feature',
                geometry: point.geometry,
                properties: properties  
            }
        }

        return {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: coords },
            properties: properties
        };

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
            'attribution': '&copy; OpenStreetMap Contributors'
        }
    },
    'layers': [{
        'id': 'osm-layer',
        'type': 'raster',
        'source': 'osm',
        'minzoom': 0, 'maxzoom': 19
    }]
};

try {
    map = new maplibregl.Map({
        container: 'map',
        style: mapStyle,
        center: [8.0182, 58.1467], // Kristiansand
        zoom: 12
    });
    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
} catch (err) { console.error("Map error:", err); }

// DATA LOADING
map.on('load', async () => {
    console.log("Map loaded. Fetching data from Supabase...");
    mapLoaded = true;

    // Prøv å laste ikon
    let iconLoaded = false;
    try { await loadTilfluktsromIcon(map); iconLoaded = true; } catch (e) {}

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

    // 4. Rute-lag (tomt foreløpig)
    map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } } });
    map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#2563eb', 'line-width': 5, 'line-opacity': 0.8 }
    });

    setupControls();
});

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
    const hours= p.opening_hours ? `<br><b>Hours:</b> ${p.opening_hours}` : '';
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
    // Find me
    document.getElementById('btn-find-me').addEventListener('click', () => {
        if (!navigator.geolocation) return alert("No GPS support.");
        navigator.geolocation.getCurrentPosition(pos => {
            setUserLocation([pos.coords.longitude, pos.coords.latitude]);
        }, () => alert("Could not find position."));
    });

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

    // Dropdown & Toggles
    document.getElementById('target-category').addEventListener('change', () => { if (currentPos) calculateRoute(); });
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            transportMode = e.currentTarget.dataset.mode;
            if (currentPos) calculateRoute();
        });
    });

    // Layer Checkboxes
    const toggles = [
        { id: 'toggle-tilfluktsrom', layer: 'tilfluktsrom-layer' },
        { id: 'toggle-brannstasjoner', layer: 'brannstasjoner-layer' },
        { id: 'toggle-drikkevann', layer: 'drikkevann-layer' },
        { id: 'toggle-sykehus', layer: 'sykehus-layer' }
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
function setUserLocation(coords) {
    currentPos = coords;
    map.flyTo({ center: coords, zoom: 14 });

    if (userMarker) userMarker.remove();
    const el = document.createElement('div');
    el.innerHTML = '<i class="fa-solid fa-circle-user" style="color:#2563eb; font-size:35px; background:white; border-radius:50%; box-shadow:0 0 5px rgba(0,0,0,0.3);"></i>';
    userMarker = new maplibregl.Marker({ element: el }).setLngLat(coords).addTo(map);

    calculateRoute();
}

async function calculateRoute() {
    if (!currentPos || !mapLoaded) return;
    const category = document.getElementById('target-category').value;
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
            map.fitBounds(bounds, { padding: 50 });

            document.getElementById('result-area').style.display = 'block';
            document.getElementById('res-info').innerText = `${Math.round(route.duration / 60)} min  /  ${(route.distance / 1000).toFixed(1)} km`;
            
            const destName = props.navn || props.adresse || props.brannstasjon || "Destination";
            document.getElementById('res-dest').innerHTML = `To: <b>${destName}</b>`;
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