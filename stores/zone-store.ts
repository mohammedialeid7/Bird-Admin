import { create } from 'zustand';
import type { Zone } from '@/lib/types';
import { mockZones } from '@/lib/mock-data';

interface ZoneState {
  zones: Zone[];
  getZones: () => Zone[];
  getZoneById: (id: string) => Zone | undefined;
  updateZone: (id: string, data: Partial<Zone>) => void;
  deleteZones: (ids: string[]) => void;
  bulkAddWarehouse: (zoneIds: string[], warehouseId: string) => void;
  bulkRemoveWarehouse: (zoneIds: string[], warehouseId: string) => void;
}

export const useZoneStore = create<ZoneState>((set, get) => ({
  zones: mockZones,
  getZones: () => get().zones,
  getZoneById: (id) => get().zones.find((z) => z.id === id),
  updateZone: (id, data) => {
    set((state) => ({
      zones: state.zones.map((z) =>
        z.id === id ? { ...z, ...data } : z
      ),
    }));
  },
  deleteZones: (ids) => {
    const idSet = new Set(ids);
    set((state) => ({
      zones: state.zones.filter((z) => !idSet.has(z.id)),
    }));
  },
  bulkAddWarehouse: (zoneIds, warehouseId) => {
    const idSet = new Set(zoneIds);
    set((state) => ({
      zones: state.zones.map((z) =>
        idSet.has(z.id) && !z.warehouse_ids.includes(warehouseId)
          ? { ...z, warehouse_ids: [...z.warehouse_ids, warehouseId] }
          : z
      ),
    }));
  },
  bulkRemoveWarehouse: (zoneIds, warehouseId) => {
    const idSet = new Set(zoneIds);
    set((state) => ({
      zones: state.zones.map((z) =>
        idSet.has(z.id)
          ? { ...z, warehouse_ids: z.warehouse_ids.filter((id) => id !== warehouseId) }
          : z
      ),
    }));
  },
}));
