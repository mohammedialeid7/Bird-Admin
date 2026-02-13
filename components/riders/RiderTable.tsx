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
import { useWarehouseStore } from '@/stores/warehouse-store';
import { useZoneStore } from '@/stores/zone-store';
import { useRiderStore } from '@/stores/rider-store';
import { useOrderStore } from '@/stores/order-store';
import type { User } from '@/lib/types';

export function RiderTable({ riders }: { riders: User[] }) {
  const router = useRouter();
  const warehouses = useWarehouseStore((s) => s.warehouses);
  const zones = useZoneStore((s) => s.zones);
  const riderZones = useRiderStore((s) => s.riderZones);
  const orders = useOrderStore((s) => s.orders);

  const getWarehouseName = (id: string | null) =>
    id ? (warehouses.find((w) => w.id === id)?.name ?? '—') : '—';

  const getZoneNames = (riderId: string) => {
    const zoneIds = riderZones
      .filter((rz) => rz.rider_id === riderId)
      .map((rz) => rz.zone_id);
    return zoneIds
      .map((zid) => zones.find((z) => z.id === zid)?.name ?? zid)
      .join(', ') || '—';
  };

  const getActiveOrderCount = (riderId: string) =>
    orders.filter(
      (o) =>
        o.rider_id === riderId &&
        !['delivered', 'failed', 'returned_to_warehouse', 'cancelled'].includes(o.status)
    ).length;

  if (riders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No riders found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="hidden md:table-cell">Warehouse</TableHead>
            <TableHead className="hidden lg:table-cell">Zones</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Active Orders</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {riders.map((rider) => (
            <TableRow
              key={rider.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/riders/${rider.id}`)}
            >
              <TableCell className="font-medium">{rider.full_name}</TableCell>
              <TableCell className="text-sm">{rider.phone}</TableCell>
              <TableCell className="hidden md:table-cell text-sm">
                {getWarehouseName(rider.warehouse_id)}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm max-w-[200px] truncate">
                {getZoneNames(rider.id)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      rider.is_active ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                  <span className="text-sm">
                    {rider.is_active ? 'Active' : 'Offline'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {getActiveOrderCount(rider.id)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
