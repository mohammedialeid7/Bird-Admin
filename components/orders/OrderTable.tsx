'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTypeBadge } from './OrderTypeBadge';
import { useWarehouseStore } from '@/stores/warehouse-store';
import { useZoneStore } from '@/stores/zone-store';
import { useRiderStore } from '@/stores/rider-store';
import type { Order } from '@/lib/types';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-SA', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const warehouses = useWarehouseStore((s) => s.warehouses);
  const zones = useZoneStore((s) => s.zones);
  const riders = useRiderStore((s) => s.riders);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginated = orders.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const getWarehouseName = (id: string) =>
    warehouses.find((w) => w.id === id)?.name ?? id;
  const getZoneName = (id: string) =>
    zones.find((z) => z.id === id)?.name ?? id;
  const getRiderName = (id: string | null) => {
    if (!id) return '—';
    return riders.find((r) => r.id === id)?.full_name ?? id;
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No orders found.
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden lg:table-cell">Address</TableHead>
              <TableHead className="hidden md:table-cell">Zone</TableHead>
              <TableHead className="hidden xl:table-cell">Warehouse</TableHead>
              <TableHead className="hidden md:table-cell">Rider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((order) => (
              <TableRow
                key={order.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <TableCell className="font-mono text-xs">
                  {order.id}
                </TableCell>
                <TableCell>
                  <OrderTypeBadge type={order.type} />
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs">
                  {order.short_national_address}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  {getZoneName(order.zone_id)}
                </TableCell>
                <TableCell className="hidden xl:table-cell text-sm">
                  {getWarehouseName(order.warehouse_id)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  {getRiderName(order.rider_id)}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                  {formatDate(order.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {page * ITEMS_PER_PAGE + 1}–
            {Math.min((page + 1) * ITEMS_PER_PAGE, orders.length)} of{' '}
            {orders.length}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
