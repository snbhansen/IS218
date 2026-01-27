const map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // style URL
    center: [8.0182, 58.1467], // starting position, Kristiansand [lng, lat]
    zoom: 8, // starting zoom
    maplibreLogo: true
});

map.on('load', () => {
    // Add WMS source for shelters
    map.addSource('wms-tilfluktsrom', {
        type: 'raster',
        tiles: [
            'https://ogc.dsb.no/wms.ashx?service=WMS&version=1.3.0&request=GetMap&layers=layer_340&bbox={bbox-epsg-3857}&width=256&height=256&crs=EPSG:3857&transparent=true&format=image/png'
        ],
        tileSize: 256
    });

    // Add WMS layer for shelters
    map.addLayer({
        id: 'wms-tilfluktsrom-layer',
        type: 'raster',
        source: 'wms-tilfluktsrom',
        paint: {}
    });

    // Add WMS source for fire services
    map.addSource('wms-brannvesen', {
        type: 'raster',
        tiles: [
            'https://ogc.dsb.no/wms.ashx?service=WMS&version=1.3.0&request=GetMap&layers=layer_179&bbox={bbox-epsg-3857}&width=256&height=256&crs=EPSG:3857&transparent=true&format=image/png'
        ],
        tileSize: 256
    });

    // Add WMS layer for fire services
    map.addLayer({
        id: 'wms-brannvesen-layer',
        type: 'raster',
        source: 'wms-brannvesen',
        paint: {}
    });

    // Add GeoJSON source and layer for fire alarm centers
    map.addSource('brannalarmsentraler', {
        type: 'geojson',
        data: 'data/brannalarmsentraler.geojson'
    });

    // Add layer to visualize the fire alarm centers
    map.addLayer({
        id: 'brannalarmsentraler-layer',
        type: 'circle',
        source: 'brannalarmsentraler',
        paint: {
            'circle-radius': 7,
            'circle-color': '#0000FF',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#FFFFFF'
        }
    });

    // Add GeoJSON source and layer for traffic accidents
    map.addSource('trafikkulykker', {
        type: 'geojson',
        data: 'data/trafikkulykker.geojson'
    });

    // Add layer to visualize the traffic accidents
    map.addLayer({
        id: 'trafikkulykker-layer',
        type: 'circle',
        source: 'trafikkulykker',
        paint: {
            'circle-radius': 7,
            'circle-color': '#FF0000',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#FFFFFF'
        }
    });

    // Add click event for fire alarm centers
    map.on('click', 'brannalarmsentraler-layer', (e) => {
        const coordinates = e.features[0].geometry.coordinates; // Point geometry
        const props = e.features[0].properties; // Get properties

        const description = `
            <strong>Navn:</strong> ${props.navn || "Ukjent"}<br/> 
            <strong>Sted:</strong> ${props.lokalisering || "Ukjent"}<br/>
            `;
        
        new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<h3>Brannalarmsentral</h3><p>${description}</p>`)
            .addTo(map);
    });
    
    // Add click event for traffic accidents
    map.on('click', 'trafikkulykker-layer', (e) => {
        const coordinates = e.features[0].geometry.coordinates; // Point geometry
        const props = e.features[0].properties;

        const description = `
            <strong>Årsak:</strong> ${props.uhellskode || "Ukjent"}<br/> 
            <strong>Dato:</strong> ${props.ulykkesdato || "Ukjent"}<br/>
            <strong>Alvorligste skadegrad:</strong> ${props.alvorligsteSkadeGrad || "Ukjent"}
            `;

        new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<h3>Trafikkulykke</h3><p>${description}</p>`)
            .addTo(map);
    });

    // Wire up layer control checkboxes
    document.getElementById('toggle-wms-tilfluktsrom').addEventListener('change', (e) => {
        map.setLayoutProperty('wms-tilfluktsrom-layer', 'visibility', e.target.checked ? 'visible' : 'none');
    });

    document.getElementById('toggle-wms-brannvesen').addEventListener('change', (e) => {
        map.setLayoutProperty('wms-brannvesen-layer', 'visibility', e.target.checked ? 'visible' : 'none');
    });

    document.getElementById('toggle-brannalarmsentraler').addEventListener('change', (e) => {
        map.setLayoutProperty('brannalarmsentraler-layer', 'visibility', e.target.checked ? 'visible' : 'none');
    });

    document.getElementById('toggle-trafikkulykker').addEventListener('change', (e) => {
        map.setLayoutProperty('trafikkulykker-layer', 'visibility', e.target.checked ? 'visible' : 'none');
    });

});
