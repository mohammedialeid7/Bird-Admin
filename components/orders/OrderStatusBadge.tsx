import { Badge } from '@/components/ui/badge';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';
import type { OrderStatus } from '@/lib/types';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={`${STATUS_COLORS[status]} border`}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
