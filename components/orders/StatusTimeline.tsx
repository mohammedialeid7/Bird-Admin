import type { OrderStatusLog } from '@/lib/types';
import type { OrderStatus } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/constants';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-SA', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function StatusTimeline({ logs }: { logs: OrderStatusLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-muted-foreground">No status history.</p>;
  }

  return (
    <div className="space-y-0">
      {logs.map((log, i) => (
        <div key={log.id} className="flex gap-3">
          {/* Line and dot */}
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary mt-1.5 shrink-0" />
            {i < logs.length - 1 && (
              <div className="w-0.5 flex-1 bg-border" />
            )}
          </div>
          {/* Content */}
          <div className="pb-6">
            <p className="text-sm font-medium">
              {STATUS_LABELS[log.status as OrderStatus] ?? log.status}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(log.created_at)}
              {log.changed_by && ` · by ${log.changed_by}`}
            </p>
            {log.note && (
              <p className="text-xs text-muted-foreground mt-1">{log.note}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
