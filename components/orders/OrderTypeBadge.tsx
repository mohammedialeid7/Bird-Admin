import { Badge } from '@/components/ui/badge';
import { TYPE_COLORS, TYPE_LABELS } from '@/lib/constants';
import type { OrderType } from '@/lib/types';

export function OrderTypeBadge({ type }: { type: OrderType }) {
  return (
    <Badge variant="outline" className={`${TYPE_COLORS[type]} border`}>
      {TYPE_LABELS[type]}
    </Badge>
  );
}
