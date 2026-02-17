'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Save, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapView } from '@/components/map/MapView';
import { useZoneStore } from '@/stores/zone-store';
import { useWarehouseStore } from '@/stores/warehouse-store';
import { useRiderStore } from '@/stores/rider-store';
import { toast } from 'sonner';

export default function ZoneDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const zone = useZoneStore((s) => s.getZoneById(id));
  const updateZone = useZoneStore((s) => s.updateZone);
  const warehouses = useWarehouseStore((s) => s.warehouses);
  const riders = useRiderStore((s) => s.riders);
  const riderZonesAll = useRiderStore((s) => s.riderZones);
  const addRiderZone = useRiderStore((s) => s.addRiderZone);
  const removeRiderZone = useRiderStore((s) => s.removeRiderZone);

  const [zoneName, setZoneName] = useState(zone?.name ?? '');
  const [isEditingMap, setIsEditingMap] = useState(false);
  // Store the function to get current coordinates from the map
  const getCurrentCoordsRef = useRef<(() => number[][] | null) | null>(null);

  if (!zone) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Zone not found.</p>
        <Button variant="link" onClick={() => router.push('/zones')}>Back to Zones</Button>
      </div>
    );
  }


  const assignedRiderIds = riderZonesAll
    .filter((rz) => rz.zone_id === zone.id)
    .map((rz) => rz.rider_id);
  const assignedRiders = riders.filter((r) => assignedRiderIds.includes(r.id));
  const unassignedRiders = riders.filter(
    (r) => !assignedRiderIds.includes(r.id) && r.warehouse_id && zone.warehouse_ids.includes(r.warehouse_id)
  );

  const unassignedWarehouses = warehouses.filter((w) => !zone.warehouse_ids.includes(w.id));

  const currentCoords = zone.polygon.coordinates[0];

  // Calculate center based on current coordinates
  const centerLat = currentCoords.reduce((s, c) => s + c[1], 0) / currentCoords.length;
  const centerLng = currentCoords.reduce((s, c) => s + c[0], 0) / currentCoords.length;

  // Construct the zone object to pass to MapView
  const displayZone = {
    ...zone,
    polygon: {
      ...zone.polygon,
      coordinates: [currentCoords],
    },
  };

  const handleRemoveRider = (riderId: string) => {
    removeRiderZone(riderId, zone.id);
    toast.success('Rider removed from zone');
  };

  const handleStartEditing = () => {
    // Don't set tempPolygonLoop - we'll read coordinates directly from the map when saving
    setIsEditingMap(true);
    toast.info('Drag the polygon points to resize or move the zone');
  };

  const handleCancelEditing = () => {
    setIsEditingMap(false);
  };

  const handleSaveMap = () => {
    // Read coordinates from the map while editing is still active
    const coordsToSave = getCurrentCoordsRef.current?.() ?? null;

    if (coordsToSave) {
      // Update the store first (while editing is still active and coords are valid),
      // then exit edit mode. The Polygon will re-render with the new store coordinates.
      updateZone(zone.id, {
        polygon: {
          type: 'Polygon',
          coordinates: [coordsToSave],
        },
      });
      setIsEditingMap(false);
      toast.success('Zone layout updated');
    } else {
      toast.error('Could not save zone changes - no coordinates available');
      setIsEditingMap(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push('/zones')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Zones
        </Button>
        <div className="flex items-center gap-2">
          {isEditingMap ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancelEditing}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSaveMap}>
                <Save className="w-4 h-4 mr-1" /> Save Layout
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleStartEditing}>
              <Pencil className="w-4 h-4 mr-1" /> Edit Zone Layout
            </Button>
          )}
        </div>
      </div>

      <div className={`h-[70vh] rounded-lg overflow-hidden border relative ${isEditingMap ? 'ring-2 ring-primary' : ''}`}>
        {isEditingMap && (
          <div className="absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur px-3 py-1.5 rounded-md shadow text-sm font-medium border animate-in fade-in slide-in-from-top-2">
            Editing Mode Active
          </div>
        )}
        <MapView
          center={{ lat: centerLat, lng: centerLng }}
          zoom={13}
          zones={[displayZone]}
          editable={isEditingMap}
          onGetCurrentCoordinates={(callback) => {
            console.log('[ZoneDetail] Received getCurrentCoordinates callback from MapView');
            getCurrentCoordsRef.current = callback;
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Zone Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Zone Name</Label>
              <Input
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                onBlur={() => {
                  if (zoneName !== zone.name) {
                    updateZone(zone.id, { name: zoneName });
                    toast.success('Zone updated');
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Warehouses</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {zone.warehouse_ids.map((wId) => {
                  const w = warehouses.find((wh) => wh.id === wId);
                  return (
                    <Badge key={wId} variant="outline" className="flex items-center gap-1">
                      {w?.name ?? wId}
                      <button
                        onClick={() => {
                          const newIds = zone.warehouse_ids.filter((id) => id !== wId);
                          updateZone(zone.id, { warehouse_ids: newIds });
                          toast.success('Warehouse removed');
                        }}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
              {unassignedWarehouses.length > 0 && (
                <Select
                  key={zone.warehouse_ids.join(',')}
                  onValueChange={(val) => {
                    if (zone.warehouse_ids.includes(val)) return;
                    updateZone(zone.id, { warehouse_ids: [...zone.warehouse_ids, val] });
                    toast.success('Warehouse added');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add warehouse..." />
                  </SelectTrigger>
                  <SelectContent>
                    {unassignedWarehouses
                      .map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assigned Riders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {assignedRiders.map((rider) => (
                <Badge key={rider.id} variant="outline" className="flex items-center gap-1 pr-1">
                  {rider.full_name}
                  <button
                    onClick={() => handleRemoveRider(rider.id)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {assignedRiders.length === 0 && (
                <p className="text-sm text-muted-foreground">No riders assigned.</p>
              )}
            </div>
            {unassignedRiders.length > 0 && (
              <Select
                key={assignedRiderIds.join(',')}
                onValueChange={(val) => {
                  addRiderZone(val, zone.id);
                  toast.success('Rider added to zone');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add rider..." />
                </SelectTrigger>
                <SelectContent>
                  {unassignedRiders.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
