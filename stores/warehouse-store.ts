import { create } from 'zustand';
import type { Warehouse } from '@/lib/types';
import { mockWarehouses } from '@/lib/mock-data';

interface WarehouseState {
  warehouses: Warehouse[];
  getWarehouses: () => Warehouse[];
  getWarehouseById: (id: string) => Warehouse | undefined;
  updateWarehouse: (id: string, data: Partial<Warehouse>) => void;
}

export const useWarehouseStore = create<WarehouseState>((set, get) => ({
  warehouses: mockWarehouses,
  getWarehouses: () => get().warehouses,
  getWarehouseById: (id) => get().warehouses.find((w) => w.id === id),
  updateWarehouse: (id, data) => {
    set((state) => ({
      warehouses: state.warehouses.map((w) =>
        w.id === id ? { ...w, ...data } : w
      ),
    }));
  },
}));
