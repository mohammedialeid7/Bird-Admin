'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderTable } from '@/components/orders/OrderTable';
import { MapView } from '@/components/map/MapView';
import { useRiderStore } from '@/stores/rider-store';
import { useOrderStore } from '@/stores/order-store';
import { useZoneStore } from '@/stores/zone-store';
import { toast } from 'sonner';

export default function RiderDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const rider = useRiderStore((s) => s.getRiderById(id));
  const riderZonesAll = useRiderStore((s) => s.riderZones);
  const riderLocation = useRiderStore((s) => s.getRiderLocation(id));
  const addRiderZone = useRiderStore((s) => s.addRiderZone);
  const removeRiderZone = useRiderStore((s) => s.removeRiderZone);
  const orders = useOrderStore((s) => s.orders);
  const zones = useZoneStore((s) => s.zones);

  const [addZoneId, setAddZoneId] = useState('');

  if (!rider) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Rider not found.</p>
        <Button variant="link" onClick={() => router.push('/riders')}>
          Back to Riders
        </Button>
      </div>
    );
  }

  const assignedZoneIds = riderZonesAll
    .filter((rz) => rz.rider_id === rider.id)
    .map((rz) => rz.zone_id);
  const assignedZones = zones.filter((z) => assignedZoneIds.includes(z.id));
  const unassignedZones = zones.filter(
    (z) => !assignedZoneIds.includes(z.id)
  );

  const activeOrders = orders.filter(
    (o) =>
      o.rider_id === rider.id &&
      !['delivered', 'failed', 'returned_to_warehouse', 'cancelled'].includes(o.status)
  );

  const completedToday = orders.filter(
    (o) => o.rider_id === rider.id && o.status === 'delivered'
  ).length;

  const handleAddZone = () => {
    if (!addZoneId) return;
    addRiderZone(rider.id, addZoneId);
    setAddZoneId('');
    toast.success('Zone added');
  };

  const handleRemoveZone = (zoneId: string) => {
    removeRiderZone(rider.id, zoneId);
    toast.success('Zone removed');
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/riders')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Riders
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xl font-semibold">{rider.full_name}</p>
            <p className="text-sm text-muted-foreground">{rider.phone}</p>
            <Badge variant={rider.is_active ? 'default' : 'secondary'}>
              {rider.is_active ? 'Active' : 'Offline'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed today</span>
              <span className="font-medium">{completedToday}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">This week</span>
              <span className="font-medium">{completedToday + 15}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Failure rate</span>
              <span className="font-medium">4.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last Location</CardTitle>
          </CardHeader>
          <CardContent>
            {riderLocation ? (
              <div className="h-[200px] rounded-lg overflow-hidden">
                <MapView
                  center={{ lat: riderLocation.lat, lng: riderLocation.lng }}
                  zoom={14}
                  riders={[{ ...rider, location: riderLocation }]}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No location data.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assigned Zones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {assignedZones.map((zone) => (
              <Badge key={zone.id} variant="outline" className="flex items-center gap-1 pr-1">
                {zone.name}
                <button
                  onClick={() => handleRemoveZone(zone.id)}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {assignedZones.length === 0 && (
              <p className="text-sm text-muted-foreground">No zones assigned.</p>
            )}
          </div>
          {unassignedZones.length > 0 && (
            <div className="flex gap-2">
              <Select value={addZoneId} onValueChange={setAddZoneId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Add zone..." />
                </SelectTrigger>
                <SelectContent>
                  {unassignedZones.map((z) => (
                    <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleAddZone} disabled={!addZoneId}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h3 className="text-base font-semibold mb-3">Current Orders</h3>
        <OrderTable orders={activeOrders} />
      </div>
    </div>
  );
}
