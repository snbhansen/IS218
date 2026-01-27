// GLOBAL VARIABLES
let map;
let currentPos = null;
let transportMode = 'walking'; // Default
let userMarker = null;
let mapLoaded = false;
let dataCache = {
    bomberom: null,
    brann: null,
    ulykke: null
};

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
    'layers': [
        {
            'id': 'osm-layer',
            'type': 'raster',
            'source': 'osm',
            'minzoom': 0,
            'maxzoom': 19
        }
    ]
};

try {
    map = new maplibregl.Map({
        container: 'map',
        style: mapStyle,
        center: [8.0182, 58.1467], // Kristiansand
        zoom: 12
    });
    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
} catch (err) {
    console.error("Map error:", err);
}

// DATA LOADING
map.on('load', async () => {
    console.log("Map loaded. Fetching data...");
    mapLoaded = true;

    // SHELTERS
    try {
        const res = await fetch('data/TilfluktsromOffentlig.json');
        if (res.ok) dataCache.bomberom = await res.json();
    } catch (e) { console.warn("Missing data/bomberom.geojson"); }

    // FIRE ALARM CENTERS
    try {
        const res = await fetch('data/brannalarmsentraler.geojson');
        if (res.ok) {
            const json = await res.json();
            dataCache.brann = json;
            map.addSource('brannalarmsentraler', { type: 'geojson', data: json });
            map.addLayer({
                id: 'brannalarmsentraler-layer',
                type: 'circle',
                source: 'brannalarmsentraler',
                paint: { 'circle-radius': 6, 'circle-color': '#0000FF', 'circle-stroke-width': 1, 'circle-stroke-color': '#FFF' }
            });
        }
    } catch (e) { console.warn(e); }

    // TRAFFIC ACCIDENTS
    try {
        const res = await fetch('data/trafikkulykker.geojson');
        if (res.ok) {
            const json = await res.json();
            dataCache.ulykke = json;
            map.addSource('trafikkulykker', { type: 'geojson', data: json });
            map.addLayer({
                id: 'trafikkulykker-layer',
                type: 'circle',
                source: 'trafikkulykker',
                paint: { 'circle-radius': 6, 'circle-color': '#ef4444', 'circle-stroke-width': 1, 'circle-stroke-color': '#FFF' }
            });
        }
    } catch (e) { console.warn(e); }

    // ROUTE LINE
    map.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } }
    });
    map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#2563eb', 'line-width': 5, 'line-opacity': 0.8 }
    });

    setupControls();
});

// LOAD GEOJSON LAYERS
map.on('load', () => {
    // Create yellow square icon with T
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    // Yellow background
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(2, 2, 36, 36);
    
    // Black border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 36, 36);
    
    // Add T text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('T', 20, 20);
    
    map.addImage('tilfluktsrom-icon', ctx.getImageData(0, 0, 40, 40));

    // Load all GeoJSON layers after map is ready
    fetch('./data/brannalarmsentraler.geojson').then(r => r.json()).then(data => {
        map.addSource('brannalarmsentraler-source', { type: 'geojson', data: data });
        map.addLayer({
            id: 'brannalarmsentraler-layer',
            type: 'circle',
            source: 'brannalarmsentraler-source',
            paint: { 'circle-radius': 6, 'circle-color': '#ff6b6b' }
        });
    });

    fetch('./data/trafikkulykker.geojson').then(r => r.json()).then(data => {
        map.addSource('trafikkulykker-source', { type: 'geojson', data: data });
        map.addLayer({
            id: 'trafikkulykker-layer',
            type: 'circle',
            source: 'trafikkulykker-source',
            paint: { 'circle-radius': 5, 'circle-color': '#ef4444' }
        });
    });

    fetch('./data/TilfluktsromOffentlig.json').then(r => r.json()).then(data => {
        map.addSource('tilfluktsrom-source', { type: 'geojson', data: data });
        map.addLayer({
            id: 'tilfluktsrom-layer',
            type: 'symbol',
            source: 'tilfluktsrom-source',
            layout: {
                'icon-image': 'tilfluktsrom-icon',
                'icon-size': 1,
                'text-field': 'T',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 14,
                'text-offset': [0, 0],
                'text-anchor': 'center'
            },
            paint: {
                'text-color': '#000000'
            }
        });
    });
});

// INTERACTION - Register click handlers
map.on('click', 'brannalarmsentraler-layer', (e) => {
    const p = e.features[0].properties;
    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<b>${p.navn || 'Fire Station'}</b><br>${p.lokalisering || ''}`).addTo(map);
});

map.on('click', 'trafikkulykker-layer', (e) => {
    const p = e.features[0].properties;
    const date = p.ulykkesdato ? `<br>Date: ${p.ulykkesdato}` : '';
    const weekday = p.ukedag ? ` (${p.ukedag})` : '';
    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<b>Accident</b>${date}${weekday}<br>${p.uhellskode || ''}`).addTo(map);
});

map.on('click', 'tilfluktsrom-layer', (e) => {
    const p = e.features[0].properties;
    const plasser = p.plasser ? `<br><b>Capacity:</b> ${p.plasser} people` : '';
    const romnr = p.romnr ? `<br><b>Room:</b> ${p.romnr}` : '';
    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<b>Shelter</b><br><b>Address:</b> ${p.adresse || 'N/A'}${romnr}${plasser}`).addTo(map);
});

// LAYER TOGGLE
document.getElementById('toggle-tilfluktsrom').addEventListener('change', (e) => {
    map.setLayoutProperty('tilfluktsrom-layer', 'visibility', e.target.checked ? 'visible' : 'none');
});

// BUTTONS AND UI
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
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Dropdown change
    document.getElementById('target-category').addEventListener('change', () => { if (currentPos) calculateRoute(); });

    // Transport mode
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            transportMode = e.currentTarget.dataset.mode;
            if (currentPos) calculateRoute();
        });
    });

    // Layer control
    const toggles = [
        { id: 'toggle-wms-brannvesen', layer: 'wms-brannvesen-layer' },
        { id: 'toggle-brannalarmsentraler', layer: 'brannalarmsentraler-layer' },
        { id: 'toggle-trafikkulykker', layer: 'trafikkulykker-layer' }
    ];
    toggles.forEach(t => {
        const el = document.getElementById(t.id);
        if (el) {
            el.addEventListener('change', (e) => {
                if (mapLoaded && map.getLayer(t.layer)) {
                    map.setLayoutProperty(t.layer, 'visibility', e.target.checked ? 'visible' : 'none');
                }
            });
        }
    });
}

// ROUTING

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

    if (!targetData) {
        if (category === 'bomberom') alert("Missing data/bomberom.geojson");
        return;
    }

    const userPoint = turf.point(currentPos);
    const nearest = turf.nearestPoint(userPoint, targetData);
    if (!nearest) return;

    const destCoords = nearest.geometry.coordinates;
    const props = nearest.properties;

    // Server choice (Walking vs Driving)
    let serviceUrl = 'https://router.project-osrm.org/route/v1';
    let profile = 'driving';
    if (transportMode === 'walking') {
        serviceUrl = 'https://routing.openstreetmap.de/routed-foot/route/v1';
        profile = 'foot';
    }

    const url = `${serviceUrl}/${profile}/${currentPos[0]},${currentPos[1]};${destCoords[0]},${destCoords[1]}?overview=full&geometries=geojson`;

    try {
        const res = await fetch(url);
        const json = await res.json();

        if (json.routes && json.routes.length > 0) {
            const route = json.routes[0];

            // Draw the line
            map.getSource('route').setData(route.geometry);

            // Zoom to route
            const bounds = new maplibregl.LngLatBounds();
            route.geometry.coordinates.forEach(c => bounds.extend(c));
            map.fitBounds(bounds, { padding: 50 });

            const min = Math.round(route.duration / 60);
            const km = (route.distance / 1000).toFixed(1);
            const navn = props.adresse || props.navn || props.lokalisering || "Unknown location";

            // Show result box
            document.getElementById('result-area').style.display = 'block';

            // Update text
            document.getElementById('res-info').innerText = `${min} min  /  ${km} km`;
            document.getElementById('res-dest').innerHTML = `To: <b>${navn}</b>`;
        }
    } catch (err) {
        console.error("Routing failed:", err);
    }
}