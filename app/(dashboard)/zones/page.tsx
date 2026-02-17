'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useZoneStore } from '@/stores/zone-store';
import { useWarehouseStore } from '@/stores/warehouse-store';
import { useRiderStore } from '@/stores/rider-store';
import { useOrderStore } from '@/stores/order-store';
import { Trash2 } from 'lucide-react';

export default function ZonesPage() {
  const router = useRouter();
  const zones = useZoneStore((s) => s.zones);
  const deleteZones = useZoneStore((s) => s.deleteZones);
  const warehouses = useWarehouseStore((s) => s.warehouses);
  const riderZones = useRiderStore((s) => s.riderZones);
  const orders = useOrderStore((s) => s.orders);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const allSelected = zones.length > 0 && selectedIds.size === zones.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < zones.length;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(zones.map((z) => z.id)));
    }
  };

  const handleDelete = () => {
    deleteZones(Array.from(selectedIds));
    setSelectedIds(new Set());
    setShowDeleteDialog(false);
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Zones</h2>
          <p className="text-sm text-muted-foreground">{zones.length} zones</p>
        </div>
        {selectedIds.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="size-4" />
            Delete {selectedIds.size} zone{selectedIds.size > 1 ? 's' : ''}
          </Button>
        )}
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleSelectAll}
                  className="size-4 rounded border-input accent-primary cursor-pointer"
                />
              </TableHead>
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
                data-selected={selectedIds.has(zone.id) || undefined}
              >
                <TableCell
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(zone.id)}
                    onChange={() => toggleSelect(zone.id)}
                    className="size-4 rounded border-input accent-primary cursor-pointer"
                  />
                </TableCell>
                <TableCell
                  className="font-medium"
                  onClick={() => router.push(`/zones/${zone.id}`)}
                >
                  {zone.name}
                </TableCell>
                <TableCell onClick={() => router.push(`/zones/${zone.id}`)}>
                  {zone.warehouse_ids
                    .map((id) => warehouses.find((w) => w.id === id)?.name)
                    .filter(Boolean)
                    .join(', ') || '—'}
                </TableCell>
                <TableCell onClick={() => router.push(`/zones/${zone.id}`)}>
                  {getRiderCount(zone.id)}
                </TableCell>
                <TableCell onClick={() => router.push(`/zones/${zone.id}`)}>
                  {getActiveOrderCount(zone.id)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} zone{selectedIds.size > 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected zone{selectedIds.size > 1 ? 's' : ''} and {selectedIds.size > 1 ? 'their' : 'its'} associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
