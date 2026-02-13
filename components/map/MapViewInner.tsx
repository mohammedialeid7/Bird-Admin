'use client';

import { MapContainer, TileLayer, CircleMarker, Marker, Polygon, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
}: MapViewProps) {
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

      {/* Zone polygons */}
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
