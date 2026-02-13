'use client';

import { MapView } from './MapView';
import { RIYADH_CENTER } from '@/lib/constants';

interface PinPickerProps {
  value: { lat: number; lng: number } | null;
  onChange: (latlng: { lat: number; lng: number }) => void;
}

export function PinPicker({ value, onChange }: PinPickerProps) {
  return (
    <div className="space-y-2">
      <div className="h-[300px] rounded-lg overflow-hidden border">
        <MapView
          center={value ?? RIYADH_CENTER}
          zoom={13}
          onClick={onChange}
          markerPosition={value}
        />
      </div>
      {value ? (
        <p className="text-xs text-muted-foreground">
          Lat: {value.lat.toFixed(6)}, Lng: {value.lng.toFixed(6)}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">Click on the map to place a pin</p>
      )}
    </div>
  );
}
