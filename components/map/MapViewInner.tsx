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
}

function ClickHandler({ onClick }: { onClick?: (latlng: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      onClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function EditControl({ onEdit }: { onEdit: (e: any) => void }) {
  const map = useMap();
  const drawControlRef = useRef<L.Control.Draw | null>(null);

  useEffect(() => {
    // Basic setup for edit-only mode
    // We assume the FeatureGroup containing the editable layers is already added to the map
    // effectively by the map rendering the Polygons.
    // However, react-leaflet renders Polygons as separate layers, not automatically in a FeatureGroup that leaflet-draw knows about instantly unless we explicitly do it.
    // To make this work seamlessly with react-leaflet's declarative Polygons, we might need a workaround.
    // simpler approach: Use the 'edit' handler on the map events if we can hook into the layers.

    // Actually, leaflet-draw needs a FeatureGroup to know what to edit.
    // So we should wrap our editable Polygons in a FeatureGroup and pass that to the draw control.

    return () => {
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        drawControlRef.current = null;
      }
    };
  }, [map]);

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
      {editable && onZoneEdit && (
        <EditControlWrapper featureGroupRef={featureGroupRef} onZoneEdit={onZoneEdit} zones={zones} />
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
  onZoneEdit,
  zones
}: {
  featureGroupRef: React.RefObject<L.FeatureGroup | null>,
  onZoneEdit: (zoneId: string, newCoordinates: number[][]) => void,
  zones: Zone[]
}) {
  const map = useMap();
  const drawControlRef = useRef<L.Control.Draw | null>(null);

  useEffect(() => {
    if (!featureGroupRef.current) return;

    // Create the draw control
    const drawControl = new L.Control.Draw({
      draw: false, // Disable drawing new shapes
      edit: {
        featureGroup: featureGroupRef.current, // The FeatureGroup to edit
        remove: false, // Disable removal for now, unless we want to allow deleting zones via map
      },
    });

    map.addControl(drawControl);
    drawControlRef.current = drawControl;

    // Event handler for when editing finishes
    const handleEdit = (e: any) => {
      const layers = e.layers;
      layers.eachLayer((layer: any) => {
        // match layer to zone? 
        // Since we re-render polygons, we need a way to ID them.
        // Unfortuantely Leaflet layers don't automatically keep our React keys.
        // We can match by geometry or order if necessary, OR we can try to rely on the fact that only one zone is usually edited at a time in the detail view?
        // But here we might have multiple zones.
        // Let's assume we are in Zone Detail view where there is mainly ONE zone, or we can look up the zone by index if the order is preserved.
        // Better: Identify which zone corresponds to the layer.

        // In this specific MapView usage (ZoneDetailClient), we typically pass `zones=[zone]`.
        // So `zones[0]` is the target.

        // If we have multiple zones, we need a robust way.
        // For now, let's assume single zone editing or match closest.
        // But actually, we can just return the *new* coordinates of the edited layer.
        // The parent component knows which zone is being displayed if it's the detail view.

        if (zones.length === 1) {
          const latlngs = layer.getLatLngs()[0]; // Polygon shell
          // Convert to [[lng, lat], ...]
          // Leaflet LatLng is {lat, lng}
          const newCoords = latlngs.map((ll: any) => [ll.lng, ll.lat]);
          // Close the loop if needed? GeoJSON Polygons are closed. Leaflet's getLatLngs might not include the closing point.
          if (newCoords.length > 0 && (newCoords[0][0] !== newCoords[newCoords.length - 1][0] || newCoords[0][1] !== newCoords[newCoords.length - 1][1])) {
            newCoords.push(newCoords[0]);
          }

          onZoneEdit(zones[0].id, newCoords);
        }
      });
    };

    map.on(L.Draw.Event.EDITED, handleEdit);

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.EDITED, handleEdit);
      drawControlRef.current = null;
    };
  }, [map, featureGroupRef, onZoneEdit, zones]);

  return null;
}

