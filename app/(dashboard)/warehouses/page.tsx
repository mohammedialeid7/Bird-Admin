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

export default function WarehousesPage() {
  const router = useRouter();
  const warehouses = useWarehouseStore((s) => s.warehouses);
  const zones = useZoneStore((s) => s.zones);
  const riders = useRiderStore((s) => s.riders);

  const getZoneCount = (whId: string) =>
    zones.filter((z) => z.warehouse_ids.includes(whId)).length;

  const getRiderCount = (whId: string) =>
    riders.filter((r) => r.warehouse_id === whId).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Warehouses</h2>
        <p className="text-sm text-muted-foreground">{warehouses.length} warehouses</p>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="hidden md:table-cell">Lat/Lng</TableHead>
              <TableHead>Zones</TableHead>
              <TableHead>Riders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.map((wh) => (
              <TableRow
                key={wh.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/warehouses/${wh.id}`)}
              >
                <TableCell className="font-medium">{wh.name}</TableCell>
                <TableCell className="font-mono text-xs">{wh.short_national_address}</TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                  {wh.lat.toFixed(4)}, {wh.lng.toFixed(4)}
                </TableCell>
                <TableCell>{getZoneCount(wh.id)}</TableCell>
                <TableCell>{getRiderCount(wh.id)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
