from __future__ import annotations

import argparse
import json
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import osmium

HIGHWAY_CODES = {
    'motorway': 1,
    'motorway_link': 2,
    'trunk': 3,
    'trunk_link': 4,
    'primary': 5,
    'primary_link': 6,
    'secondary': 7,
    'secondary_link': 8,
    'tertiary': 9,
    'tertiary_link': 10,
    'unclassified': 11,
    'residential': 12,
    'living_street': 13,
    'service': 14,
    'road': 15,
    'track': 16,
    'pedestrian': 17,
    'path': 18,
    'footway': 19,
    'cycleway': 20,
    'steps': 21,
    'construction': 22,
}

DRIVING_HIGHWAYS = {
    'motorway',
    'motorway_link',
    'trunk',
    'trunk_link',
    'primary',
    'primary_link',
    'secondary',
    'secondary_link',
    'tertiary',
    'tertiary_link',
    'unclassified',
    'residential',
    'living_street',
    'service',
    'road',
}

WALKING_HIGHWAYS = {
    'motorway',
    'motorway_link',
    'trunk',
    'trunk_link',
    'primary',
    'primary_link',
    'secondary',
    'secondary_link',
    'tertiary',
    'tertiary_link',
    'unclassified',
    'residential',
    'living_street',
    'service',
    'road',
    'track',
    'pedestrian',
    'path',
    'footway',
    'cycleway',
    'steps',
}

DRIVING_SPEED_KMH = {
    1: 90,
    2: 55,
    3: 80,
    4: 55,
    5: 70,
    6: 50,
    7: 60,
    8: 45,
    9: 50,
    10: 40,
    11: 40,
    12: 30,
    13: 15,
    14: 20,
    15: 25,
    16: 15,
}

WALKING_SPEED_KMH = {
    1: 5.0,
    2: 5.0,
    3: 5.0,
    4: 5.0,
    5: 5.0,
    6: 5.0,
    7: 5.0,
    8: 5.0,
    9: 5.0,
    10: 5.0,
    11: 5.0,
    12: 5.0,
    13: 5.0,
    14: 5.0,
    15: 5.0,
    16: 4.5,
    17: 5.0,
    18: 5.0,
    19: 5.0,
    20: 5.0,
    21: 2.5,
    22: 4.0,
}

DRIVING_RESTRICTED_VALUES = {'no', 'private'}
WALKING_RESTRICTED_VALUES = {'no', 'private'}

@dataclass(frozen=True)
class Bounds:
    west: float
    south: float
    east: float
    north: float


def read_geojson_bounds(path: Path) -> Bounds:
    data = json.loads(path.read_text(encoding='utf-8-sig'))
    xs: list[float] = []
    ys: list[float] = []

    def walk_coords(coords: Any) -> None:
        if not isinstance(coords, list) or not coords:
            return
        first = coords[0]
        if isinstance(first, (float, int)) and len(coords) >= 2:
            xs.append(float(coords[0]))
            ys.append(float(coords[1]))
            return
        for item in coords:
            walk_coords(item)

    for feature in data.get('features', []):
        geometry = feature.get('geometry') or {}
        walk_coords(geometry.get('coordinates'))

    if not xs or not ys:
        raise ValueError(f'Could not determine bounds from {path}')

    return Bounds(min(xs), min(ys), max(xs), max(ys))


def expand_bounds(bounds: Bounds, buffer_degrees: float) -> Bounds:
    return Bounds(
        bounds.west - buffer_degrees,
        bounds.south - buffer_degrees,
        bounds.east + buffer_degrees,
        bounds.north + buffer_degrees,
    )


def is_in_bounds(lon: float, lat: float, bounds: Bounds | None) -> bool:
    if bounds is None:
        return True
    return bounds.west <= lon <= bounds.east and bounds.south <= lat <= bounds.north


def is_restricted(tags: dict[str, Any], keys: tuple[str, ...], restricted_values: set[str]) -> bool:
    for key in keys:
        value = tags.get(key)
        if value and str(value).lower() in restricted_values:
            return True
    return False


def is_driving_way(tags: dict[str, Any]) -> bool:
    highway = tags.get('highway')
    if not highway or highway not in DRIVING_HIGHWAYS:
        return False
    if is_restricted(tags, ('access', 'motor_vehicle', 'vehicle', 'motorcar'), DRIVING_RESTRICTED_VALUES):
        return False
    return True


def is_walking_way(tags: dict[str, Any]) -> bool:
    highway = tags.get('highway')
    if not highway or highway not in WALKING_HIGHWAYS:
        return False
    if is_restricted(tags, ('access', 'foot', 'pedestrian'), WALKING_RESTRICTED_VALUES):
        return False
    return True


def oneway_direction(tags: dict[str, Any]) -> int:
    oneway = str(tags.get('oneway', '')).lower()
    if oneway in {'yes', 'true', '1'} or str(tags.get('junction', '')).lower() == 'roundabout':
        return 1
    if oneway == '-1':
        return -1
    return 0


@dataclass(frozen=True)
class WayData:
    node_refs: tuple[int, ...]
    highway: str
    direction: int


class WayCollector(osmium.SimpleHandler):
    def __init__(self, bounds: Bounds | None = None):
        super().__init__()
        self.bounds = bounds
        self.driving_ways: list[WayData] = []
        self.walking_ways: list[WayData] = []
        self.used_node_ids: set[int] = set()

    def way(self, w: osmium.osm.Way) -> None:  # pragma: no cover - osmium callback
        tags = dict(w.tags)
        highway = tags.get('highway')
        if not highway:
            return

        # Fast bbox prefilter from way envelope if available.
        if self.bounds is not None:
            way_in_bounds = False
            for node_ref in w.nodes:
                if not node_ref.location.valid():
                    continue
                if is_in_bounds(node_ref.location.lon, node_ref.location.lat, self.bounds):
                    way_in_bounds = True
                    break
            if not way_in_bounds:
                return

        node_refs = tuple(int(node_ref.ref) for node_ref in w.nodes)
        if len(node_refs) < 2:
            return

        if is_driving_way(tags):
            self.driving_ways.append(WayData(node_refs=node_refs, highway=highway, direction=oneway_direction(tags)))
            self.used_node_ids.update(node_refs)

        if is_walking_way(tags):
            self.walking_ways.append(WayData(node_refs=node_refs, highway=highway, direction=0))
            self.used_node_ids.update(node_refs)


class NodeCollector(osmium.SimpleHandler):
    def __init__(self, used_node_ids: set[int], bounds: Bounds | None = None):
        super().__init__()
        self.used_node_ids = used_node_ids
        self.bounds = bounds
        self.node_map: dict[int, tuple[float, float]] = {}

    def node(self, n: osmium.osm.Node) -> None:  # pragma: no cover - osmium callback
        node_id = int(n.id)
        if node_id not in self.used_node_ids:
            return
        if not n.location.valid():
            return

        lon = float(n.location.lon)
        lat = float(n.location.lat)
        if not is_in_bounds(lon, lat, self.bounds):
            return

        self.node_map[node_id] = (lon, lat)


def haversine_meters(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    radius = 6371000.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    return 2.0 * radius * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))


def build_graph_from_pbf(pbf_path: Path, bounds: Bounds | None) -> dict[str, Any]:
    way_collector = WayCollector(bounds)
    way_collector.apply_file(str(pbf_path), locations=True)

    node_collector = NodeCollector(way_collector.used_node_ids, bounds)
    node_collector.apply_file(str(pbf_path), locations=False)
    node_map = node_collector.node_map

    if not node_map:
        return {
            'metadata': {
                'region': 'Agder',
                'nodeCount': 0,
                'drivingEdgeCount': 0,
                'walkingEdgeCount': 0,
            },
            'highwayCodes': HIGHWAY_CODES,
            'nodes': [],
            'graphs': {
                'driving': [],
                'walking': [],
            },
        }

    ordered_nodes = sorted(node_map.keys())
    node_index = {node_id: idx for idx, node_id in enumerate(ordered_nodes)}
    nodes = [[node_map[node_id][0], node_map[node_id][1]] for node_id in ordered_nodes]

    def build_edges(
        ways: list[WayData],
        speed_profile: dict[int, float],
        mode: str,
    ) -> list[list[float]]:
        edges: list[list[float]] = []
        for way in ways:
            node_refs = way.node_refs
            highway = way.highway
            direction = way.direction
            highway_code = HIGHWAY_CODES.get(highway, HIGHWAY_CODES['road'])
            speed_kmh = speed_profile.get(highway_code, 30.0 if mode == 'driving' else 5.0)
            for start_ref, end_ref in zip(node_refs, node_refs[1:]):
                if start_ref not in node_index or end_ref not in node_index:
                    continue
                lon1, lat1 = node_map[start_ref]
                lon2, lat2 = node_map[end_ref]
                distance_m = haversine_meters(lon1, lat1, lon2, lat2)
                if distance_m <= 0:
                    continue
                cost_seconds = (distance_m / 1000.0) / speed_kmh * 3600.0
                u = node_index[start_ref]
                v = node_index[end_ref]

                if mode == 'driving' and direction == -1:
                    edges.append([v, u, highway_code, distance_m, cost_seconds])
                elif mode == 'driving' and direction == 1:
                    edges.append([u, v, highway_code, distance_m, cost_seconds])
                else:
                    edges.append([u, v, highway_code, distance_m, cost_seconds])
                    edges.append([v, u, highway_code, distance_m, cost_seconds])
        return edges

    driving_edges = build_edges(way_collector.driving_ways, DRIVING_SPEED_KMH, 'driving')
    walking_edges = build_edges(way_collector.walking_ways, WALKING_SPEED_KMH, 'walking')

    return {
        'metadata': {
            'region': 'Agder',
            'nodeCount': len(nodes),
            'drivingEdgeCount': len(driving_edges),
            'walkingEdgeCount': len(walking_edges),
        },
        'highwayCodes': HIGHWAY_CODES,
        'nodes': nodes,
        'graphs': {
            'driving': driving_edges,
            'walking': walking_edges,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description='Build an offline routing graph from a local OSM PBF.')
    parser.add_argument('--pbf', default='data/osm/sorlandet-260427.osm.pbf', help='Input OSM PBF file.')
    parser.add_argument('--region', default='data/datasett/agder_grense.geojson', help='GeoJSON file defining the routing area (bbox clip).')
    parser.add_argument('--output', default='data/routing/agder-routing-graph.json', help='Output graph JSON file.')
    parser.add_argument('--buffer-degrees', type=float, default=0.06, help='Bounding-box buffer around the region in degrees.')
    parser.add_argument('--no-region-clip', action='store_true', help='Disable region clipping and build from whole PBF.')
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    pbf_path = (root / args.pbf).resolve()
    region_path = (root / args.region).resolve()
    output_path = (root / args.output).resolve()

    if not pbf_path.exists():
        raise FileNotFoundError(pbf_path)

    clip_bounds: Bounds | None = None
    if not args.no_region_clip:
        if not region_path.exists():
            raise FileNotFoundError(region_path)
        clip_bounds = expand_bounds(read_geojson_bounds(region_path), args.buffer_degrees)
        print(f'Clipping graph to region bounds: {clip_bounds}')

    print(f'Building offline routing graph from {pbf_path}...')

    payload = build_graph_from_pbf(pbf_path, clip_bounds)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(
        f'Wrote {output_path} '
        f'({output_path.stat().st_size / 1024 / 1024:.2f} MB, '
        f"{payload['metadata']['nodeCount']} nodes)"
    )


if __name__ == '__main__':
    main()
