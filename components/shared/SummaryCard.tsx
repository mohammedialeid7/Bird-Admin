import { Card, CardContent } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
}

export function SummaryCard({ title, value, icon, color }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
