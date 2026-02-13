'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RiderTable } from '@/components/riders/RiderTable';
import { useRiderStore } from '@/stores/rider-store';
import { useWarehouseStore } from '@/stores/warehouse-store';
import { useZoneStore } from '@/stores/zone-store';

export default function RidersPage() {
  const riders = useRiderStore((s) => s.riders);
  const riderZones = useRiderStore((s) => s.riderZones);
  const warehouses = useWarehouseStore((s) => s.warehouses);
  const zones = useZoneStore((s) => s.zones);

  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [activeOnly, setActiveOnly] = useState(false);

  const filteredRiders = useMemo(() => {
    let result = riders;
    if (warehouseFilter !== 'all') {
      result = result.filter((r) => r.warehouse_id === warehouseFilter);
    }
    if (zoneFilter !== 'all') {
      const riderIdsInZone = riderZones
        .filter((rz) => rz.zone_id === zoneFilter)
        .map((rz) => rz.rider_id);
      result = result.filter((r) => riderIdsInZone.includes(r.id));
    }
    if (activeOnly) {
      result = result.filter((r) => r.is_active);
    }
    return result;
  }, [riders, riderZones, warehouseFilter, zoneFilter, activeOnly]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Riders</h2>
        <p className="text-sm text-muted-foreground">
          {filteredRiders.length} rider{filteredRiders.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Warehouses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {warehouses.map((w) => (
              <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={zoneFilter} onValueChange={setZoneFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Zones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            {zones.map((z) => (
              <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Switch id="active-only" checked={activeOnly} onCheckedChange={setActiveOnly} />
          <Label htmlFor="active-only" className="text-sm">Active only</Label>
        </div>
      </div>

      <RiderTable riders={filteredRiders} />
    </div>
  );
}
