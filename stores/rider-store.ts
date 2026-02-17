import { create } from 'zustand';
import type { User, RiderZone, RiderLocation, RiderFilters } from '@/lib/types';
import { mockRiders, mockRiderZones, mockRiderLocations } from '@/lib/mock-data';

interface RiderState {
  riders: User[];
  riderZones: RiderZone[];
  riderLocations: RiderLocation[];
  getRiders: (filters?: RiderFilters) => User[];
  getRiderById: (id: string) => User | undefined;
  getRiderZones: (riderId: string) => RiderZone[];
  getRiderLocation: (riderId: string) => RiderLocation | undefined;
  addRiderZone: (riderId: string, zoneId: string) => void;
  removeRiderZone: (riderId: string, zoneId: string) => void;
  bulkAddRiderToZones: (riderId: string, zoneIds: string[]) => void;
  bulkRemoveRiderFromZones: (riderId: string, zoneIds: string[]) => void;
}

export const useRiderStore = create<RiderState>((set, get) => ({
  riders: mockRiders,
  riderZones: mockRiderZones,
  riderLocations: mockRiderLocations,

  getRiders: (filters) => {
    let result = get().riders;
    if (filters?.zoneId) {
      const riderIdsInZone = get()
        .riderZones.filter((rz) => rz.zone_id === filters.zoneId)
        .map((rz) => rz.rider_id);
      result = result.filter((r) => riderIdsInZone.includes(r.id));
    }
    if (filters?.activeOnly) {
      result = result.filter((r) => r.is_active);
    }
    return result;
  },

  getRiderById: (id) => get().riders.find((r) => r.id === id),

  getRiderZones: (riderId) =>
    get().riderZones.filter((rz) => rz.rider_id === riderId),

  getRiderLocation: (riderId) =>
    get().riderLocations.find((rl) => rl.rider_id === riderId),

  addRiderZone: (riderId, zoneId) => {
    const exists = get().riderZones.some(
      (rz) => rz.rider_id === riderId && rz.zone_id === zoneId
    );
    if (exists) return;
    set((state) => ({
      riderZones: [
        ...state.riderZones,
        {
          id: `rz-${Date.now()}`,
          rider_id: riderId,
          zone_id: zoneId,
        },
      ],
    }));
  },

  removeRiderZone: (riderId, zoneId) => {
    set((state) => ({
      riderZones: state.riderZones.filter(
        (rz) => !(rz.rider_id === riderId && rz.zone_id === zoneId)
      ),
    }));
  },
  bulkAddRiderToZones: (riderId, zoneIds) => {
    set((state) => {
      const existing = new Set(
        state.riderZones
          .filter((rz) => rz.rider_id === riderId)
          .map((rz) => rz.zone_id)
      );
      const newEntries = zoneIds
        .filter((zId) => !existing.has(zId))
        .map((zId) => ({
          id: `rz-${Date.now()}-${zId}`,
          rider_id: riderId,
          zone_id: zId,
        }));
      return { riderZones: [...state.riderZones, ...newEntries] };
    });
  },
  bulkRemoveRiderFromZones: (riderId, zoneIds) => {
    const zoneIdSet = new Set(zoneIds);
    set((state) => ({
      riderZones: state.riderZones.filter(
        (rz) => !(rz.rider_id === riderId && zoneIdSet.has(rz.zone_id))
      ),
    }));
  },
}));
