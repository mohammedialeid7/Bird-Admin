# Prompt — Admin DMS Web App (Frontend Demo)

## Project Overview

Build a **frontend-only** web-based admin panel for a 3PL (third-party logistics) delivery management system (DMS). This is a fully interactive demo — all data is mocked, all buttons are clickable, all screens are navigable. There is **no real backend**. The goal is a polished, realistic UI that looks and feels like a production admin dashboard.

The admin panel is used by operations staff to manage warehouses, zones, riders, and orders. It provides a live map dashboard, order tracking, manual assignment overrides, and proof-of-delivery review.

### System Context

This admin web app is one of three apps in the full system:
- **3PL Web App** (existing) — handles warehouse inventory and order routing.
- **Admin DMS Web App** (this project) — operations dashboard and management.
- **Rider DMS Mobile App** (separate Expo project) — rider-facing mobile app.

In the full system, all three share a Supabase backend. **This demo is frontend-only with mock data.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand (client-side mock stores) |
| Maps | Leaflet + OpenStreetMap (no API key needed) |
| Deployment | Vercel (recommended) |

---

## Mock Data Strategy

Since there is no backend, all data lives in Zustand stores initialized with realistic seed data. All CRUD operations update the local store immediately.

### Seed Data (`lib/mock-data.ts`)

Generate the following:

- **3 warehouses** in Riyadh, Saudi Arabia (with real-ish coordinates and Saudi short national addresses like `RVFA8376`)
- **6 zones** (multi-warehouse per zone), each with a GeoJSON polygon (simple hexagons around Riyadh neighborhoods)
- **8 riders** distributed across warehouses and zones, with randomized active/offline status
- **25+ orders** across all types and statuses:
  - Mix of `delivery`, `return_pickup`, and `failed_return`
  - Statuses spread across: `pending`, `assigned`, `picked_up`, `in_transit`, `delivered`, `failed`, `returning`, `returned_to_warehouse`, `cancelled`
  - Some with `pod_required = true` and mock proof data (placeholder image URLs)
  - Some with `parent_order_id` links (failed → failed_return chains)
  - Some with `auto_assigned = true`
- **Status logs** for each order (2–5 entries showing realistic status progressions)
- **Rider locations** (lat/lng for each active rider, simulating positions across Riyadh)
- **Proof records** with placeholder photo URLs (use `https://placehold.co/400x300?text=Delivery+Photo`) and mock failure reasons

### Mock Auth

- No real authentication. App starts with a mock admin user already "logged in".
- Include a login page for visual completeness — accepts any input and redirects to dashboard.
- Logout button redirects back to login.

---

## Data Models (TypeScript Types)

```typescript
type OrderType = 'delivery' | 'return_pickup' | 'failed_return';
type OrderStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'returning' | 'returned_to_warehouse' | 'cancelled';
type ProofType = 'delivery_pod' | 'return_pod' | 'failed_pod';

interface Warehouse {
  id: string;
  name: string;
  short_national_address: string;
  lat: number;
  lng: number;
  created_at: string;
}

interface Zone {
  id: string;
  name: string;
  warehouse_id: string;
  polygon: GeoJSON.Polygon;
  created_at: string;
}

interface User {
  id: string;
  full_name: string;
  role: 'admin' | 'rider';
  phone: string;
  warehouse_id: string | null;
  is_active: boolean;
  created_at: string;
}

interface RiderZone {
  id: string;
  rider_id: string;
  zone_id: string;
}

interface Order {
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

interface OrderStatusLog {
  id: string;
  order_id: string;
  status: string;
  note: string | null;
  changed_by: string;
  created_at: string;
}

interface Proof {
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

interface RiderLocation {
  id: string;
  rider_id: string;
  lat: number;
  lng: number;
  updated_at: string;
}
```

---

## App Structure (Next.js App Router)

```
app/
  layout.tsx                 — root layout, global providers
  login/
    page.tsx                 — mock login
  (dashboard)/
    layout.tsx               — sidebar nav + top bar
    page.tsx                 — dashboard (map + summary cards)
    orders/
      page.tsx               — order list with filters
      [id]/
        page.tsx             — order detail + reassignment + POD viewer
      new/
        page.tsx             — create order form
    riders/
      page.tsx               — rider list
      [id]/
        page.tsx             — rider detail + assigned orders
    zones/
      page.tsx               — zone list
      [id]/
        page.tsx             — zone detail + polygon viewer
    warehouses/
      page.tsx               — warehouse list
      [id]/
        page.tsx             — warehouse detail + edit

lib/
  mock-data.ts               — seed data
  types.ts                   — TypeScript interfaces

stores/
  auth-store.ts
  order-store.ts
  rider-store.ts
  zone-store.ts
  warehouse-store.ts

components/
  layout/
    Sidebar.tsx
    TopBar.tsx
  orders/
    OrderTable.tsx
    OrderStatusBadge.tsx
    OrderTypeBadge.tsx
    StatusTimeline.tsx
    PODViewer.tsx
  riders/
    RiderTable.tsx
  map/
    MapView.tsx
    PinPicker.tsx
  shared/
    FilterBar.tsx
    ConfirmModal.tsx
    SummaryCard.tsx
```

---

## Screen Specifications

### Login (`/login`)
- Email + password form with shadcn/ui inputs.
- **Any credentials accepted** — clicking "Login" redirects to `/`.
- Logo/brand at top. Clean, polished.
- "Forgot password" link → shows toast "Not available in demo".

### Sidebar Layout (`(dashboard)/layout.tsx`)
- **Left sidebar** (collapsible on mobile):
  - Logo/brand at top
  - Nav items with icons: Dashboard, Orders, Riders, Zones, Warehouses
  - Active item highlighted
  - Logout button at bottom
- **Top bar**: Page title, admin name ("Admin User"), avatar placeholder.

### Dashboard (`/`)
- **Map** (full width, ~60vh):
  - Center on Riyadh (24.7136, 46.6753), zoom ~11.
  - **Rider dots**: Colored circles at mock locations. Green = active, grey = offline. Click → tooltip with name + active order count.
  - **Order pins**: Color-coded markers. Delivery = blue, Return Pickup = orange, Failed Return = red. Click → tooltip with type, customer, status + "View Details" link to `/orders/[id]`.
  - **Zone polygons**: Semi-transparent colored overlays for each zone.
- **Summary cards** (responsive grid below map):
  - Total orders today, Delivered (green), Failed (red), Pending (yellow), Return pickups (orange)
  - Counts computed from mock data.
- **Filters**: Warehouse + Zone dropdowns above map. Updates map markers and card counts.

### Order List (`/orders`)
- **Data table** with columns: Order ID, Type (badge), Customer, Short National Address, Zone, Warehouse, Rider, Status (badge), Created At.
- **Filter bar**: Status multi-select, Type multi-select, Zone dropdown, Warehouse dropdown, Date range picker, Search (name/phone/address).
- All filters work client-side against the store.
- Client-side pagination, 15 per page.
- Row click → `/orders/[id]`.

### Order Detail (`/orders/[id]`)
- **Header**: Type badge, status badge, source_ref, created timestamp.
- **Customer info card**: Name, phone (click-to-call link), short national address.
- **Mini map**: Single pin at delivery/pickup coordinates.
- **Assignment section**:
  - Current rider (name + phone) or "Unassigned" warning.
  - **"Reassign" button** → modal with rider dropdown (riders in the order's zone). Selecting updates the store.
  - Show `auto_assigned` badge if applicable.
- **Status timeline**: Vertical timeline from mock `order_status_logs`. Each entry: status, timestamp, changed_by, note. Clean line + dot design.
- **POD section** (only if `pod_required = true` and proof exists):
  - Photo thumbnail → click to enlarge (lightbox/dialog).
  - Signature image if present.
  - Failure reason text (for failed_pod).
  - Item condition note (for return_pod).
- **Linked orders**:
  - Failed delivery → link to child `failed_return` order.
  - `failed_return` → link to parent delivery order.
- **Cancel Order** button → confirmation dialog → updates status to `cancelled`, adds log entry.

### New Order (`/orders/new`)
- Header note: "Orders are typically auto-created via the 3PL app. This is a manual fallback."
- **Form fields**:
  - Order type: Radio — Delivery / Return Pickup
  - Customer name (required)
  - Customer phone (required)
  - Short national address
  - Location: **Map pin picker** — click to place pin, shows lat/lng
  - Warehouse: Select dropdown
  - POD required: Toggle (default off)
  - Notes: Textarea
- **Zone auto-detection**: After pin is placed, run point-in-polygon client-side (use `@turf/boolean-point-in-polygon`) against zone polygons. Show detected zone or "No zone found" warning.
- **Submit**: Adds order to store with `status = 'pending'`, generates UUID + timestamps. Shows success toast, redirects to `/orders`.

### Rider List (`/riders`)
- **Table**: Name, Phone, Warehouse, Assigned Zones (comma-separated), Status (green/grey dot), Active Orders count.
- **Filters**: Warehouse, Zone, Active/All toggle.
- Row click → `/riders/[id]`.

### Rider Detail (`/riders/[id]`)
- **Profile card**: Name, phone, warehouse, active/offline badge.
- **Assigned zones**: List with "×" remove buttons. "Add Zone" dropdown. All updates are instant in the store.
- **Current orders**: Table of non-completed orders assigned to this rider.
- **Performance summary** (mock): Completed today, this week, failure rate.
- **Location map**: Small map with rider's last known position dot.

### Zone List (`/zones`)
- **Table**: Name, Warehouse, Rider count, Active order count.
- Row click → `/zones/[id]`.

### Zone Detail (`/zones/[id]`)
- **Map** (~70vh): Zone polygon as a colored overlay.
- **Info**: Zone name (editable input), linked warehouse (read-only).
- **Assigned riders**: List with "×" remove + "Add Rider" dropdown.
- **Save** → updates store, success toast.

### Warehouse List (`/warehouses`)
- **Table**: Name, Short National Address, Lat/Lng, Zone count, Rider count.
- Row click → `/warehouses/[id]`.

### Warehouse Detail (`/warehouses/[id]`)
- **Info form**: Name (editable), Short National Address (editable), coordinates + small map with pin.
- **Linked zones**: List with links.
- **Linked riders**: List with links.
- **Save** → updates store, success toast.

---

## Zustand Stores

All stores initialized from `lib/mock-data.ts`. No API calls.

### `useAuthStore`
- `user`, `isAuthenticated`
- `login()`, `logout()`

### `useOrderStore`
- `orders`, `statusLogs`, `proofs`
- `getOrders(filters)`, `getOrderById(id)`, `createOrder(data)`, `updateOrder(id, changes)`, `cancelOrder(id)`, `reassignOrder(orderId, riderId)`

### `useRiderStore`
- `riders`, `riderLocations`, `riderZones`
- `getRiders(filters)`, `getRiderById(id)`, `addRiderZone(riderId, zoneId)`, `removeRiderZone(riderId, zoneId)`

### `useZoneStore`
- `zones`
- `getZones()`, `getZoneById(id)`, `updateZone(id, data)`

### `useWarehouseStore`
- `warehouses`
- `getWarehouses()`, `getWarehouseById(id)`, `updateWarehouse(id, data)`

---

## Shared Components

| Component | Purpose |
|---|---|
| `OrderTable` | Reusable data table for order lists |
| `OrderStatusBadge` | Color-coded status badge |
| `OrderTypeBadge` | Color-coded type badge |
| `RiderTable` | Reusable rider data table |
| `StatusTimeline` | Vertical timeline for status logs |
| `PODViewer` | Photo lightbox + signature + failure/condition notes |
| `MapView` | Leaflet/Google Maps wrapper with polygons, pins, rider dots |
| `PinPicker` | Click-to-place pin for coordinate selection |
| `FilterBar` | Reusable filter toolbar |
| `ConfirmModal` | shadcn AlertDialog for destructive actions |
| `Sidebar` | Collapsible nav sidebar |
| `SummaryCard` | Dashboard metric card |

---

## Design Guidelines

- **Theme**: shadcn/ui default (neutral greys + accent). Professional and clean.
- **Status badge colors**: pending=yellow, assigned=blue, picked_up=indigo, in_transit=purple, delivered=green, failed=red, returning=orange, returned_to_warehouse=teal, cancelled=grey.
- **Type badge colors**: delivery=blue, return_pickup=orange, failed_return=red.
- **Responsive**: Desktop-first. Sidebar collapses on mobile. Tables become cards on small screens.
- **Empty states**: Friendly messages on every empty list.
- **Toasts**: Success/error notifications on all actions.
- **Dark mode**: Optional stretch goal.

---

## Map Notes

**Recommended: Leaflet + OpenStreetMap** (zero config):
```bash
npm install leaflet react-leaflet @types/leaflet
```
Center on Riyadh (24.7136, 46.6753). Use colored circle markers for riders, standard markers for orders, polygon overlays for zones.

---

## Environment Variables

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=    # optional, only if using Google Maps instead of Leaflet
```

---

## Deliverables

1. Full Next.js project with App Router structure
2. `lib/mock-data.ts` with realistic Riyadh-based seed data
3. All pages implemented — every button, filter, form, and modal is functional
4. Map with rider dots, order pins, zone polygons — all clickable
5. Zustand stores with mock CRUD
6. Responsive sidebar layout with shadcn/ui
7. README: `npm install && npm run dev`
