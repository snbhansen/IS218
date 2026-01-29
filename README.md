# IS218
Student repository - Group 15

Dette webkartet viser brannalarmsentraler og trafikkulykker de siste 5 kalenderårene med personskader eller større materielle skader i Norge. Datasettet er hentet fra GeoNorge. Brukere kan klikke på punktene for å se informasjon om hvert objekt.

**Demo**
- Klikk på blå punkter for brannalarmsentraler → viser navn og sted.
- Klikk på røde punkter for trafikkulykker → viser årsak (ulykkeskode/klassifisering), dato og skadegrad.
- Skru lag av/på (GeoJSON- og WMS-lag) ved hjelp av layer control.
- Bruk “Finn meg” eller søk på adresse, og beregn rute til nærmeste valgt ressurs.

**Teknisk stack**
- Kartbibliotek: MapLibre GL JS v5.16.0
- Basemap: Positron GL Style
- Dataformat: GeoJSON (lokale filer)
- Eksterne tjenester: OGC WMS (DSB), Nominatim (geokoding), OSRM (ruting)
- Romlig analyse: Turf.js (nearest point)

**Datakatalog**
- Datasett: Brannalarmsentraler & Trafikkulykker de siste 5 kalenderårene
  - Kilde: GeoNorge (https://kartkatalog.geonorge.no/)
  - Bearbeiding: Lastet ned/eksportert via QGIS og brukt som GeoJSON-lag i webkartet
- Datasett: Bomberom (brukes til “nærmeste”-spørring)
  - Kilde: Lokal GeoJSON-fil (`data/bomberom.geojson`)
  - Bearbeiding: Brukes som punktlag for romlig nearest-neighbor analyse
- Eksterne (OGC) lag:
  - Offentlige tilfluktsrom (WMS fra DSB, `layer_340`)
  - Interkommunale brannvesen (WMS fra DSB, `layer_179`)

**Eksternt (OGC) API**
- Vi bruker OGC WMS fra DSB som eksterne datakilder (kartlag) som lastes direkte inn i webkartet.
- Begrunnelse: WMS er en standardisert OGC-tjeneste for å hente kartbilder (tiles) dynamisk fra en ekstern leverandør uten å lagre hele datasettet lokalt.

**Interaktivitet**
- Klikkbare objekter med popup (brannalarmsentraler og trafikkulykker).
- Datadrevet styling:
  - Trafikkulykker vises som røde punkt (circle-layer).
  - Brannalarmsentraler vises med fill + outline.
- Layer control (av/på):
  - WMS-lag: tilfluktsrom + brannvesen
  - GeoJSON-lag: brannalarmsentraler + trafikkulykker
- Søk og posisjon:
  - Adressesøk via Nominatim (OpenStreetMap)
  - “Finn meg” via geolocation i nettleser

**Romlig filtrering / spørring**
- Vi gjennomfører en romlig spørring ved å finne **nærmeste** objekt fra brukerens posisjon med Turf.js (`nearestPoint`).
- Deretter beregnes rute til nærmeste objekt (OSRM), og ruten tegnes som et eget linjelag i kartet.

**Koordinatsystem og datatransformasjon**
- WMS-lagene hentes i Web Mercator **EPSG:3857** (bbox/tiles i 3857), som er vanlig for webkart og tile-baserte tjenester.
- GeoJSON og geokoding bruker typisk WGS84 **EPSG:4326** med koordinatrekkefølge `[lon, lat]`.
- MapLibre håndterer visning/projeksjon i kartet, og Turf bruker geodesiske beregninger ved nearest-point.

**Arkitekturskisse**
```text
[GeoJSON (lokale filer)] ----\
                              -> [MapLibre (app.js)] -> [Interaktivt kart i nettleser]
[OGC WMS (DSB)] ------------/
[GPS / Nominatim] -> [Turf nearestPoint] -> [OSRM routing] -> [Rutelag i kartet]
