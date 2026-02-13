'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapView } from '@/components/map/MapView';
import { useWarehouseStore } from '@/stores/warehouse-store';
import { useZoneStore } from '@/stores/zone-store';
import { useRiderStore } from '@/stores/rider-store';
import { toast } from 'sonner';

export default function WarehouseDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const warehouse = useWarehouseStore((s) => s.getWarehouseById(id));
  const updateWarehouse = useWarehouseStore((s) => s.updateWarehouse);
  const zones = useZoneStore((s) => s.zones);
  const riders = useRiderStore((s) => s.riders);

  const [name, setName] = useState(warehouse?.name ?? '');
  const [address, setAddress] = useState(warehouse?.short_national_address ?? '');

  if (!warehouse) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Warehouse not found.</p>
        <Button variant="link" onClick={() => router.push('/warehouses')}>
          Back to Warehouses
        </Button>
      </div>
    );
  }

  const linkedZones = zones.filter((z) => z.warehouse_ids.includes(warehouse.id));
  const linkedRiders = riders.filter((r) => r.warehouse_id === warehouse.id);

  const handleSave = () => {
    updateWarehouse(warehouse.id, { name, short_national_address: address });
    toast.success('Warehouse updated');
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/warehouses')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Warehouses
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Warehouse Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Short National Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Coordinates</Label>
              <Input value={`${warehouse.lat}, ${warehouse.lng}`} disabled />
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] rounded-lg overflow-hidden">
              <MapView
                center={{ lat: warehouse.lat, lng: warehouse.lng }}
                zoom={14}
                markerPosition={{ lat: warehouse.lat, lng: warehouse.lng }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Zones ({linkedZones.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {linkedZones.length > 0 ? (
              <ul className="space-y-2">
                {linkedZones.map((zone) => (
                  <li key={zone.id}>
                    <Link
                      href={`/zones/${zone.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {zone.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No zones linked.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Riders ({linkedRiders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {linkedRiders.length > 0 ? (
              <ul className="space-y-2">
                {linkedRiders.map((rider) => (
                  <li key={rider.id}>
                    <Link
                      href={`/riders/${rider.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {rider.full_name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No riders linked.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
