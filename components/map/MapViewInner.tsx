'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Polygon, Popup, useMapEvents, useMap, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw'; // Import leaflet-draw side effects
import type { Order, User, Zone, RiderLocation } from '@/lib/types';
import Link from 'next/link';
import { RIYADH_CENTER, DEFAULT_ZOOM } from '@/lib/constants';

// Fix default marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

function createColoredIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

const orderColorMap: Record<string, string> = {
  delivery: '#3b82f6',
  return_pickup: '#f97316',
  failed_return: '#ef4444',
};

const zoneColors = ['#3b82f680', '#f9731680', '#8b5cf680', '#10b98180', '#f59e0b80', '#ec489980'];

interface MapViewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  orders?: Order[];
  riders?: (User & { location?: RiderLocation })[];
  zones?: Zone[];
  className?: string;
  onClick?: (latlng: { lat: number; lng: number }) => void;
  markerPosition?: { lat: number; lng: number } | null;
  editable?: boolean;
  onZoneEdit?: (zoneId: string, newCoordinates: number[][]) => void;
  onGetCurrentCoordinates?: (callback: () => number[][] | null) => void;
}

function ClickHandler({ onClick }: { onClick?: (latlng: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      onClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}


export default function MapViewInner({
  center = RIYADH_CENTER,
  zoom = DEFAULT_ZOOM,
  orders = [],
  riders = [],
  zones = [],
  className = '',
  onClick,
  markerPosition,
  editable = false,
  onZoneEdit,
  onGetCurrentCoordinates,
}: MapViewProps) {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className={`w-full rounded-lg ${className}`}
      style={{ height: '100%', minHeight: '300px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {onClick && <ClickHandler onClick={onClick} />}

      {/* Marker position for pin picker */}
      {markerPosition && (
        <Marker position={[markerPosition.lat, markerPosition.lng]} />
      )}

      {/* Editable Zones */}
      <FeatureGroup ref={featureGroupRef}>
        {zones.map((zone, i) => (
          <Polygon
            key={zone.id}
            positions={zone.polygon.coordinates[0].map(([lng, lat]) => [lat, lng] as [number, number])}
            pathOptions={{
              color: zoneColors[i % zoneColors.length].replace('80', 'ff'),
              fillColor: zoneColors[i % zoneColors.length],
              fillOpacity: 0.2,
              weight: 2,
            }}
          >
            <Popup>{zone.name}</Popup>
          </Polygon>
        ))}
      </FeatureGroup>

      {/* Draw Control */}
      {editable && (
        <EditControlWrapper
          featureGroupRef={featureGroupRef}
          zones={zones}
          onGetCurrentCoordinates={onGetCurrentCoordinates}
        />
      )}

      {/* Rider dots */}
      {riders.map((rider) => {
        if (!rider.location) return null;
        return (
          <CircleMarker
            key={rider.id}
            center={[rider.location.lat, rider.location.lng]}
            radius={8}
            pathOptions={{
              color: 'white',
              weight: 2,
              fillColor: rider.is_active ? '#22c55e' : '#9ca3af',
              fillOpacity: 1,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-medium">{rider.full_name}</p>
                <p className="text-muted-foreground">
                  {rider.is_active ? 'Active' : 'Offline'}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {/* Order pins */}
      {orders.map((order) => (
        <Marker
          key={order.id}
          position={[order.lat, order.lng]}
          icon={createColoredIcon(orderColorMap[order.type] ?? '#3b82f6')}
        >
          <Popup>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.customer_name}</p>
              <p className="capitalize">{order.type.replace('_', ' ')} · {order.status.replace('_', ' ')}</p>
              <Link href={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                View Details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function EditControlWrapper({
  featureGroupRef,
  zones,
  onGetCurrentCoordinates
}: {
  featureGroupRef: React.RefObject<L.FeatureGroup | null>,
  zones: Zone[],
  onGetCurrentCoordinates?: (callback: () => number[][] | null) => void
}) {
  const map = useMap();
  const editingLayerRef = useRef<L.Polygon | null>(null);

  useEffect(() => {
    if (!featureGroupRef.current) return;

    // No L.Control.Draw toolbar — the app's custom UI handles edit/save/cancel.
    // We programmatically enable editing on the polygon layer instead.
    // Wait a tick for react-leaflet to finish rendering the <Polygon> into the FeatureGroup.
    const timerId = setTimeout(() => {
      if (!featureGroupRef.current) return;

      const layers = featureGroupRef.current.getLayers();
      if (layers.length === 0) return;

      const layer = layers[0] as L.Polygon;
      if (!layer || !(layer as any).editing) return;

      (layer as any).editing.enable();
      editingLayerRef.current = layer;
    }, 50);

    // Function to get current coordinates from the polygon
    const getCurrentCoordinates = (): number[][] | null => {
      if (zones.length !== 1 || !featureGroupRef.current) {
        return null;
      }

      const layers = featureGroupRef.current.getLayers();
      const layer = layers[0] as any;
      if (!layer) return null;

      // When editing is enabled, layer.editing.latlngs is the mutable reference
      // that tracks dragged vertex positions in real-time.
      let rawLatLngs: any;
      if (layer.editing && layer.editing._enabled) {
        rawLatLngs = layer.editing.latlngs;
      } else {
        rawLatLngs = layer.getLatLngs();
      }

      // Unwrap nested arrays until we find LatLng objects (with .lat property)
      let latlngs: any[] = rawLatLngs;
      while (latlngs.length > 0 && Array.isArray(latlngs[0]) && !('lat' in latlngs[0])) {
        latlngs = latlngs[0];
      }

      if (!latlngs || latlngs.length < 3) return null;

      // Convert to [[lng, lat], ...] (GeoJSON format)
      const newCoords = latlngs.map((ll: any) => [ll.lng, ll.lat]);

      // Close the loop if needed (GeoJSON polygons must have first == last point)
      if (newCoords.length > 0) {
        const first = newCoords[0];
        const last = newCoords[newCoords.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          newCoords.push([first[0], first[1]]);
        }
      }

      return newCoords;
    };

    if (onGetCurrentCoordinates) {
      onGetCurrentCoordinates(getCurrentCoordinates);
    }

    return () => {
      clearTimeout(timerId);
      if (editingLayerRef.current && (editingLayerRef.current as any).editing) {
        (editingLayerRef.current as any).editing.disable();
        editingLayerRef.current = null;
      }
    };
  }, [map, featureGroupRef, onGetCurrentCoordinates, zones]);

  return null;
}
