'use client';

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useZoneStore } from '@/stores/zone-store';
import { useWarehouseStore } from '@/stores/warehouse-store';
import { useRiderStore } from '@/stores/rider-store';
import { useOrderStore } from '@/stores/order-store';

export default function ZonesPage() {
  const router = useRouter();
  const zones = useZoneStore((s) => s.zones);
  const warehouses = useWarehouseStore((s) => s.warehouses);
  const riderZones = useRiderStore((s) => s.riderZones);
  const orders = useOrderStore((s) => s.orders);

  const getWarehouseName = (id: string) =>
    warehouses.find((w) => w.id === id)?.name ?? '—';

  const getRiderCount = (zoneId: string) =>
    riderZones.filter((rz) => rz.zone_id === zoneId).length;

  const getActiveOrderCount = (zoneId: string) =>
    orders.filter(
      (o) =>
        o.zone_id === zoneId &&
        !['delivered', 'failed', 'returned_to_warehouse', 'cancelled'].includes(o.status)
    ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Zones</h2>
        <p className="text-sm text-muted-foreground">{zones.length} zones</p>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Riders</TableHead>
              <TableHead>Active Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.map((zone) => (
              <TableRow
                key={zone.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/zones/${zone.id}`)}
              >
                <TableCell className="font-medium">{zone.name}</TableCell>
                <TableCell>{getWarehouseName(zone.warehouse_id)}</TableCell>
                <TableCell>{getRiderCount(zone.id)}</TableCell>
                <TableCell>{getActiveOrderCount(zone.id)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
