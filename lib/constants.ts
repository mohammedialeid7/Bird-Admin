import type { OrderStatus, OrderType } from './types';

export const RIYADH_CENTER = { lat: 24.7136, lng: 46.6753 };
export const DEFAULT_ZOOM = 11;
export const ITEMS_PER_PAGE = 15;

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  assigned: 'bg-blue-100 text-blue-800 border-blue-300',
  picked_up: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  in_transit: 'bg-purple-100 text-purple-800 border-purple-300',
  delivered: 'bg-green-100 text-green-800 border-green-300',
  failed: 'bg-red-100 text-red-800 border-red-300',
  returning: 'bg-orange-100 text-orange-800 border-orange-300',
  returned_to_warehouse: 'bg-teal-100 text-teal-800 border-teal-300',
  cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  failed: 'Failed',
  returning: 'Returning',
  returned_to_warehouse: 'Returned',
  cancelled: 'Cancelled',
};

export const TYPE_COLORS: Record<OrderType, string> = {
  delivery: 'bg-blue-100 text-blue-800 border-blue-300',
  return_pickup: 'bg-orange-100 text-orange-800 border-orange-300',
  failed_return: 'bg-red-100 text-red-800 border-red-300',
};

export const TYPE_LABELS: Record<OrderType, string> = {
  delivery: 'Delivery',
  return_pickup: 'Return Pickup',
  failed_return: 'Failed Return',
};

export const ALL_STATUSES: OrderStatus[] = [
  'pending', 'assigned', 'picked_up', 'in_transit', 'delivered',
  'failed', 'returning', 'returned_to_warehouse', 'cancelled',
];

export const ALL_TYPES: OrderType[] = ['delivery', 'return_pickup', 'failed_return'];
