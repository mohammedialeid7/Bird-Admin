export type OrderType = 'delivery' | 'return_pickup' | 'failed_return';
export type OrderStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'returning' | 'returned_to_warehouse' | 'cancelled';
export type ProofType = 'delivery_pod' | 'return_pod' | 'failed_pod';

export interface Warehouse {
  id: string;
  name: string;
  short_national_address: string;
  lat: number;
  lng: number;
  created_at: string;
}

export interface Zone {
  id: string;
  name: string;
  warehouse_ids: string[];
  polygon: GeoJSON.Polygon;
  created_at: string;
}

export interface User {
  id: string;
  full_name: string;
  role: 'admin' | 'rider';
  phone: string;
  is_active: boolean;
  created_at: string;
}

export interface RiderZone {
  id: string;
  rider_id: string;
  zone_id: string;
}

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  warehouse_id: string;
  zone_id: string;
  rider_id: string | null;
  customer_name: string;
  customer_phone: string;
  short_national_address: string;
  lat: number;
  lng: number;
  pod_required: boolean;
  notes: string | null;
  parent_order_id: string | null;
  source_ref: string | null;
  auto_assigned: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusLog {
  id: string;
  order_id: string;
  status: string;
  note: string | null;
  changed_by: string;
  created_at: string;
}

export interface Proof {
  id: string;
  order_id: string;
  type: ProofType;
  photo_url: string;
  signature_url: string | null;
  failure_reason: string | null;
  item_condition_note: string | null;
  submitted_by: string;
  created_at: string;
}

export interface RiderLocation {
  id: string;
  rider_id: string;
  lat: number;
  lng: number;
  updated_at: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  type?: OrderType[];
  zoneId?: string;
  warehouseId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface RiderFilters {
  zoneId?: string;
  activeOnly?: boolean;
}
