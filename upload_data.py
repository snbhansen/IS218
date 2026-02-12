import json
import os
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = 'https://wqfpqpvdicvejbvnplcf.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZnBxcHZkaWN2ZWpidm5wbGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDMyMzEsImV4cCI6MjA4NTc3OTIzMX0.S7Hl1YuOmzN6VpZTUnHus1PGUNb8r7bWGdcDdubys9o'

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_drinking_water():
    """Upload drinking water GeoJSON from data/drikkevann.geojson to Supabase."""
    
    geojson_path = 'data/drikkevann.geojson'
    
    # Load GeoJSON
    if not os.path.exists(geojson_path):
        print(f"Error: {geojson_path} not found.")
        return
    
    with open(geojson_path, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)
    
    features = geojson_data.get('features', [])
    print(f"Loaded {len(features)} features from {geojson_path}")
    
    # Prepare rows for insertion
    rows = []
    for idx, feature in enumerate(features):
        geometry = feature.get('geometry')
        properties = feature.get('properties', {})
        
        # Skip if no geometry
        if not geometry:
            print(f"  Skipping feature {idx}: no geometry")
            continue
        
        geom_type = geometry.get('type')
        
        # Only accept Polygon, MultiPolygon, and Point
        if geom_type not in ['Polygon', 'MultiPolygon', 'Point']:
            print(f"  Skipping feature {idx}: unsupported geometry type {geom_type}")
            continue
        
        row = {
            'name': properties.get('name'),
            'geom': geometry  # Store as GeoJSON geometry object
        }
        rows.append(row)
    
    print(f"Prepared {len(rows)} rows for upload")
    
    # Insert in batches
    batch_size = 100
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        try:
            response = supabase.table('drikkevann').insert(batch).execute()
            print(f"  Batch {i // batch_size + 1}: Inserted {len(batch)} rows")
        except Exception as e:
            print(f"  Error inserting batch {i // batch_size + 1}: {e}")
    
    print("Upload complete!")

def create_table_and_policy():
    """
    Create drikkevann table with geometry column and RLS policy.
    Run this once before uploading data.
    """
    sql_commands = [
        # Create table with geometry column
        """
        CREATE TABLE IF NOT EXISTS public.drikkevann (
            id BIGSERIAL PRIMARY KEY,
            name TEXT,
            geom GEOMETRY(GEOMETRY, 4326),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        
        # Create spatial index on geom
        """
        CREATE INDEX IF NOT EXISTS drikkevann_geom_idx ON public.drikkevann USING GIST (geom);
        """,
        
        # Enable RLS
        """
        ALTER TABLE public.drikkevann ENABLE ROW LEVEL SECURITY;
        """,
        
        # Create policy for public read access
        """
        CREATE POLICY "Allow public read access to drikkevann" ON public.drikkevann
        FOR SELECT
        USING (true);
        """
    ]
    
    print("Run these SQL commands in Supabase SQL Editor:")
    for cmd in sql_commands:
        print(cmd.strip())
        print("---")

if __name__ == '__main__':
    print("Supabase GeoJSON Upload Script")
    print("=" * 40)
    
    # Uncomment to create table and RLS policy (run once)
    # create_table_and_policy()
    
    # Upload data
    upload_drinking_water()