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
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useZoneStore } from '@/stores/zone-store';
import { useWarehouseStore } from '@/stores/warehouse-store';
import { useRiderStore } from '@/stores/rider-store';
import { useOrderStore } from '@/stores/order-store';
import { Trash2, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ZonesPage() {
  const router = useRouter();
  const zones = useZoneStore((s) => s.zones);
  const deleteZones = useZoneStore((s) => s.deleteZones);
  const bulkAddWarehouse = useZoneStore((s) => s.bulkAddWarehouse);
  const bulkRemoveWarehouse = useZoneStore((s) => s.bulkRemoveWarehouse);
  const warehouses = useWarehouseStore((s) => s.warehouses);
  const riders = useRiderStore((s) => s.riders);
  const riderZones = useRiderStore((s) => s.riderZones);
  const bulkAddRiderToZones = useRiderStore((s) => s.bulkAddRiderToZones);
  const bulkRemoveRiderFromZones = useRiderStore((s) => s.bulkRemoveRiderFromZones);
  const orders = useOrderStore((s) => s.orders);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const allSelected = zones.length > 0 && selectedIds.size === zones.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < zones.length;

  const selectedZoneIds = Array.from(selectedIds);

  // Warehouses common to ALL selected zones
  const commonWarehouseIds = selectedZoneIds.length > 0
    ? zones
        .filter((z) => selectedIds.has(z.id))
        .reduce<string[]>((acc, zone, i) => {
          if (i === 0) return [...zone.warehouse_ids];
          return acc.filter((wId) => zone.warehouse_ids.includes(wId));
        }, [])
    : [];

  // Riders assigned to ALL selected zones
  const commonRiderIds = selectedZoneIds.length > 0
    ? riders.filter((r) =>
        selectedZoneIds.every((zId) =>
          riderZones.some((rz) => rz.rider_id === r.id && rz.zone_id === zId)
        )
      ).map((r) => r.id)
    : [];

  // Warehouses not yet assigned to ALL selected zones (available to add)
  const addableWarehouses = warehouses.filter((w) => !commonWarehouseIds.includes(w.id));

  // Riders not yet assigned to ALL selected zones (available to add)
  const addableRiders = riders.filter((r) => !commonRiderIds.includes(r.id));

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
    deleteZones(selectedZoneIds);
    setSelectedIds(new Set());
    setShowDeleteDialog(false);
  };

  const handleAddWarehouse = (warehouseId: string) => {
    bulkAddWarehouse(selectedZoneIds, warehouseId);
    toast.success(`Warehouse added to ${selectedIds.size} zone${selectedIds.size > 1 ? 's' : ''}`);
  };

  const handleRemoveWarehouse = (warehouseId: string) => {
    bulkRemoveWarehouse(selectedZoneIds, warehouseId);
    toast.success(`Warehouse removed from ${selectedIds.size} zone${selectedIds.size > 1 ? 's' : ''}`);
  };

  const handleAddRider = (riderId: string) => {
    bulkAddRiderToZones(riderId, selectedZoneIds);
    toast.success(`Rider added to ${selectedIds.size} zone${selectedIds.size > 1 ? 's' : ''}`);
  };

  const handleRemoveRider = (riderId: string) => {
    bulkRemoveRiderFromZones(riderId, selectedZoneIds);
    toast.success(`Rider removed from ${selectedIds.size} zone${selectedIds.size > 1 ? 's' : ''}`);
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
            >
              <Pencil className="size-4" />
              Edit {selectedIds.size} zone{selectedIds.size > 1 ? 's' : ''}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="size-4" />
              Delete {selectedIds.size} zone{selectedIds.size > 1 ? 's' : ''}
            </Button>
          </div>
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

      {/* Bulk Delete Dialog */}
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

      {/* Bulk Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {selectedIds.size} zone{selectedIds.size > 1 ? 's' : ''}</DialogTitle>
            <DialogDescription>
              Manage warehouses and riders for the selected zones. Changes shown here apply to all selected zones at once.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Warehouses Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Warehouses</h4>
              <p className="text-xs text-muted-foreground">Warehouses assigned to all {selectedIds.size} selected zone{selectedIds.size > 1 ? 's' : ''}:</p>
              <div className="flex flex-wrap gap-2">
                {commonWarehouseIds.length > 0 ? (
                  commonWarehouseIds.map((wId) => {
                    const w = warehouses.find((wh) => wh.id === wId);
                    return (
                      <Badge key={wId} variant="outline" className="flex items-center gap-1">
                        {w?.name ?? wId}
                        <button
                          onClick={() => handleRemoveWarehouse(wId)}
                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground italic">No warehouses common to all selected zones.</p>
                )}
              </div>
              {addableWarehouses.length > 0 && (
                <Select
                  key={`wh-${commonWarehouseIds.join(',')}`}
                  onValueChange={handleAddWarehouse}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add warehouse to all selected zones..." />
                  </SelectTrigger>
                  <SelectContent>
                    {addableWarehouses.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Riders Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Riders</h4>
              <p className="text-xs text-muted-foreground">Riders assigned to all {selectedIds.size} selected zone{selectedIds.size > 1 ? 's' : ''}:</p>
              <div className="flex flex-wrap gap-2">
                {commonRiderIds.length > 0 ? (
                  commonRiderIds.map((rId) => {
                    const r = riders.find((rider) => rider.id === rId);
                    return (
                      <Badge key={rId} variant="outline" className="flex items-center gap-1 pr-1">
                        {r?.full_name ?? rId}
                        <button
                          onClick={() => handleRemoveRider(rId)}
                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground italic">No riders common to all selected zones.</p>
                )}
              </div>
              {addableRiders.length > 0 && (
                <Select
                  key={`rd-${commonRiderIds.join(',')}`}
                  onValueChange={handleAddRider}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add rider to all selected zones..." />
                  </SelectTrigger>
                  <SelectContent>
                    {addableRiders.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
