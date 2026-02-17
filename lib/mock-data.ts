import type {
  Warehouse, Zone, User, RiderZone, Order, OrderStatusLog,
  Proof, RiderLocation,
} from './types';

// ── Admin User ──────────────────────────────────────────────────
export const mockAdminUser: User = {
  id: 'admin-001',
  full_name: 'Admin User',
  role: 'admin',
  phone: '+966500000000',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
};

// ── Warehouses ──────────────────────────────────────────────────
export const mockWarehouses: Warehouse[] = [
  {
    id: 'wh-001',
    name: 'North Riyadh Warehouse',
    short_national_address: 'RVFA8376',
    lat: 24.8000,
    lng: 46.6500,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'wh-002',
    name: 'Central Riyadh Warehouse',
    short_national_address: 'BCNR2194',
    lat: 24.6900,
    lng: 46.6900,
    created_at: '2024-01-05T00:00:00Z',
  },
  {
    id: 'wh-003',
    name: 'South Riyadh Warehouse',
    short_national_address: 'DKML5018',
    lat: 24.6200,
    lng: 46.7200,
    created_at: '2024-01-10T00:00:00Z',
  },
];

// ── Zones ───────────────────────────────────────────────────────
export const mockZones: Zone[] = [
  {
    id: 'zone-001',
    name: 'Al Olaya Zone',
    warehouse_ids: ['wh-001'],
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [46.66, 24.81], [46.70, 24.81], [46.70, 24.77],
        [46.66, 24.77], [46.66, 24.81],
      ]],
    },
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'zone-002',
    name: 'Al Malaz Zone',
    warehouse_ids: ['wh-001'],
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [46.72, 24.81], [46.76, 24.81], [46.76, 24.77],
        [46.72, 24.77], [46.72, 24.81],
      ]],
    },
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'zone-003',
    name: 'Al Muruj Zone',
    warehouse_ids: ['wh-002'],
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [46.66, 24.72], [46.70, 24.72], [46.70, 24.68],
        [46.66, 24.68], [46.66, 24.72],
      ]],
    },
    created_at: '2024-01-06T00:00:00Z',
  },
  {
    id: 'zone-004',
    name: 'Al Rawdah Zone',
    warehouse_ids: ['wh-002'],
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [46.72, 24.72], [46.76, 24.72], [46.76, 24.68],
        [46.72, 24.68], [46.72, 24.72],
      ]],
    },
    created_at: '2024-01-06T00:00:00Z',
  },
  {
    id: 'zone-005',
    name: 'Al Aziziyah Zone',
    warehouse_ids: ['wh-003'],
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [46.68, 24.65], [46.72, 24.65], [46.72, 24.61],
        [46.68, 24.61], [46.68, 24.65],
      ]],
    },
    created_at: '2024-01-11T00:00:00Z',
  },
  {
    id: 'zone-006',
    name: 'Al Shifa Zone',
    warehouse_ids: ['wh-003'],
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [46.74, 24.65], [46.78, 24.65], [46.78, 24.61],
        [46.74, 24.61], [46.74, 24.65],
      ]],
    },
    created_at: '2024-01-11T00:00:00Z',
  },
];

// ── Riders ──────────────────────────────────────────────────────
export const mockRiders: User[] = [
  { id: 'rider-001', full_name: 'Ahmed Al-Rashidi', role: 'rider', phone: '+966501111111', is_active: true, created_at: '2024-02-01T00:00:00Z' },
  { id: 'rider-002', full_name: 'Mohammed Al-Ghamdi', role: 'rider', phone: '+966502222222', is_active: true, created_at: '2024-02-01T00:00:00Z' },
  { id: 'rider-003', full_name: 'Khalid Al-Otaibi', role: 'rider', phone: '+966503333333', is_active: true, created_at: '2024-02-05T00:00:00Z' },
  { id: 'rider-004', full_name: 'Faisal Al-Harbi', role: 'rider', phone: '+966504444444', is_active: true, created_at: '2024-02-05T00:00:00Z' },
  { id: 'rider-005', full_name: 'Sultan Al-Zahrani', role: 'rider', phone: '+966505555555', is_active: true, created_at: '2024-02-10T00:00:00Z' },
  { id: 'rider-006', full_name: 'Nasser Al-Dossari', role: 'rider', phone: '+966506666666', is_active: false, created_at: '2024-02-10T00:00:00Z' },
  { id: 'rider-007', full_name: 'Omar Al-Shehri', role: 'rider', phone: '+966507777777', is_active: false, created_at: '2024-02-15T00:00:00Z' },
  { id: 'rider-008', full_name: 'Turki Al-Mutairi', role: 'rider', phone: '+966508888888', is_active: false, created_at: '2024-02-15T00:00:00Z' },
];

// ── Rider Zones ─────────────────────────────────────────────────
export const mockRiderZones: RiderZone[] = [
  { id: 'rz-001', rider_id: 'rider-001', zone_id: 'zone-001' },
  { id: 'rz-002', rider_id: 'rider-001', zone_id: 'zone-002' },
  { id: 'rz-003', rider_id: 'rider-002', zone_id: 'zone-002' },
  { id: 'rz-004', rider_id: 'rider-003', zone_id: 'zone-003' },
  { id: 'rz-005', rider_id: 'rider-004', zone_id: 'zone-004' },
  { id: 'rz-006', rider_id: 'rider-004', zone_id: 'zone-003' },
  { id: 'rz-007', rider_id: 'rider-005', zone_id: 'zone-005' },
  { id: 'rz-008', rider_id: 'rider-005', zone_id: 'zone-006' },
  { id: 'rz-009', rider_id: 'rider-006', zone_id: 'zone-001' },
  { id: 'rz-010', rider_id: 'rider-007', zone_id: 'zone-003' },
  { id: 'rz-011', rider_id: 'rider-008', zone_id: 'zone-005' },
];

// ── Orders ──────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];

export const mockOrders: Order[] = [
  // Deliveries — various statuses
  { id: 'ord-001', type: 'delivery', status: 'delivered', warehouse_id: 'wh-001', zone_id: 'zone-001', rider_id: 'rider-001', customer_name: 'Sara Al-Faisal', customer_phone: '+966551000001', short_national_address: 'ABCD1234', lat: 24.7950, lng: 46.6750, pod_required: true, notes: null, parent_order_id: null, source_ref: 'REF-3PL-001', auto_assigned: true, created_at: `${today}T08:00:00Z`, updated_at: `${today}T10:30:00Z` },
  { id: 'ord-002', type: 'delivery', status: 'delivered', warehouse_id: 'wh-001', zone_id: 'zone-001', rider_id: 'rider-001', customer_name: 'Layla Al-Qahtani', customer_phone: '+966551000002', short_national_address: 'EFGH5678', lat: 24.7900, lng: 46.6800, pod_required: true, notes: 'Ring doorbell twice', parent_order_id: null, source_ref: 'REF-3PL-002', auto_assigned: true, created_at: `${today}T08:15:00Z`, updated_at: `${today}T11:00:00Z` },
  { id: 'ord-003', type: 'delivery', status: 'in_transit', warehouse_id: 'wh-001', zone_id: 'zone-002', rider_id: 'rider-002', customer_name: 'Huda Al-Saud', customer_phone: '+966551000003', short_national_address: 'IJKL9012', lat: 24.7880, lng: 46.7400, pod_required: false, notes: null, parent_order_id: null, source_ref: 'REF-3PL-003', auto_assigned: true, created_at: `${today}T08:30:00Z`, updated_at: `${today}T10:00:00Z` },
  { id: 'ord-004', type: 'delivery', status: 'picked_up', warehouse_id: 'wh-001', zone_id: 'zone-002', rider_id: 'rider-002', customer_name: 'Noura Al-Rashid', customer_phone: '+966551000004', short_national_address: 'MNOP3456', lat: 24.7920, lng: 46.7350, pod_required: true, notes: 'Fragile items', parent_order_id: null, source_ref: 'REF-3PL-004', auto_assigned: false, created_at: `${today}T08:45:00Z`, updated_at: `${today}T09:30:00Z` },
  { id: 'ord-005', type: 'delivery', status: 'assigned', warehouse_id: 'wh-002', zone_id: 'zone-003', rider_id: 'rider-003', customer_name: 'Reem Al-Dosari', customer_phone: '+966551000005', short_national_address: 'QRST7890', lat: 24.7100, lng: 46.6800, pod_required: false, notes: null, parent_order_id: null, source_ref: 'REF-3PL-005', auto_assigned: true, created_at: `${today}T09:00:00Z`, updated_at: `${today}T09:15:00Z` },
  { id: 'ord-006', type: 'delivery', status: 'pending', warehouse_id: 'wh-002', zone_id: 'zone-003', rider_id: null, customer_name: 'Maha Al-Tamimi', customer_phone: '+966551000006', short_national_address: 'UVWX1234', lat: 24.7050, lng: 46.6850, pod_required: true, notes: 'Call before delivery', parent_order_id: null, source_ref: 'REF-3PL-006', auto_assigned: false, created_at: `${today}T09:15:00Z`, updated_at: `${today}T09:15:00Z` },
  { id: 'ord-007', type: 'delivery', status: 'pending', warehouse_id: 'wh-002', zone_id: 'zone-004', rider_id: null, customer_name: 'Amal Al-Khaldi', customer_phone: '+966551000007', short_national_address: 'YZAB5678', lat: 24.7050, lng: 46.7400, pod_required: false, notes: null, parent_order_id: null, source_ref: 'REF-3PL-007', auto_assigned: false, created_at: `${today}T09:30:00Z`, updated_at: `${today}T09:30:00Z` },
  { id: 'ord-008', type: 'delivery', status: 'in_transit', warehouse_id: 'wh-002', zone_id: 'zone-004', rider_id: 'rider-004', customer_name: 'Fatimah Al-Juhani', customer_phone: '+966551000008', short_national_address: 'CDEF9012', lat: 24.7100, lng: 46.7350, pod_required: true, notes: null, parent_order_id: null, source_ref: 'REF-3PL-008', auto_assigned: true, created_at: `${today}T09:00:00Z`, updated_at: `${today}T10:45:00Z` },
  { id: 'ord-009', type: 'delivery', status: 'delivered', warehouse_id: 'wh-003', zone_id: 'zone-005', rider_id: 'rider-005', customer_name: 'Nada Al-Shamrani', customer_phone: '+966551000009', short_national_address: 'GHIJ3456', lat: 24.6350, lng: 46.7000, pod_required: true, notes: null, parent_order_id: null, source_ref: 'REF-3PL-009', auto_assigned: true, created_at: `${today}T07:30:00Z`, updated_at: `${today}T09:00:00Z` },
  { id: 'ord-010', type: 'delivery', status: 'delivered', warehouse_id: 'wh-003', zone_id: 'zone-005', rider_id: 'rider-005', customer_name: 'Dalal Al-Enezi', customer_phone: '+966551000010', short_national_address: 'KLMN7890', lat: 24.6400, lng: 46.7050, pod_required: false, notes: null, parent_order_id: null, source_ref: 'REF-3PL-010', auto_assigned: true, created_at: `${today}T07:45:00Z`, updated_at: `${today}T09:30:00Z` },
  // Failed delivery
  { id: 'ord-011', type: 'delivery', status: 'failed', warehouse_id: 'wh-001', zone_id: 'zone-001', rider_id: 'rider-001', customer_name: 'Lina Al-Harbi', customer_phone: '+966551000011', short_national_address: 'OPQR1234', lat: 24.7980, lng: 46.6700, pod_required: true, notes: 'Customer not reachable', parent_order_id: null, source_ref: 'REF-3PL-011', auto_assigned: true, created_at: `${today}T08:00:00Z`, updated_at: `${today}T11:30:00Z` },
  // Failed return (child of ord-011)
  { id: 'ord-012', type: 'failed_return', status: 'returning', warehouse_id: 'wh-001', zone_id: 'zone-001', rider_id: 'rider-001', customer_name: 'Lina Al-Harbi', customer_phone: '+966551000011', short_national_address: 'OPQR1234', lat: 24.7980, lng: 46.6700, pod_required: true, notes: 'Return to warehouse', parent_order_id: 'ord-011', source_ref: 'REF-3PL-011-R', auto_assigned: true, created_at: `${today}T11:35:00Z`, updated_at: `${today}T11:45:00Z` },
  // Return pickups
  { id: 'ord-013', type: 'return_pickup', status: 'assigned', warehouse_id: 'wh-002', zone_id: 'zone-003', rider_id: 'rider-003', customer_name: 'Asma Al-Otaibi', customer_phone: '+966551000013', short_national_address: 'STUV5678', lat: 24.7080, lng: 46.6750, pod_required: true, notes: 'Customer requested return', parent_order_id: null, source_ref: 'REF-3PL-013', auto_assigned: false, created_at: `${today}T09:00:00Z`, updated_at: `${today}T09:20:00Z` },
  { id: 'ord-014', type: 'return_pickup', status: 'picked_up', warehouse_id: 'wh-002', zone_id: 'zone-004', rider_id: 'rider-004', customer_name: 'Wafa Al-Zahrani', customer_phone: '+966551000014', short_national_address: 'WXYZ9012', lat: 24.7000, lng: 46.7300, pod_required: true, notes: null, parent_order_id: null, source_ref: 'REF-3PL-014', auto_assigned: true, created_at: `${today}T08:30:00Z`, updated_at: `${today}T10:00:00Z` },
  { id: 'ord-015', type: 'return_pickup', status: 'returned_to_warehouse', warehouse_id: 'wh-003', zone_id: 'zone-006', rider_id: 'rider-005', customer_name: 'Mona Al-Malki', customer_phone: '+966551000015', short_national_address: 'ABEF3456', lat: 24.6300, lng: 46.7600, pod_required: true, notes: null, parent_order_id: null, source_ref: 'REF-3PL-015', auto_assigned: true, created_at: `${today}T07:00:00Z`, updated_at: `${today}T10:30:00Z` },
  // More deliveries
  { id: 'ord-016', type: 'delivery', status: 'in_transit', warehouse_id: 'wh-003', zone_id: 'zone-006', rider_id: 'rider-005', customer_name: 'Badriah Al-Subaie', customer_phone: '+966551000016', short_national_address: 'CDGH7890', lat: 24.6350, lng: 46.7550, pod_required: false, notes: null, parent_order_id: null, source_ref: 'REF-3PL-016', auto_assigned: true, created_at: `${today}T09:30:00Z`, updated_at: `${today}T11:00:00Z` },
  { id: 'ord-017', type: 'delivery', status: 'assigned', warehouse_id: 'wh-001', zone_id: 'zone-001', rider_id: 'rider-001', customer_name: 'Jamilah Al-Anazi', customer_phone: '+966551000017', short_national_address: 'EFIJ1234', lat: 24.7940, lng: 46.6680, pod_required: true, notes: null, parent_order_id: null, source_ref: 'REF-3PL-017', auto_assigned: true, created_at: `${today}T10:00:00Z`, updated_at: `${today}T10:10:00Z` },
  { id: 'ord-018', type: 'delivery', status: 'pending', warehouse_id: 'wh-001', zone_id: 'zone-002', rider_id: null, customer_name: 'Yara Al-Ghamdi', customer_phone: '+966551000018', short_national_address: 'GHKL5678', lat: 24.7860, lng: 46.7450, pod_required: false, notes: null, parent_order_id: null, source_ref: 'REF-3PL-018', auto_assigned: false, created_at: `${today}T10:15:00Z`, updated_at: `${today}T10:15:00Z` },
  { id: 'ord-019', type: 'delivery', status: 'cancelled', warehouse_id: 'wh-002', zone_id: 'zone-004', rider_id: null, customer_name: 'Dina Al-Qahtani', customer_phone: '+966551000019', short_national_address: 'IJMN9012', lat: 24.7080, lng: 46.7380, pod_required: false, notes: 'Customer cancelled', parent_order_id: null, source_ref: 'REF-3PL-019', auto_assigned: false, created_at: `${today}T08:00:00Z`, updated_at: `${today}T08:30:00Z` },
  { id: 'ord-020', type: 'delivery', status: 'delivered', warehouse_id: 'wh-001', zone_id: 'zone-002', rider_id: 'rider-002', customer_name: 'Salwa Al-Mutlaq', customer_phone: '+966551000020', short_national_address: 'KLOP3456', lat: 24.7850, lng: 46.7380, pod_required: true, notes: null, parent_order_id: null, source_ref: 'REF-3PL-020', auto_assigned: true, created_at: `${today}T07:00:00Z`, updated_at: `${today}T09:00:00Z` },
  // Failed delivery with return chain
  { id: 'ord-021', type: 'delivery', status: 'failed', warehouse_id: 'wh-003', zone_id: 'zone-005', rider_id: 'rider-005', customer_name: 'Hanan Al-Ruwaili', customer_phone: '+966551000021', short_national_address: 'MNQR7890', lat: 24.6380, lng: 46.6950, pod_required: true, notes: 'Wrong address', parent_order_id: null, source_ref: 'REF-3PL-021', auto_assigned: true, created_at: `${today}T08:00:00Z`, updated_at: `${today}T10:00:00Z` },
  { id: 'ord-022', type: 'failed_return', status: 'returned_to_warehouse', warehouse_id: 'wh-003', zone_id: 'zone-005', rider_id: 'rider-005', customer_name: 'Hanan Al-Ruwaili', customer_phone: '+966551000021', short_national_address: 'MNQR7890', lat: 24.6380, lng: 46.6950, pod_required: true, notes: null, parent_order_id: 'ord-021', source_ref: 'REF-3PL-021-R', auto_assigned: true, created_at: `${today}T10:05:00Z`, updated_at: `${today}T11:00:00Z` },
  // More various
  { id: 'ord-023', type: 'delivery', status: 'pending', warehouse_id: 'wh-003', zone_id: 'zone-006', rider_id: null, customer_name: 'Ghada Al-Shammari', customer_phone: '+966551000023', short_national_address: 'OPST1234', lat: 24.6280, lng: 46.7500, pod_required: false, notes: null, parent_order_id: null, source_ref: 'REF-3PL-023', auto_assigned: false, created_at: `${today}T10:30:00Z`, updated_at: `${today}T10:30:00Z` },
  { id: 'ord-024', type: 'return_pickup', status: 'pending', warehouse_id: 'wh-001', zone_id: 'zone-001', rider_id: null, customer_name: 'Abeer Al-Jaber', customer_phone: '+966551000024', short_national_address: 'QRUV5678', lat: 24.7960, lng: 46.6720, pod_required: true, notes: 'Defective product return', parent_order_id: null, source_ref: 'REF-3PL-024', auto_assigned: false, created_at: `${today}T10:45:00Z`, updated_at: `${today}T10:45:00Z` },
  { id: 'ord-025', type: 'delivery', status: 'delivered', warehouse_id: 'wh-002', zone_id: 'zone-003', rider_id: 'rider-003', customer_name: 'Rana Al-Qahtani', customer_phone: '+966551000025', short_national_address: 'STWY9012', lat: 24.7120, lng: 46.6820, pod_required: false, notes: null, parent_order_id: null, source_ref: 'REF-3PL-025', auto_assigned: true, created_at: `${today}T07:30:00Z`, updated_at: `${today}T09:30:00Z` },
  { id: 'ord-026', type: 'delivery', status: 'assigned', warehouse_id: 'wh-003', zone_id: 'zone-006', rider_id: 'rider-005', customer_name: 'Shahad Al-Mutairi', customer_phone: '+966551000026', short_national_address: 'UVXZ3456', lat: 24.6320, lng: 46.7580, pod_required: true, notes: null, parent_order_id: null, source_ref: 'REF-3PL-026', auto_assigned: true, created_at: `${today}T10:00:00Z`, updated_at: `${today}T10:20:00Z` },
  { id: 'ord-027', type: 'delivery', status: 'in_transit', warehouse_id: 'wh-001', zone_id: 'zone-001', rider_id: 'rider-001', customer_name: 'Mashael Al-Harbi', customer_phone: '+966551000027', short_national_address: 'WXAB7890', lat: 24.7910, lng: 46.6780, pod_required: false, notes: null, parent_order_id: null, source_ref: 'REF-3PL-027', auto_assigned: true, created_at: `${today}T09:45:00Z`, updated_at: `${today}T11:00:00Z` },
];

// ── Status Logs ─────────────────────────────────────────────────
function makeLogs(orderId: string, progressions: { status: string; minutesAfterCreation: number; note?: string }[]): OrderStatusLog[] {
  const order = mockOrders.find(o => o.id === orderId)!;
  const base = new Date(order.created_at).getTime();
  return progressions.map((p, i) => ({
    id: `log-${orderId}-${i + 1}`,
    order_id: orderId,
    status: p.status,
    note: p.note ?? null,
    changed_by: order.rider_id ?? 'system',
    created_at: new Date(base + p.minutesAfterCreation * 60000).toISOString(),
  }));
}

export const mockStatusLogs: OrderStatusLog[] = [
  ...makeLogs('ord-001', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 5 },
    { status: 'picked_up', minutesAfterCreation: 30 },
    { status: 'in_transit', minutesAfterCreation: 45 },
    { status: 'delivered', minutesAfterCreation: 150, note: 'Delivered to customer' },
  ]),
  ...makeLogs('ord-002', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 10 },
    { status: 'picked_up', minutesAfterCreation: 35 },
    { status: 'in_transit', minutesAfterCreation: 50 },
    { status: 'delivered', minutesAfterCreation: 165, note: 'Left at door' },
  ]),
  ...makeLogs('ord-003', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 8 },
    { status: 'picked_up', minutesAfterCreation: 40 },
    { status: 'in_transit', minutesAfterCreation: 60 },
  ]),
  ...makeLogs('ord-004', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 10 },
    { status: 'picked_up', minutesAfterCreation: 45 },
  ]),
  ...makeLogs('ord-005', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 15 },
  ]),
  ...makeLogs('ord-006', [{ status: 'pending', minutesAfterCreation: 0 }]),
  ...makeLogs('ord-007', [{ status: 'pending', minutesAfterCreation: 0 }]),
  ...makeLogs('ord-008', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 10 },
    { status: 'picked_up', minutesAfterCreation: 40 },
    { status: 'in_transit', minutesAfterCreation: 60 },
  ]),
  ...makeLogs('ord-009', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 5 },
    { status: 'picked_up', minutesAfterCreation: 20 },
    { status: 'in_transit', minutesAfterCreation: 35 },
    { status: 'delivered', minutesAfterCreation: 90 },
  ]),
  ...makeLogs('ord-010', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 5 },
    { status: 'picked_up', minutesAfterCreation: 25 },
    { status: 'in_transit', minutesAfterCreation: 40 },
    { status: 'delivered', minutesAfterCreation: 105 },
  ]),
  ...makeLogs('ord-011', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 5 },
    { status: 'picked_up', minutesAfterCreation: 30 },
    { status: 'in_transit', minutesAfterCreation: 50 },
    { status: 'failed', minutesAfterCreation: 210, note: 'Customer not available' },
  ]),
  ...makeLogs('ord-012', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'returning', minutesAfterCreation: 10 },
  ]),
  ...makeLogs('ord-013', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 20 },
  ]),
  ...makeLogs('ord-014', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 10 },
    { status: 'picked_up', minutesAfterCreation: 90 },
  ]),
  ...makeLogs('ord-015', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 10 },
    { status: 'picked_up', minutesAfterCreation: 60 },
    { status: 'returning', minutesAfterCreation: 120 },
    { status: 'returned_to_warehouse', minutesAfterCreation: 210 },
  ]),
  ...makeLogs('ord-016', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 10 },
    { status: 'picked_up', minutesAfterCreation: 30 },
    { status: 'in_transit', minutesAfterCreation: 50 },
  ]),
  ...makeLogs('ord-017', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 10 },
  ]),
  ...makeLogs('ord-018', [{ status: 'pending', minutesAfterCreation: 0 }]),
  ...makeLogs('ord-019', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'cancelled', minutesAfterCreation: 30, note: 'Customer cancelled' },
  ]),
  ...makeLogs('ord-020', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 5 },
    { status: 'picked_up', minutesAfterCreation: 25 },
    { status: 'in_transit', minutesAfterCreation: 40 },
    { status: 'delivered', minutesAfterCreation: 120 },
  ]),
  ...makeLogs('ord-021', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 10 },
    { status: 'picked_up', minutesAfterCreation: 30 },
    { status: 'in_transit', minutesAfterCreation: 50 },
    { status: 'failed', minutesAfterCreation: 120, note: 'Wrong address provided' },
  ]),
  ...makeLogs('ord-022', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'returning', minutesAfterCreation: 5 },
    { status: 'returned_to_warehouse', minutesAfterCreation: 55 },
  ]),
  ...makeLogs('ord-023', [{ status: 'pending', minutesAfterCreation: 0 }]),
  ...makeLogs('ord-024', [{ status: 'pending', minutesAfterCreation: 0 }]),
  ...makeLogs('ord-025', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 10 },
    { status: 'picked_up', minutesAfterCreation: 30 },
    { status: 'in_transit', minutesAfterCreation: 50 },
    { status: 'delivered', minutesAfterCreation: 120 },
  ]),
  ...makeLogs('ord-026', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 20 },
  ]),
  ...makeLogs('ord-027', [
    { status: 'pending', minutesAfterCreation: 0 },
    { status: 'assigned', minutesAfterCreation: 10 },
    { status: 'picked_up', minutesAfterCreation: 35 },
    { status: 'in_transit', minutesAfterCreation: 75 },
  ]),
];

// ── Proofs ──────────────────────────────────────────────────────
export const mockProofs: Proof[] = [
  { id: 'proof-001', order_id: 'ord-001', type: 'delivery_pod', photo_url: 'https://placehold.co/400x300?text=Delivery+Photo', signature_url: 'https://placehold.co/400x200?text=Signature', failure_reason: null, item_condition_note: null, submitted_by: 'rider-001', created_at: `${today}T10:30:00Z` },
  { id: 'proof-002', order_id: 'ord-002', type: 'delivery_pod', photo_url: 'https://placehold.co/400x300?text=Delivery+Photo', signature_url: null, failure_reason: null, item_condition_note: null, submitted_by: 'rider-001', created_at: `${today}T11:00:00Z` },
  { id: 'proof-003', order_id: 'ord-009', type: 'delivery_pod', photo_url: 'https://placehold.co/400x300?text=Delivery+Photo', signature_url: 'https://placehold.co/400x200?text=Signature', failure_reason: null, item_condition_note: null, submitted_by: 'rider-005', created_at: `${today}T09:00:00Z` },
  { id: 'proof-004', order_id: 'ord-010', type: 'delivery_pod', photo_url: 'https://placehold.co/400x300?text=Delivery+Photo', signature_url: null, failure_reason: null, item_condition_note: null, submitted_by: 'rider-005', created_at: `${today}T09:30:00Z` },
  { id: 'proof-005', order_id: 'ord-011', type: 'failed_pod', photo_url: 'https://placehold.co/400x300?text=Failed+Delivery', signature_url: null, failure_reason: 'Customer not available at address', item_condition_note: null, submitted_by: 'rider-001', created_at: `${today}T11:30:00Z` },
  { id: 'proof-006', order_id: 'ord-015', type: 'return_pod', photo_url: 'https://placehold.co/400x300?text=Return+Photo', signature_url: 'https://placehold.co/400x200?text=Signature', failure_reason: null, item_condition_note: 'Item in good condition, original packaging intact', submitted_by: 'rider-005', created_at: `${today}T10:30:00Z` },
  { id: 'proof-007', order_id: 'ord-020', type: 'delivery_pod', photo_url: 'https://placehold.co/400x300?text=Delivery+Photo', signature_url: 'https://placehold.co/400x200?text=Signature', failure_reason: null, item_condition_note: null, submitted_by: 'rider-002', created_at: `${today}T09:00:00Z` },
  { id: 'proof-008', order_id: 'ord-021', type: 'failed_pod', photo_url: 'https://placehold.co/400x300?text=Failed+Delivery', signature_url: null, failure_reason: 'Wrong address — building does not exist', item_condition_note: null, submitted_by: 'rider-005', created_at: `${today}T10:00:00Z` },
  { id: 'proof-009', order_id: 'ord-022', type: 'return_pod', photo_url: 'https://placehold.co/400x300?text=Return+Photo', signature_url: null, failure_reason: null, item_condition_note: 'Package slightly dented but contents OK', submitted_by: 'rider-005', created_at: `${today}T11:00:00Z` },
  { id: 'proof-010', order_id: 'ord-025', type: 'delivery_pod', photo_url: 'https://placehold.co/400x300?text=Delivery+Photo', signature_url: null, failure_reason: null, item_condition_note: null, submitted_by: 'rider-003', created_at: `${today}T09:30:00Z` },
];

// ── Rider Locations ─────────────────────────────────────────────
export const mockRiderLocations: RiderLocation[] = [
  { id: 'rloc-001', rider_id: 'rider-001', lat: 24.7930, lng: 46.6720, updated_at: `${today}T11:50:00Z` },
  { id: 'rloc-002', rider_id: 'rider-002', lat: 24.7870, lng: 46.7380, updated_at: `${today}T11:48:00Z` },
  { id: 'rloc-003', rider_id: 'rider-003', lat: 24.7090, lng: 46.6780, updated_at: `${today}T11:45:00Z` },
  { id: 'rloc-004', rider_id: 'rider-004', lat: 24.7060, lng: 46.7350, updated_at: `${today}T11:47:00Z` },
  { id: 'rloc-005', rider_id: 'rider-005', lat: 24.6340, lng: 46.7520, updated_at: `${today}T11:49:00Z` },
];
