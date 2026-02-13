'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone, MapPin, UserCircle, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderTypeBadge } from '@/components/orders/OrderTypeBadge';
import { StatusTimeline } from '@/components/orders/StatusTimeline';
import { PODViewer } from '@/components/orders/PODViewer';
import { MapView } from '@/components/map/MapView';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { useOrderStore } from '@/stores/order-store';
import { useRiderStore } from '@/stores/rider-store';
import { useWarehouseStore } from '@/stores/warehouse-store';
import { useZoneStore } from '@/stores/zone-store';
import { toast } from 'sonner';

import { useShallow } from 'zustand/react/shallow';


export default function OrderDetailClient({ id }: { id: string }) {
  const router = useRouter();

  const order = useOrderStore((s) => s.getOrderById(id));
  const logs = useOrderStore(useShallow((s) => s.getOrderLogs(id)));
  const proof = useOrderStore((s) => s.getOrderProof(id));
  const orders = useOrderStore((s) => s.orders);
  const cancelOrder = useOrderStore((s) => s.cancelOrder);
  const reassignOrder = useOrderStore((s) => s.reassignOrder);

  const riders = useRiderStore((s) => s.riders);
  const riderZones = useRiderStore((s) => s.riderZones);
  const warehouses = useWarehouseStore((s) => s.warehouses);
  const zones = useZoneStore((s) => s.zones);

  const [showReassign, setShowReassign] = useState(false);
  const [selectedRider, setSelectedRider] = useState<string>('');
  const [showCancel, setShowCancel] = useState(false);

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Order not found.</p>
        <Button variant="link" onClick={() => router.push('/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const warehouse = warehouses.find((w) => w.id === order.warehouse_id);
  const zone = zones.find((z) => z.id === order.zone_id);
  const rider = order.rider_id ? riders.find((r) => r.id === order.rider_id) : null;

  const zoneRiderIds = riderZones
    .filter((rz) => rz.zone_id === order.zone_id)
    .map((rz) => rz.rider_id);
  const availableRiders = riders.filter(
    (r) => zoneRiderIds.includes(r.id) && r.is_active
  );

  const childOrder = orders.find((o) => o.parent_order_id === order.id);
  const parentOrder = order.parent_order_id
    ? orders.find((o) => o.id === order.parent_order_id)
    : null;

  const handleReassign = () => {
    if (!selectedRider) return;
    reassignOrder(order.id, selectedRider);
    setShowReassign(false);
    setSelectedRider('');
    toast.success('Order reassigned successfully');
  };

  const handleCancel = () => {
    cancelOrder(order.id);
    setShowCancel(false);
    toast.success('Order cancelled');
  };

  const canCancel = !['delivered', 'cancelled', 'returned_to_warehouse'].includes(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/orders')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <OrderTypeBadge type={order.type} />
            <OrderStatusBadge status={order.status} />
            {order.auto_assigned && (
              <Badge variant="secondary">Auto-assigned</Badge>
            )}
            {order.source_ref && (
              <span className="text-xs text-muted-foreground font-mono">
                {order.source_ref}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Created {new Date(order.created_at).toLocaleString('en-SA')}
          </p>
        </div>
        {canCancel && (
          <Button variant="destructive" size="sm" onClick={() => setShowCancel(true)}>
            Cancel Order
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order.customer_name}</p>
              <a
                href={`tel:${order.customer_phone}`}
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <Phone className="w-4 h-4" />
                {order.customer_phone}
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {order.short_national_address}
              </div>
              <div className="text-xs text-muted-foreground">
                Warehouse: {warehouse?.name} · Zone: {zone?.name}
              </div>
            </CardContent>
          </Card>

          <div className="h-[250px] rounded-lg overflow-hidden border">
            <MapView
              center={{ lat: order.lat, lng: order.lng }}
              zoom={15}
              orders={[order]}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              {rider ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{rider.full_name}</p>
                      <p className="text-sm text-muted-foreground">{rider.phone}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowReassign(true)}>
                    Reassign
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-yellow-600 font-medium">⚠ Unassigned</p>
                  <Button variant="outline" size="sm" onClick={() => setShowReassign(true)}>
                    Assign Rider
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {order.pod_required && proof && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Proof of Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <PODViewer proof={proof} />
              </CardContent>
            </Card>
          )}

          {(childOrder || parentOrder) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Linked Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {parentOrder && (
                  <Link
                    href={`/orders/${parentOrder.id}`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    Parent: {parentOrder.id} ({parentOrder.type.replace('_', ' ')})
                  </Link>
                )}
                {childOrder && (
                  <Link
                    href={`/orders/${childOrder.id}`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    Child: {childOrder.id} ({childOrder.type.replace('_', ' ')})
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline logs={logs} />
            </CardContent>
          </Card>

          {order.notes && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showReassign} onOpenChange={setShowReassign}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRider} onValueChange={setSelectedRider}>
              <SelectTrigger>
                <SelectValue placeholder="Select a rider" />
              </SelectTrigger>
              <SelectContent>
                {availableRiders.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableRiders.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                No active riders available in this zone.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReassign(false)}>
              Cancel
            </Button>
            <Button onClick={handleReassign} disabled={!selectedRider}>
              Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={showCancel}
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
        title="Cancel Order"
        description="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Cancel Order"
        destructive
      />
    </div>
  );
}
