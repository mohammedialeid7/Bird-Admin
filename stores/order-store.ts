import { create } from 'zustand';
import type { Order, OrderStatusLog, Proof, OrderFilters } from '@/lib/types';
import { mockOrders, mockStatusLogs, mockProofs } from '@/lib/mock-data';

interface OrderState {
  orders: Order[];
  statusLogs: OrderStatusLog[];
  proofs: Proof[];
  getOrders: (filters?: OrderFilters) => Order[];
  getOrderById: (id: string) => Order | undefined;
  getOrderLogs: (orderId: string) => OrderStatusLog[];
  getOrderProof: (orderId: string) => Proof | undefined;
  createOrder: (data: Omit<Order, 'id' | 'status' | 'created_at' | 'updated_at'>) => Order;
  updateOrder: (id: string, changes: Partial<Order>) => void;
  cancelOrder: (id: string) => void;
  reassignOrder: (orderId: string, riderId: string) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: mockOrders,
  statusLogs: mockStatusLogs,
  proofs: mockProofs,

  getOrders: (filters) => {
    let result = get().orders;
    if (filters?.status && filters.status.length > 0) {
      result = result.filter((o) => filters.status!.includes(o.status));
    }
    if (filters?.type && filters.type.length > 0) {
      result = result.filter((o) => filters.type!.includes(o.type));
    }
    if (filters?.zoneId) {
      result = result.filter((o) => o.zone_id === filters.zoneId);
    }
    if (filters?.warehouseId) {
      result = result.filter((o) => o.warehouse_id === filters.warehouseId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.includes(q) ||
          o.short_national_address.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
      );
    }
    if (filters?.dateFrom) {
      result = result.filter((o) => o.created_at >= filters.dateFrom!);
    }
    if (filters?.dateTo) {
      const toDate = filters.dateTo + 'T23:59:59Z';
      result = result.filter((o) => o.created_at <= toDate);
    }
    return result;
  },

  getOrderById: (id) => get().orders.find((o) => o.id === id),

  getOrderLogs: (orderId) =>
    get()
      .statusLogs.filter((l) => l.order_id === orderId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),

  getOrderProof: (orderId) =>
    get().proofs.find((p) => p.order_id === orderId),

  createOrder: (data) => {
    const now = new Date().toISOString();
    const order: Order = {
      ...data,
      id: `ord-${Date.now()}`,
      status: 'pending',
      created_at: now,
      updated_at: now,
    };
    const log: OrderStatusLog = {
      id: `log-${Date.now()}`,
      order_id: order.id,
      status: 'pending',
      note: 'Order created manually',
      changed_by: 'admin-001',
      created_at: now,
    };
    set((state) => ({
      orders: [order, ...state.orders],
      statusLogs: [...state.statusLogs, log],
    }));
    return order;
  },

  updateOrder: (id, changes) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, ...changes, updated_at: new Date().toISOString() } : o
      ),
    }));
  },

  cancelOrder: (id) => {
    const now = new Date().toISOString();
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status: 'cancelled' as const, updated_at: now } : o
      ),
      statusLogs: [
        ...state.statusLogs,
        {
          id: `log-cancel-${Date.now()}`,
          order_id: id,
          status: 'cancelled',
          note: 'Order cancelled by admin',
          changed_by: 'admin-001',
          created_at: now,
        },
      ],
    }));
  },

  reassignOrder: (orderId, riderId) => {
    const now = new Date().toISOString();
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, rider_id: riderId, status: 'assigned' as const, auto_assigned: false, updated_at: now }
          : o
      ),
      statusLogs: [
        ...state.statusLogs,
        {
          id: `log-reassign-${Date.now()}`,
          order_id: orderId,
          status: 'assigned',
          note: `Reassigned to rider by admin`,
          changed_by: 'admin-001',
          created_at: now,
        },
      ],
    }));
  },
}));
