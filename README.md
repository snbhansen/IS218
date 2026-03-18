# IS218
Student repository – Group 15

## Kort Beskrivelse 
Dette prosjektet er et responsivt webkart (SPA) som hjelper innbyggere i Agder/Kristiansand med å finne nærmeste beredskapsressurs når tid er kritisk. Brukeren kan bruke GPS (“Use my location”) eller søke etter adresse, og appen finner nærmeste tilfluktsrom, brannstasjon eller sykehus. Deretter beregnes rute (bil eller gange), og appen viser estimert tid og avstand.


## Demo
- Trykk **“Use my location”** (GPS) eller søk etter adresse (Nominatim).
- Velg kategori: **Nearest Shelter / Nearest Fire Station / Nearest Hospital**.
- Appen finner nærmeste punkt med Turf.js og beregner rute med OSRM.
- Ruten tegnes i kartet, og infoboksen viser reisetid og distanse.
- Klikk på punkter for å se info i popup.
- Slå lag av/på i **“View (Layers)”** for å rydde kartet.

  ------

## Teknisk stack
- **Frontend:** HTML5, CSS3, Vanilla JS (ES6+)
- **Kartbibliotek:** MapLibre GL JS (WebGL-kartklient)
- **Basemap:** OpenStreetMap raster tiles (XYZ)
- **Database:** Supabase (PostGIS) for lagring av steddata med geometri
- **Dataformat i kart:** GeoJSON (bygges i klient fra databaserader)
- **Romlig analyse:** Turf.js (`nearestPoint`) for å finne nærmeste objekt lokalt i nettleseren
- **Geokoding:** Nominatim (adresse → koordinater)
- **Ruting:** OSRM (bil) + routed-foot (gange)


  ------
  

### Hvorfor disse valgene?
Vi bruker MapLibre fordi det er en moderne kartmotor som håndterer interaktive lag og dynamisk styling effektivt i nettleseren. Vi bruker Supabase/PostGIS fordi det gjør dataene enklere å oppdatere og utvide enn kun statiske filer, og gir et godt grunnlag for videre skalering med romlige spørringer og indekser. Vi bruker Turf.js for “serverløs” romlig analyse i klienten, som passer bra når datasettet ikke er altfor stort.


## Datakatalog

**Tilfluktsrom**  
- Kilde: Supabase/PostGIS (`tilfluktsrom`)  
- Bruk i app: Hentes i `app.js`, gjøres om til GeoJSON, vises som eget lag + popup. Brukes også i “nærmeste”.

**Brannstasjoner**  
- Kilde: Supabase/PostGIS (`brannstasjoner`)  
- Bruk i app: Hentes i `app.js`, gjøres om til GeoJSON, vises som eget lag + popup. Brukes i “nærmeste”.

**Sykehus**
- Kilde: Supabase/PostGIS (`sykehus`)
- Bruk i app: Hentes i `app.js` via egen `fetchHospitals()`-funksjon som henter kolonnene `name`, `phone` og `WKT`. Vises som kartlag + popup. Brukes i "nærmeste".

**Adresse-søk**  
- Kilde: Nominatim API (OpenStreetMap)  
- Bruk i app: Adresse → koordinater (lon/lat) som settes som brukerposisjon når GPS ikke brukes.

**Rute**  
- Kilde: OSRM-endepunkter (bil + gange)  
- Bruk i app: Returnerer en rute som GeoJSON LineString, tegnes som rutelag og gir tid/avstand.


-------

### Kort om databehandling og opplasting
Vi har GeoJSON-filer lokalt (`tilfluktsrom.geojson`, `brannstasjoner.geojson` og `sykehus.geojson`). Scriptet `upload_data.py` brukes til å laste `tilfluktsrom` og `brannstasjoner` inn i Supabase-tabeller, der geometri lagres som punkt (WKT-format: `POINT(lon lat)`) i kolonnen `location`. Sykehusdata (`sykehus.geojson`) er lastet opp manuelt/separat og lagret med en `WKT`-kolonne i databasen.

## Interaktivitet 
- **Popups:** Klikk på punkter for å vise attributter (navn, adresse, telefon osv.).
- **Lag-separasjon:** Eget kartlag per kategori + rutelag med faste farger (gul, rød, grønn), slik at “data” og “resultat” er tydelig skilt.
- **Layer control:** Brukeren kan slå lag av/på via checkbokser (tilfluktsrom, brannstasjoner, sykehus).
- **Romlig spørring:** Turf (`nearestPoint`) finner nærmeste objekt fra brukerposisjon, og dette brukes som mål for ruting.

-------


## Geografi og koordinatsystem
GPS/adressesøk gir vanligvis koordinater i WGS84 (EPSG:4326) i rekkefølgen `[lon, lat]`. Webkart rendrer ofte internt i Web Mercator (EPSG:3857) fordi det passer godt med kartfliser og zoom-nivå. I praksis betyr det at vi må være konsekvente med koordinatrekkefølge og referansesystem når vi sender koordinater til analyse (Turf) og ruting (OSRM).

-------

## Systemarkitektur / dataflyt
Vi har valgt en løsning der mest mulig skjer i nettleseren (client-side) for å gjøre appen enkel å kjøre og demonstrere. Når siden lastes, henter `app.js` punktdata fra Supabase/PostGIS. Dataene konverteres til GeoJSON og legges inn som egne lag i MapLibre. Når brukeren velger posisjon (GPS eller adresse), lager vi et Turf “point” og finner nærmeste ressurs i valgt kategori. Deretter sendes start og mål til riktig rutetjeneste (bil eller gange), og vi får tilbake en GeoJSON-linje som tegnes i kartet. Resultatfeltet oppdateres med minutter og kilometer.

```text
Supabase/PostGIS → app.js → GeoJSON → MapLibre (lag + popups + toggles)
GPS/Adresse → Turf (nærmeste) → OSRM (rute) → rutelag + tid/avstand
```

-------

## Refleksjon 

- **Fra statiske filer til database (Supabase/PostGIS):** Vi startet med lokale GeoJSON-filer, men gikk over til Supabase/PostGIS for å kunne oppdatere og utvide datasett uten å endre frontend-koden hver gang. Dette gjør løsningen mer skalerbar og mer lik hvordan webkart ofte bygges i praksis.
- **Flere ressurskategorier:** Vi utvidet kartet fra én ressurskategori til flere (tilfluktsrom, brannstasjoner og sykehus) for å gjøre appen mer nyttig i en krisesituasjon og for å teste at samme logikk (lag, popups, lagkontroll og “finn nærmeste”) fungerer på tvers av datakilder.
- **Bedre ruting (gange vs bil):** Vi forbedret ruting ved å skille mellom gange og bil. Fotgjengere trenger ruter som kan bruke stier og snarveier, mens bilruter må følge veinettet. Dette gir mer realistiske ruter og tidsestimater.
- **Mer robust datalesing:** Vi gjorde datalesingen mer robust fordi geometri kan komme i litt ulike formater fra databasen. Målet var å unngå at appen stopper ved små variasjoner i data.
- **Bedre UI for mobil/feltbruk:** Vi forbedret UI med tydelig resultatboks og lagvalg, slik at kartet blir mindre “rotete” når flere lag vises samtidig.

## Mulige forbedringer

- **Ytelse og skalering:** Ved store datasett bør vi hente data med bbox-filter eller flytte mer av analysen til PostGIS (romlige spørringer + indeks).
- **Offline-støtte:** I en krisesituasjon kan nett være nede. En PWA med caching av kartfliser og viktige data kan gjøre løsningen mer robust.
- **Mer tematisk kartografi:** Knytte styling tydeligere til attributter (f.eks. kapasitet) og legge til legend for lettere tolkning.


------


## For å kjøre lokalt
python3 -m http.server 8000

**Åpne:**  http://localhost:8000

**Demo-video:** https://drive.google.com/file/d/1_9Z-YgZY2Djvj7SgpeqAw1mw3zZdA9S7/view?usp=sharing


------

# Oppgave 2

## Del B – Utvidelse av Webkart (Spatial SQL)

### Beskrivelse av utvidelsen

Vi har utvidet webkartet med et **klikk-basert radius-søk** som bruker **PostGIS via Supabase**.
Brukeren aktiverer søkemodus ved å trykke "Click map to search", justerer radius (100–2000 m)
med en slider, og klikker deretter et sted i kartet.

Applikasjonen sender koordinatene til en SQL-funksjon i Supabase som bruker
`ST_DWithin` og `ST_Distance` til å finne alle beredskapsressurser (tilfluktsrom,
brannstasjoner og sykehus) innenfor valgt radius. Resultatet vises umiddelbart i kartet
som fargede markører og i en liste i sidepanelet med navn og avstand.

**Visuell feedback:**
- Lilla stiplet sirkel rundt klikk-punktet viser søkeradius
- Klikk-markør (sikte-ikon) markerer der brukeren klikket
- Fargede prikker (gul/rød/grønn/blå) viser treff på kartet
- Resultatliste i panelet viser type, navn og avstand i meter

### SQL-snippet – Supabase PostGIS-funksjon

```sql
DROP FUNCTION IF EXISTS finn_naerliggende(double precision, double precision, integer) CASCADE;

CREATE OR REPLACE FUNCTION finn_naerliggende(
    klikk_lng double precision,
    klikk_lat double precision,
    radius_m  integer DEFAULT 500
)
RETURNS TABLE(
    ressurs_type text,
    navn         text,
    distanse_m   double precision,
    lon          double precision,
    lat_out      double precision
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT
        'tilfluktsrom'::text,
        COALESCE(NULLIF(TRIM(navn),''), NULLIF(TRIM(adresse),''), 'Tilfluktsrom')::text,
        ST_Distance(location::geography, ST_SetSRID(ST_MakePoint(klikk_lng, klikk_lat), 4326)::geography),
        ST_X(location::geometry),
        ST_Y(location::geometry)
    FROM tilfluktsrom
    WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(klikk_lng, klikk_lat), 4326)::geography, radius_m)

    UNION ALL

    SELECT
        'brannstasjon'::text,
        COALESCE(brannstasjon, 'Brannstasjon')::text,
        ST_Distance(location::geography, ST_SetSRID(ST_MakePoint(klikk_lng, klikk_lat), 4326)::geography),
        ST_X(location::geometry),
        ST_Y(location::geometry)
    FROM brannstasjoner
    WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(klikk_lng, klikk_lat), 4326)::geography, radius_m)

    UNION ALL

    SELECT
        'sykehus'::text,
        COALESCE(name, 'Sykehus')::text,
        ST_Distance("WKT"::geography, ST_SetSRID(ST_MakePoint(klikk_lng, klikk_lat), 4326)::geography),
        ST_X("WKT"::geometry),
        ST_Y("WKT"::geometry)
    FROM sykehus
    WHERE ST_DWithin("WKT"::geography, ST_SetSRID(ST_MakePoint(klikk_lng, klikk_lat), 4326)::geography, radius_m)

    UNION ALL

    SELECT
        'drikkevann'::text,
        COALESCE(NULLIF(TRIM(name),''), 'Drikkevann')::text,
        ST_Distance(location::geography, ST_SetSRID(ST_MakePoint(klikk_lng, klikk_lat), 4326)::geography),
        ST_X(location::geometry),
        ST_Y(location::geometry)
    FROM drikkevann
    WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(klikk_lng, klikk_lat), 4326)::geography, radius_m)

    ORDER BY 3;
$$;

GRANT EXECUTE ON FUNCTION finn_naerliggende(double precision, double precision, integer) TO anon;
```

**PostGIS-funksjoner brukt:**

| Funksjon | Formål |
|----------|--------|
| `ST_DWithin` | Filtrer ressurser innenfor radius (meter via geography) |
| `ST_Distance` | Beregn eksakt avstand i meter fra klikk-punkt |
| `ST_MakePoint` | Bygg et geometriobjekt fra lon/lat |
| `ST_SetSRID` | Sett koordinatsystem (WGS84 / EPSG:4326) |
| `ST_X / ST_Y` | Hent koordinater fra geometri for å plassere markører |