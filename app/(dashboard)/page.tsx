'use client';

import { useMemo, useState } from 'react';
import { Package, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import { MapView } from '@/components/map/MapView';
import { SummaryCard } from '@/components/shared/SummaryCard';
import { useOrderStore } from '@/stores/order-store';
import { useRiderStore } from '@/stores/rider-store';
import { useZoneStore } from '@/stores/zone-store';
import { useWarehouseStore } from '@/stores/warehouse-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DashboardPage() {
  const orders = useOrderStore((s) => s.orders);
  const riders = useRiderStore((s) => s.riders);
  const riderLocations = useRiderStore((s) => s.riderLocations);
  const zones = useZoneStore((s) => s.zones);
  const warehouses = useWarehouseStore((s) => s.warehouses);

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (selectedWarehouse !== 'all') {
      result = result.filter((o) => o.warehouse_id === selectedWarehouse);
    }
    if (selectedZone !== 'all') {
      result = result.filter((o) => o.zone_id === selectedZone);
    }
    return result;
  }, [orders, selectedWarehouse, selectedZone]);

  const filteredZones = useMemo(() => {
    if (selectedWarehouse !== 'all') {
      return zones.filter((z) => z.warehouse_id === selectedWarehouse);
    }
    return zones;
  }, [zones, selectedWarehouse]);

  const ridersWithLocations = useMemo(() => {
    return riders.map((r) => ({
      ...r,
      location: riderLocations.find((rl) => rl.rider_id === r.id),
    }));
  }, [riders, riderLocations]);

  const totalOrders = filteredOrders.length;
  const deliveredCount = filteredOrders.filter((o) => o.status === 'delivered').length;
  const failedCount = filteredOrders.filter((o) => o.status === 'failed').length;
  const pendingCount = filteredOrders.filter((o) => o.status === 'pending').length;
  const returnCount = filteredOrders.filter((o) => o.type === 'return_pickup').length;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select value={selectedWarehouse} onValueChange={(v) => { setSelectedWarehouse(v); setSelectedZone('all'); }}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="All Warehouses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {warehouses.map((w) => (
              <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedZone} onValueChange={setSelectedZone}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Zones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            {filteredZones.map((z) => (
              <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Map */}
      <div className="h-[60vh] rounded-lg overflow-hidden border">
        <MapView
          orders={filteredOrders}
          riders={ridersWithLocations}
          zones={selectedZone !== 'all' ? zones.filter((z) => z.id === selectedZone) : filteredZones}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard
          title="Total Orders"
          value={totalOrders}
          icon={<Package className="w-5 h-5 text-blue-600" />}
          color="bg-blue-100"
        />
        <SummaryCard
          title="Delivered"
          value={deliveredCount}
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          color="bg-green-100"
        />
        <SummaryCard
          title="Failed"
          value={failedCount}
          icon={<XCircle className="w-5 h-5 text-red-600" />}
          color="bg-red-100"
        />
        <SummaryCard
          title="Pending"
          value={pendingCount}
          icon={<Clock className="w-5 h-5 text-yellow-600" />}
          color="bg-yellow-100"
        />
        <SummaryCard
          title="Return Pickups"
          value={returnCount}
          icon={<RotateCcw className="w-5 h-5 text-orange-600" />}
          color="bg-orange-100"
        />
      </div>
    </div>
  );
}
