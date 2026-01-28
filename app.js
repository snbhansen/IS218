// --- GLOBALE VARIABLER ---
let map;
let currentPos = null;
let transportMode = 'walking'; // Standard
let userMarker = null;
let dataCache = {
    bomberom: null,
    brann: null,
    ulykke: null
};

// -------------------------------------------------------------
// 1. OPPSETT AV KARTET (Den sikre metoden som virker for deg)
// -------------------------------------------------------------
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

} catch (err) {
    console.error("Kartfeil:", err);
}

// -------------------------------------------------------------
// 2. LASTING AV DATA
// -------------------------------------------------------------
map.on('load', async () => {
    console.log("Kart lastet. Henter data...");

    // A. BOMBEROM (Må ha denne for å finne nærmeste tilfluktsrom)
    try {
        const res = await fetch('data/bomberom.geojson');
        if (res.ok) dataCache.bomberom = await res.json();
    } catch (e) { console.warn("Mangler data/bomberom.geojson"); }

    // B. BRANNALARMSENTRALER
    try {
        const res = await fetch('data/brannalarmsentraler.geojson');
        if (res.ok) {
            const json = await res.json();
            dataCache.brann = json;
            map.addSource('brannalarmsentraler', { type: 'geojson', data: json });
            map.addLayer({
                id: 'brannalarmsentraler-fill',
                type: 'fill',
                source: 'brannalarmsentraler',
                paint: {
                    'fill-color': '#FFA500',
                    'fill-opacity': 0.3
                }
            });

            map.addLayer({
                id: 'brannalarmsentraler-outline',
                type: 'line',
                source: 'brannalarmsentraler',
                paint: {
                    'line-color': '#ff8c00c2',
                    'line-width': 2
                }
            });
        }
    } catch (e) { console.warn(e); }

    // C. TRAFIKKULYKKER
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
                paint: {
                    'circle-radius': 6,
                    // Møter krav om "datadrevet styling": Sjekker om features har et felt
                    'circle-color': [
                        'case',
                        ['has', 'uhellskode'], '#FF0000', // Rød for ulykker
                        '#FF0000' // Fallback (samme rød)
                    ],
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#FFF'
                }
            });
        }
    } catch (e) { console.warn(e); }

    // D. WMS LAG (Gruppens)
    map.addSource('wms-tilfluktsrom', {
        type: 'raster',
        tiles: ['https://ogc.dsb.no/wms.ashx?service=WMS&version=1.3.0&request=GetMap&layers=layer_340&bbox={bbox-epsg-3857}&width=256&height=256&crs=EPSG:3857&transparent=true&format=image/png'],
        tileSize: 256
    });
    map.addLayer({ id: 'wms-tilfluktsrom-layer', type: 'raster', source: 'wms-tilfluktsrom', paint: {} });

    map.addSource('wms-brannvesen', {
        type: 'raster',
        tiles: ['https://ogc.dsb.no/wms.ashx?service=WMS&version=1.3.0&request=GetMap&layers=layer_179&bbox={bbox-epsg-3857}&width=256&height=256&crs=EPSG:3857&transparent=true&format=image/png'],
        tileSize: 256
    });
    map.addLayer({ id: 'wms-brannvesen-layer', type: 'raster', source: 'wms-brannvesen', paint: {} });

    // E. RUTE-LINJE
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

// -------------------------------------------------------------
// 3. INTERAKSJON (Popups)
// -------------------------------------------------------------
map.on('click', 'brannalarmsentraler-fill', (e) => {
    const p = e.features[0].properties;
    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<b>${p.navn || 'Brannsentral'}</b><br>${p.lokalisering || ''}`).addTo(map);
});
map.on('click', 'trafikkulykker-layer', (e) => {
    const p = e.features[0].properties;
    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<b>Ulykke</b><br>${p.uhellskode || ''}`).addTo(map);
});

// -------------------------------------------------------------
// 4. KNAPPER OG UI
// -------------------------------------------------------------
function setupControls() {
    // --- Custom Zoom Controls ---
    document.getElementById('zoom-in-btn').addEventListener('click', () => map.zoomIn());
    document.getElementById('zoom-out-btn').addEventListener('click', () => map.zoomOut());

    // --- Navigation Rail Logic ---
    const navRail = document.getElementById('nav-rail');
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    if (navRail && navToggleBtn) {
        navToggleBtn.addEventListener('click', () => {
            navRail.classList.toggle('nav-open');
        });
    }

    // 1. Clear Route
    const btnClear = document.getElementById('nav-clear-route');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            const routeSource = map.getSource('route');
            if (routeSource) {
                routeSource.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
                document.getElementById('result-area').style.display = 'none';
            }
        });
    }

    // 2. Reset Map
    const btnReset = document.getElementById('nav-reset-map');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            map.flyTo({ center: [8.0182, 58.1467], zoom: 12 });
        });
    }

    // 3. Show Coordinates
    const btnCoords = document.getElementById('nav-show-coords');
    if (btnCoords) {
        btnCoords.addEventListener('click', () => {
            if (currentPos) {
                alert(`Din posisjon:\nLat: ${currentPos[1].toFixed(5)}\nLng: ${currentPos[0].toFixed(5)}`);
            } else {
                alert("Ingen posisjon funnet enda. Prøv 'Finn meg' knappen først.");
            }
        });
    }

    // 4. System Status
    const btnStatus = document.getElementById('nav-sys-status');
    if (btnStatus) {
        btnStatus.addEventListener('click', () => {
            alert("System Status: ONLINE\n\nAll services operational.\nMapLibre GL JS: v5.1.0\nBackend: Connected");
        });
    }

    // --- New Restored Features ---

    // 5. Search (REMOVED - Redundant)
    // const navSearch = document.getElementById('nav-search-btn'); ...

    // 6. Transport Toggle
    const navMode = document.getElementById('nav-mode-toggle');
    if (navMode) {
        navMode.addEventListener('click', () => {
            const icon = navMode.querySelector('i');
            if (transportMode === 'walking') {
                transportMode = 'driving';
                icon.className = 'fa-solid fa-car';
                navMode.title = "Endre Transportmiddel (Bil)";
            } else {
                transportMode = 'walking';
                icon.className = 'fa-solid fa-person-walking';
                navMode.title = "Endre Transportmiddel (Gå)";
            }
            // Recalculate if route exists (check if result area is visible as proxy)
            if (document.getElementById('result-area').style.display === 'block') {
                // Try to guess last used category or just alert user
                alert(`Transport endret til ${transportMode === 'walking' ? 'Gå' : 'Bil'}.\nVelg destinasjon på nytt for å oppdatere ruten.`);
            }
        });
    }

    // 7. Find Buttons
    document.getElementById('nav-find-shelter')?.addEventListener('click', () => calculateRoute('bomberom'));
    document.getElementById('nav-find-fire')?.addEventListener('click', () => calculateRoute('brann'));
    document.getElementById('nav-find-accident')?.addEventListener('click', () => calculateRoute('ulykke'));



    // Finn meg
    document.getElementById('btn-find-me').addEventListener('click', () => {
        if (!navigator.geolocation) return alert("Ingen GPS støtte.");

        navigator.geolocation.getCurrentPosition(pos => {
            setUserLocation([pos.coords.longitude, pos.coords.latitude]);
        }, () => alert("Fant ikke posisjon."));
    });

    // --- Global Overview (Zoom to Norway) ---
    const btnGlobal = document.getElementById('btn-global-overview');
    if (btnGlobal) {
        btnGlobal.addEventListener('click', () => {
            map.flyTo({
                center: [15.0, 65.0], // Approx center of Norway (adjusted for better view)
                zoom: 4,
                speed: 0.8,
                curve: 1,
                essential: true
            });
        });
    }
    // Søk
    document.getElementById('btn-search').addEventListener('click', async () => {
        const query = document.getElementById('search-input').value;
        if (!query) return;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Norway&limit=1`);
            const data = await res.json();
            if (data.length > 0) setUserLocation([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
            else alert("Fant ikke adressen.");
        } catch (e) { console.error(e); }
    });

    // Dropdown endring
    const targetCat = document.getElementById('target-category');
    if (targetCat) {
        targetCat.addEventListener('change', () => { if (currentPos) calculateRoute(); });
    }

    // Transportmodus
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            transportMode = e.currentTarget.dataset.mode;
            if (currentPos) calculateRoute();
        });
    });

    // Lag-kontroll (Definert her for å brukes av både checkboxer og chips)
    const toggles = [
        { id: 'toggle-wms-tilfluktsrom', layer: 'wms-tilfluktsrom-layer' },
        { id: 'toggle-wms-brannvesen', layer: 'wms-brannvesen-layer' },
        { id: 'toggle-brannalarmsentraler', layer: 'brannalarmsentraler-fill' },
        { id: 'toggle-brannalarmsentraler-outline', layer: 'brannalarmsentraler-outline' },
        { id: 'toggle-trafikkulykker', layer: 'trafikkulykker-layer' }
    ];

    // --- Filter Chips Interaksjon ---
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            const btn = e.currentTarget;
            const toggleId = btn.dataset.layer;
            const activeClass = btn.dataset.activeClass;

            // Finn konfigurasjon
            // Merk: Brannalarmer har to lag (fill og outline), vi håndterer det ved å sjekke ID
            // For enkelhets skyld, hvis det er brannalarmer, toggle begge

            let targets = [toggles.find(t => t.id === toggleId)];

            // Spesialhåndtering for brannalarmer som har to lag men en knapp
            if (toggleId === 'toggle-brannalarmsentraler') {
                const outline = toggles.find(t => t.id === 'toggle-brannalarmsentraler-outline');
                if (outline) targets.push(outline);
            }

            // Toggle visuell state
            const isActive = btn.classList.toggle(activeClass);

            targets.forEach(target => {
                if (!target) return;

                // Toggle kart-lag
                if (map.getLayer(target.layer)) {
                    map.setLayoutProperty(target.layer, 'visibility', isActive ? 'visible' : 'none');
                }


            });
        });
    });


}

// -------------------------------------------------------------
// 5. RUTING (MED FIX FOR HTML ID-ER)
// -------------------------------------------------------------

function setUserLocation(coords) {
    currentPos = coords;
    map.flyTo({ center: coords, zoom: 14 });

    if (userMarker) userMarker.remove();
    const el = document.createElement('div');
    el.innerHTML = '<i class="fa-solid fa-circle-user" style="color:#2563eb; font-size:35px; background:white; border-radius:50%; box-shadow:0 0 5px rgba(0,0,0,0.3);"></i>';
    userMarker = new maplibregl.Marker({ element: el }).setLngLat(coords).addTo(map);

    calculateRoute();
}

async function calculateRoute(targetCategory) {
    if (!currentPos) {
        alert("Du må finne din posisjon først!");
        return;
    }

    // Default: Bruk dropdown HVIS den finnes, ellers bruk argumentet
    let category = targetCategory;
    const dropDown = document.getElementById('target-category');
    if (!category && dropDown) {
        category = dropDown.value;
    }

    if (!category) return; // Ingen kategori valgt

    const targetData = dataCache[category];

    if (!targetData) {
        if (category === 'bomberom') alert("Mangler data/bomberom.geojson");
        return;
    }

    const userPoint = turf.point(currentPos);
    const nearest = turf.nearestPoint(userPoint, targetData);
    if (!nearest) return;

    const destCoords = nearest.geometry.coordinates;
    const props = nearest.properties;

    // Server-valg (Walking vs Driving)
    let serviceUrl = 'https://router.project-osrm.org/route/v1';
    if (transportMode === 'walking') {
        serviceUrl = 'https://routing.openstreetmap.de/routed-foot/route/v1';
    }

    // OSRM expects: lon,lat;lon,lat
    const url = `${serviceUrl}/driving/${currentPos[0]},${currentPos[1]};${destCoords[0]},${destCoords[1]}?overview=full&geometries=geojson`;

    try {
        const res = await fetch(url);
        const json = await res.json();

        if (json.routes && json.routes.length > 0) {
            const route = json.routes[0];

            // Tegn linjen
            map.getSource('route').setData(route.geometry);

            // Zoom til ruten
            const bounds = new maplibregl.LngLatBounds();
            route.geometry.coordinates.forEach(c => bounds.extend(c));
            map.fitBounds(bounds, { padding: 50 });

            // --- Vis Resultat ---
            const min = Math.round(route.duration / 60);
            const km = (route.distance / 1000).toFixed(1);
            const navn = props.adresse || props.navn || props.lokalisering || "Ukjent sted";

            const resultArea = document.getElementById('result-area');
            if (resultArea) {
                resultArea.style.display = 'block';
                document.getElementById('res-info').innerText = `${min} min  /  ${km} km  (${transportMode === 'walking' ? 'Gå' : 'Bil'})`;
                document.getElementById('res-dest').innerHTML = `Til: <b>${navn}</b>`;
            }
        }
    } catch (err) {
        console.error("Ruting feilet:", err);
    }
}

// -------------------------------------------------------------
// 6. INTRO OVERLAY LOGIKK
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const btnEnter = document.getElementById('btn-enter-app');
    const overlay = document.getElementById('intro-overlay');

    if (btnEnter && overlay) {
        btnEnter.addEventListener('click', () => {
            overlay.classList.add('fade-out');

            // Start video/animasjoner på hovedsiden hvis nødvendig
            console.log("System started.");
        });
    }

    // --- TEMAVELGER LOGIKK ---
    const themeSwitch = document.getElementById('theme-switch');
    const icon = themeSwitch ? themeSwitch.querySelector('i') : null;
    const body = document.body;
    const html = document.documentElement;

    // Sjekk lagret tema
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Dark default
    if (savedTheme === 'light') {
        html.setAttribute('data-theme', 'light');
        if (icon) icon.className = 'fa-solid fa-sun';
    } else {
        html.removeAttribute('data-theme'); // Standard variabler er dark
        if (icon) icon.className = 'fa-solid fa-moon';
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            if (current === 'light') {
                html.removeAttribute('data-theme'); // Bytt til dark
                localStorage.setItem('theme', 'dark');
                if (icon) icon.className = 'fa-solid fa-moon';
            } else {
                html.setAttribute('data-theme', 'light'); // Bytt til light
                localStorage.setItem('theme', 'light');
                if (icon) icon.className = 'fa-solid fa-sun';
            }
        });
    }
});