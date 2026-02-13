'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Plus } from 'lucide-react';
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

export default function ZoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const zone = useZoneStore((s) => s.getZoneById(id));
  const updateZone = useZoneStore((s) => s.updateZone);
  const warehouses = useWarehouseStore((s) => s.warehouses);
  const riders = useRiderStore((s) => s.riders);
  const riderZonesAll = useRiderStore((s) => s.riderZones);
  const addRiderZone = useRiderStore((s) => s.addRiderZone);
  const removeRiderZone = useRiderStore((s) => s.removeRiderZone);

  const [zoneName, setZoneName] = useState(zone?.name ?? '');
  const [addRiderId, setAddRiderId] = useState('');

  if (!zone) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Zone not found.</p>
        <Button variant="link" onClick={() => router.push('/zones')}>Back to Zones</Button>
      </div>
    );
  }

  const warehouse = warehouses.find((w) => w.id === zone.warehouse_id);
  const assignedRiderIds = riderZonesAll
    .filter((rz) => rz.zone_id === zone.id)
    .map((rz) => rz.rider_id);
  const assignedRiders = riders.filter((r) => assignedRiderIds.includes(r.id));
  const unassignedRiders = riders.filter(
    (r) => !assignedRiderIds.includes(r.id) && r.warehouse_id === zone.warehouse_id
  );

  // Compute polygon center for map
  const coords = zone.polygon.coordinates[0];
  const centerLat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
  const centerLng = coords.reduce((s, c) => s + c[0], 0) / coords.length;

  const handleSave = () => {
    updateZone(zone.id, { name: zoneName });
    toast.success('Zone updated');
  };

  const handleAddRider = () => {
    if (!addRiderId) return;
    addRiderZone(addRiderId, zone.id);
    setAddRiderId('');
    toast.success('Rider added to zone');
  };

  const handleRemoveRider = (riderId: string) => {
    removeRiderZone(riderId, zone.id);
    toast.success('Rider removed from zone');
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/zones')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Zones
      </Button>

      {/* Map */}
      <div className="h-[70vh] rounded-lg overflow-hidden border">
        <MapView
          center={{ lat: centerLat, lng: centerLng }}
          zoom={13}
          zones={[zone]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Zone Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Zone Name</Label>
              <Input value={zoneName} onChange={(e) => setZoneName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Warehouse</Label>
              <Input value={warehouse?.name ?? '—'} disabled />
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Assigned Riders */}
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
              <div className="flex gap-2">
                <Select value={addRiderId} onValueChange={setAddRiderId}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Add rider..." />
                  </SelectTrigger>
                  <SelectContent>
                    {unassignedRiders.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleAddRider} disabled={!addRiderId}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
