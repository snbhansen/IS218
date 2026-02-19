# IS218
Student repository – Group 15

## Prosjektnavn & TL;DR
Dette prosjektet er et responsivt webkart (SPA) som hjelper innbyggere i Agder/Kristiansand med å finne nærmeste beredskapsressurs når tid er kritisk. Brukeren kan bruke GPS (“Use my location”) eller søke etter adresse, og appen finner nærmeste tilfluktsrom, brannstasjon eller sykehus. Deretter beregnes rute (bil eller gange) og appen viser estimert tid og avstand.

## Demo
- Trykk **“Use my location”** (GPS) eller søk etter adresse (Nominatim).
- Velg kategori: **Nearest Shelter / Nearest Fire Station / Nearest Hospital**.
- Appen finner nærmeste punkt med **Turf.js** og beregner rute med **OSRM**.
- Ruten tegnes i kartet, og infoboksen viser **reisetid** og **distanse**.
- Klikk på punkter for å se info i **popup**.
- Slå lag av/på i **“View (Layers)”** for å rydde kartet.

## Teknisk stack
- **Frontend:** HTML5, CSS3, Vanilla JS (ES6+)
- **Kartbibliotek:** MapLibre GL JS (WebGL-kartklient) [F2]
- **Basemap:** OpenStreetMap raster tiles (XYZ) [F2]
- **Database:** Supabase (PostGIS) for lagring av steddata med geometri [F4]
- **Dataformat i kart:** GeoJSON (bygges i klient fra databaserader) [F2][F3]
- **Romlig analyse:** Turf.js (`nearestPoint`) for å finne nærmeste objekt lokalt i nettleseren [F2]
- **Geokoding:** Nominatim (adresse → koordinater)
- **Ruting:** OSRM (bil) + routed-foot (gange)

### Hvorfor disse valgene?
Vi bruker **MapLibre** fordi en kartklient håndterer visning av kartlag, interaksjon og dynamisk styling direkte i nettleseren [F2]. Vi bruker **Supabase/PostGIS** fordi det gjør data enklere å oppdatere og utvide enn kun statiske filer, og gir et godt grunnlag for videre skalering med romlige spørringer og indekser [F4]. Vi bruker **Turf.js** for “serverløs” romlig analyse i klienten, som passer bra når datasettet ikke er altfor stort [F2].

## Datakatalog (enkel oversikt)

**Tilfluktsrom**  
- Kilde: Supabase/PostGIS (`tilfluktsrom`) [F4]  
- Bruk i app: Hentes i `app.js`, gjøres om til GeoJSON, vises som eget lag + popup. Brukes også i “nærmeste”.

**Brannstasjoner**  
- Kilde: Supabase/PostGIS (`brannstasjoner`) [F4]  
- Bruk i app: Hentes i `app.js`, gjøres om til GeoJSON, vises som eget lag + popup. Brukes i “nærmeste”.

**Sykehus**  
- Kilde: Supabase/PostGIS (`sykehus`) [F4]  
- Bruk i app: Hentes i `app.js` (navn/telefon/geometri) og vises som kartlag + popup.

**Adresse-søk**  
- Kilde: Nominatim API (OpenStreetMap)  
- Bruk i app: Adresse → koordinater (lon/lat) som settes som brukerposisjon når GPS ikke brukes.

**Rute**  
- Kilde: OSRM-endepunkter (bil + gange)  
- Bruk i app: Returnerer en rute som GeoJSON LineString, tegnes som rutelag og gir tid/avstand.

### Kort om databehandling og opplasting
Vi har GeoJSON-filer lokalt (f.eks. `tilfluktsrom.geojson` og `brannstasjoner.geojson`). Scriptet `upload_data.py` brukes til å laste disse inn i Supabase-tabeller, der geometri lagres som punkt (typisk WKT/POINT-representasjon) [F3][F4].

## Interaktivitet (krav)
- **Popups:** Klikk på punkter for å vise attributter (navn, adresse, telefon osv.).
- **Datadrevet styling:** Eget kartlag per kategori + rutelag, slik at “data” og “resultat” er tydelig skilt.
- **Layer control:** Brukeren kan slå lag av/på via checkbokser (tilfluktsrom, brannstasjoner, sykehus).
- **Romlig spørring:** `Turf.nearestPoint()` finner nærmeste objekt fra brukerposisjon, og dette brukes som mål for ruting [F2].

## Geografi og koordinatsystem
GPS/adressesøk gir vanligvis koordinater i **WGS84 (EPSG:4326)** i rekkefølgen `[lon, lat]`. Webkart rendrer ofte internt i **Web Mercator (EPSG:3857)** fordi det passer godt med kartfliser og zoom-nivå [F2]. I praksis betyr det at vi må være konsekvente med koordinatrekkefølge og referansesystem når vi sender koordinater til analyse (Turf) og ruting (OSRM) [F2].

## Systemarkitektur / dataflyt
Vi har valgt en løsning der mest mulig skjer i nettleseren (client-side) for å gjøre appen enkel å kjøre og demonstrere. Når siden lastes, henter `app.js` punktdata fra Supabase/PostGIS. Dataene konverteres til GeoJSON og legges inn som egne lag i MapLibre. Når brukeren velger posisjon (GPS eller adresse), lager vi et Turf “point” og finner nærmeste ressurs i valgt kategori. Deretter sendes start og mål til riktig rutetjeneste (bil eller gange), og vi får tilbake en GeoJSON-linje som tegnes i kartet. Resultatfeltet oppdateres med minutter og kilometer [F2][F4].

```text
Supabase/PostGIS → app.js → GeoJSON → MapLibre (lag + popups + toggles)
GPS/Adresse → Turf (nærmeste) → OSRM (rute) → rutelag + tid/avstand

## Refleksjon (endringer gradvis + hvorfor)

I løpet av arbeidet forbedret vi løsningen steg for steg for å møte kravene bedre og gjøre systemet mer realistisk.

Vi startet med lokale GeoJSON-filer, men gikk over til **Supabase/PostGIS** for å kunne oppdatere og utvide datasett uten å endre frontend-koden hver gang. Dette gjør løsningen mer skalerbar og mer lik hvordan webkart ofte bygges i praksis [F4].

Deretter utvidet vi kartet fra én ressurskategori til flere (**tilfluktsrom, brannstasjoner og sykehus**). Dette ble gjort både for å gjøre appen mer nyttig i en krisesituasjon, og for å teste at samme logikk for lag, popups, lagkontroll og “finn nærmeste” fungerer på tvers av datakilder.

Vi forbedret også ruting ved å skille mellom **gange** og **bil**. Fotgjengere bør kunne bruke stier og snarveier, mens bilruter må følge veinettet. Å bruke ulike endepunkter gir mer realistiske ruter og tidsestimater.

Underveis oppdaget vi at geometri kan komme i litt ulike formater fra databasen, så vi gjorde datalesingen mer robust for å unngå at appen stopper ved små variasjoner. Til slutt forbedret vi UI for mobil/feltbruk ved å ha tydelig resultatboks og lagvalg, slik at kartet blir mindre “rotete” når flere lag vises samtidig.

---

## Mulige forbedringer

- **Ytelse og skalering:** Ved store datasett bør vi hente data med bbox-filter eller flytte mer av analysen til PostGIS (romlige spørringer + indeks) [F4].
- **Offline-støtte:** I en krisesituasjon kan nett være nede. En PWA med caching av kartfliser og viktige data kan gjøre løsningen mer robust.
- **Mer tematisk kartografi:** Knytte styling tydeligere til attributter (f.eks. kapasitet) og legge til legend for lettere tolkning [F2].

---

## For å kjøre lokalt

```bash
python3 -m http.server 8000
Åpne: http://localhost:8000


## Kilder 
[F2] Forelesning 2 – Geografisk webutvikling (20.01.2026): kartklienter, EPSG:4326/3857, raster tiles (XYZ), GeoJSON, klient-side analyse.
[F3] Forelesning 3 – Datakilder del 1 (27.01.2026): raster/vektor, GeoJSON (Feature/FeatureCollection), WKT/WKB, OGC-tjenester og OGC API.
[F4] Forelesning 4 – Datakilder del 2 (03.02.2026): romlige databaser (PostGIS), Spatial SQL, romlige indekser (GiST), Supabase som PostGIS-tjeneste.
