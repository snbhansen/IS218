// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = 'https://wqfpqpvdicvejbvnplcf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_c9St0FCq1CXFQr5C1Ba3Hg_xGovKgNN';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// GLOBAL VARIABLES
let map;
let currentPosition = null;
let travelMode = 'walking';
let userMarker = null;
let isMapLoaded = false;
let dataCache = {
    tilfluktsrom: null,
    brannstasjoner: null,
    sykehus: null,
    drikkevann: null
};

// --- HELPER FUNCTION TO HANDLE HEX-ENCODED GEOMETRY ---
async function fetchSupabaseGeoJson(tableName) {
    console.log(`Fetching data from table: ${tableName}...`);
    
    const { data, error } = await supabaseClient
        .from(tableName)
        .select('*');

    if (error) {
        console.error(`Error from Supabase (${tableName}):`, error);
        return null;
    }

    const features = data.map(row => {
        if (!row.location) return null;

        let coords = [];

        // CHECK 1: Is it Hex-encoded? (Often starts with 0101000020...)
        if (typeof row.location === 'string' && row.location.length > 20) {
            try {
                const hex = row.location;
                // Longitude from character 18 to 34, Latitude from 34 to 50
                const lonHex = hex.substring(18, 34);
                const latHex = hex.substring(34, 50);
                
                // Helper to convert hex to float
                const parseHexFloat = (h) => {
                    const view = new DataView(new ArrayBuffer(8));
                    h.match(/.{1,2}/g).forEach((b, i) => view.setUint8(i, parseInt(b, 16)));
                    return view.getFloat64(0, true); // true means Little Endian
                };

                coords = [parseHexFloat(lonHex), parseHexFloat(latHex)];
            } catch (e) {
                console.error("Could not parse hex-encoded geometry:", row.location);
                return null;
            }
        } 
        // CHECK 2: Is it JSON? (If Supabase changes format in the future)
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

    console.log(`Processed ${features.length} points for ${tableName}.`);
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
    isMapLoaded = true;

    // Try to load icon
    let iconLoaded = false;
    try { await loadShelterIcon(map); iconLoaded = true; } catch (e) {}

    // 1. Fetch Shelters
    const shelters = await fetchSupabaseGeoJson('tilfluktsrom');
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

    // 2. Fetch Fire Stations
    const stations = await fetchSupabaseGeoJson('brannstasjoner');
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

    // 3. Fetch Hospitals
    async function fetchHospitals() {
        console.log("Fetching data from hospitals...");
        const { data, error } = await supabaseClient
            .from('sykehus')
            .select('name, phone, WKT');

        if (error) {
            console.error("Error from Supabase (sykehus):", error);
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

        console.log(`Processed ${features.length} hospital points.`);
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

    // 3.5 Fetch Drinking Water from Supabase
    try {
        console.log("Fetching drinking water from Supabase table: drikkevann_geojson...");
        
        const { data, error } = await supabaseClient
            .from('drikkevann_geojson')
            .select('id, name, geom');

        if (error) {
            console.error("Error from Supabase (drikkevann_geojson):", error);
            throw error;
        }

        console.log(`Fetched ${data?.length || 0} rows from drikkevann_geojson table.`);

        // Build GeoJSON FeatureCollection for polygons
        const drikkevannPolygons = {
            type: 'FeatureCollection',
            features: (data || []).map(row => {
                if (!row.geom) return null;
                return {
                    type: 'Feature',
                    geometry: row.geom,
                    properties: {
                        id: row.id,
                        name: row.name || null
                    }
                };
            }).filter(f => f !== null)
        };

        console.log(`Built FeatureCollection with ${drikkevannPolygons.features.length} features.`);

        // Log geometry types for verification
        const geomTypes = { Polygon: 0, MultiPolygon: 0, Point: 0, other: 0 };
        drikkevannPolygons.features.forEach(f => {
            const type = f.geometry?.type;
            if (type === 'Polygon') geomTypes.Polygon++;
            else if (type === 'MultiPolygon') geomTypes.MultiPolygon++;
            else if (type === 'Point') geomTypes.Point++;
            else geomTypes.other++;
        });
        console.log('Drinking water geometry type counts:', geomTypes);

        if (drikkevannPolygons.features.length > 0) {
            const firstGeomType = drikkevannPolygons.features[0].geometry?.type;
            console.log(`First feature geometry type: ${firstGeomType}`);
        }

        // Add polygon source and layers
        map.addSource('drikkevann-polygons', { type: 'geojson', data: drikkevannPolygons });

        map.addLayer({id: 'drikkevann-centroid', type: 'circle', source: 'drikkevann-polygons', maxzoom: 13,
            paint: {
                    'circle-radius': 5,
                    'circle-color': '#2563eb',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff'
                    }
                    });
        
        map.addLayer({
            id: 'drikkevann-fill',
            type: 'fill',
            source: 'drikkevann-polygons',
            minzoom: 14,
            paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.6 }
        });
        
        map.addLayer({
            id: 'drikkevann-outline',
            type: 'line',
            minzoom: 14,
            source: 'drikkevann-polygons',
            paint: { 'line-color': '#1e40af', 'line-width': 3 }
        });

        // Create point FeatureCollection for routing using turf.pointOnFeature
        const drikkevannPoints = {
            type: 'FeatureCollection',
            features: drikkevannPolygons.features.map(feature => {
                const point = turf.pointOnFeature(feature);
                return {
                    type: 'Feature',
                    geometry: point.geometry,
                    properties: { ...feature.properties }
                };
            })
        };

        console.log(`Processed ${drikkevannPoints.features.length} drinking water points for routing.`);
        dataCache.drikkevann = drikkevannPoints;

    } catch (e) {
        console.error("Error loading drinking water data from Supabase:", e);
    }


    // 4. Route layer (empty initially)
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
    const brannvesen = p.brannvesen ? `<br><b>Fire Department:</b> ${p.brannvesen}` : ''; 
    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<b>FIRE STATION</b>${brannstasjon}${brannvesen}`).addTo(map);
});

map.on('click', 'sykehus-layer', (e) => {
    const p = e.features[0].properties;
    const name = p.name ? `<br><b>Name:</b> ${p.name}` : '';
    const phone = p.phone ? `<br><b>Phone:</b> ${p.phone}` : '';
    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<b>HOSPITAL</b>${name}${phone}`).addTo(map);
});

map.on('click', 'drikkevann-fill', (e) => {
    const p = e.features[0].properties || {};
    const label = p.name || 'Drinking water area';
    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<b>DRINKING WATER AREA</b><br>${label}`).addTo(map);
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
    document.getElementById('target-category').addEventListener('change', () => { if (currentPosition) calculateRoute(); });
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            travelMode = e.currentTarget.dataset.mode;
            if (currentPosition) calculateRoute();
        });
    });

    // Layer Checkboxes
    const toggles = [
        { id: 'toggle-tilfluktsrom', layers: ['tilfluktsrom-layer'] },
        { id: 'toggle-brannstasjoner', layers: ['brannstasjoner-layer'] },
        { id: 'toggle-sykehus', layers: ['sykehus-layer'] },
        { id: 'toggle-drikkevann', layers: ['drikkevann-centroid', 'drikkevann-fill', 'drikkevann-outline'] }
    ];
    toggles.forEach(t => {
        const el = document.getElementById(t.id);
        if (el) el.addEventListener('change', (e) => {
            if (isMapLoaded) {
                t.layers.forEach(layerId => {
                    if (map.getLayer(layerId)) {
                        map.setLayoutProperty(layerId, 'visibility', e.target.checked ? 'visible' : 'none');
                    }
                });
            }
        });
    });
}

// ROUTING LOGIC
function setUserLocation(coords) {
    currentPosition = coords;
    map.flyTo({ center: coords, zoom: 14 });

    if (userMarker) userMarker.remove();
    const el = document.createElement('div');
    el.innerHTML = '<i class="fa-solid fa-circle-user" style="color:#2563eb; font-size:35px; background:white; border-radius:50%; box-shadow:0 0 5px rgba(0,0,0,0.3);"></i>';
    userMarker = new maplibregl.Marker({ element: el }).setLngLat(coords).addTo(map);

    calculateRoute();
}

async function calculateRoute() {
    if (!currentPosition || !isMapLoaded) return;
    const category = document.getElementById('target-category').value;
    const targetData = dataCache[category];

    if (!targetData) return alert("Data not loaded yet.");

    const userPoint = turf.point(currentPosition);
    const nearest = turf.nearestPoint(userPoint, targetData);
    if (!nearest) return;

    const destCoords = nearest.geometry.coordinates;
    const props = nearest.properties;

    let serviceUrl = 'https://router.project-osrm.org/route/v1';
    let profile = 'driving';
    if (travelMode === 'walking') {
        serviceUrl = 'https://routing.openstreetmap.de/routed-foot/route/v1';
        profile = 'foot';
    }

    try {
        const res = await fetch(`${serviceUrl}/${profile}/${currentPosition[0]},${currentPosition[1]};${destCoords[0]},${destCoords[1]}?overview=full&geometries=geojson`);
        const json = await res.json();

        if (json.routes && json.routes.length > 0) {
            const route = json.routes[0];
            map.getSource('route').setData(route.geometry);
            
            const bounds = new maplibregl.LngLatBounds();
            route.geometry.coordinates.forEach(c => bounds.extend(c));
            map.fitBounds(bounds, { padding: 50 });

            document.getElementById('result-area').style.display = 'block';
            document.getElementById('res-info').innerText = `${Math.round(route.duration / 60)} min  /  ${(route.distance / 1000).toFixed(1)} km`;
            
            let destName = "Destination";
            if (category === 'drikkevann') {
                destName = props.name || 'Drinking water';
            } else {
                destName = props.navn || props.adresse || props.brannstasjon || "Destination";
            }
            document.getElementById('res-dest').innerHTML = `To: <b>${destName}</b>`;
        }
    } catch (err) { console.error("Routing error:", err); }
}

function loadShelterIcon(mapInstance) {
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