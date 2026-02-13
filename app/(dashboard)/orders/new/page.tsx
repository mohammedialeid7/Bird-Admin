'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PinPicker } from '@/components/map/PinPicker';
import { useOrderStore } from '@/stores/order-store';
import { useWarehouseStore } from '@/stores/warehouse-store';
import { useZoneStore } from '@/stores/zone-store';
import { toast } from 'sonner';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import type { OrderType } from '@/lib/types';

export default function NewOrderPage() {
  const router = useRouter();
  const createOrder = useOrderStore((s) => s.createOrder);
  const warehouses = useWarehouseStore((s) => s.warehouses);
  const zones = useZoneStore((s) => s.zones);

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [warehouseId, setWarehouseId] = useState('');
  const [podRequired, setPodRequired] = useState(false);
  const [notes, setNotes] = useState('');

  // Auto-detect zone from pin location
  const detectedZone = useMemo(() => {
    if (!location) return null;
    const pt = point([location.lng, location.lat]);
    for (const zone of zones) {
      if (booleanPointInPolygon(pt, zone.polygon)) {
        return zone;
      }
    }
    return null;
  }, [location, zones]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      toast.error('Please fill in required fields');
      return;
    }
    if (!location) {
      toast.error('Please select a location on the map');
      return;
    }
    if (!warehouseId) {
      toast.error('Please select a warehouse');
      return;
    }

    createOrder({
      type: orderType,
      warehouse_id: warehouseId,
      zone_id: detectedZone?.id ?? '',
      rider_id: null,
      customer_name: customerName,
      customer_phone: customerPhone,
      short_national_address: address,
      lat: location.lat,
      lng: location.lng,
      pod_required: podRequired,
      notes: notes || null,
      parent_order_id: null,
      source_ref: null,
      auto_assigned: false,
    });

    toast.success('Order created successfully');
    router.push('/orders');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/orders')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
      </Button>

      <div>
        <h2 className="text-lg font-semibold">Create New Order</h2>
        <p className="text-sm text-muted-foreground">
          Orders are typically auto-created via the 3PL app. This is a manual fallback.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={orderType}
              onValueChange={(v) => setOrderType(v as OrderType)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery">Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="return_pickup" id="return_pickup" />
                <Label htmlFor="return_pickup">Return Pickup</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Customer Phone *</Label>
              <Input
                id="phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+966..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Short National Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. ABCD1234"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <PinPicker value={location} onChange={setLocation} />
            {location && (
              <div className="flex items-center gap-2">
                {detectedZone ? (
                  <p className="text-sm text-green-700">
                    Zone detected: <span className="font-medium">{detectedZone.name}</span>
                  </p>
                ) : (
                  <p className="text-sm text-yellow-700 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    No zone found for this location
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warehouse & Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Warehouse *</Label>
              <Select value={warehouseId} onValueChange={setWarehouseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pod">POD Required</Label>
              <Switch id="pod" checked={podRequired} onCheckedChange={setPodRequired} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional instructions..."
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Create Order
        </Button>
      </form>
    </div>
  );
}
