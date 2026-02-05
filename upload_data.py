import json
import os
from supabase import create_client, Client

# --- FYLL INN NØKLENE DINE HER (Fra Project Settings -> API) ---
URL = "https://wqfpqpvdicvejbvnplcf.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZnBxcHZkaWN2ZWpidm5wbGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDMyMzEsImV4cCI6MjA4NTc3OTIzMX0.S7Hl1YuOmzN6VpZTUnHus1PGUNb8r7bWGdcDdubys9o"

supabase: Client = create_client(URL, KEY)

def upload_data(filename, table_name, mapping_func):
    filepath = f'data/{filename}'
    if not os.path.exists(filepath):
        print(f"⚠️ Finner ikke {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Laster opp {len(data['features'])} rader til {table_name}...")
    
    rows = []
    for feature in data['features']:
        props = feature['properties']
        coords = feature['geometry']['coordinates']
        
        # Konverter til PostGIS-format: POINT(lon lat)
        location_wkt = f"POINT({coords[0]} {coords[1]})"
        
        row = mapping_func(props, location_wkt)
        rows.append(row)

    try:
        supabase.table(table_name).insert(rows).execute()
        print(f"✅ {table_name} ferdig opplastet!")
    except Exception as e:
        print(f"❌ Feil ved {table_name}: {e}")

# Hjelpefunksjoner for å koble GeoJSON-felt til Database-kolonner
def map_tilfluktsrom(p, loc):
    return {
        "navn": p.get("navn", ""),
        "adresse": p.get("adresse", ""),
        "plasser": int(p.get("plasser", 0)) if p.get("plasser") else 0,
        "romnr": p.get("romnr", ""),
        "location": loc
    }

def map_brann(p, loc):
    return {
        "brannstasjon": p.get("brannstasjon", ""),
        "brannvesen": p.get("brannvesen", ""),
        "location": loc
    }

if __name__ == "__main__":
    upload_data('tilfluktsrom.geojson', 'tilfluktsrom', map_tilfluktsrom)
    upload_data('brannstasjoner.geojson', 'brannstasjoner', map_brann)