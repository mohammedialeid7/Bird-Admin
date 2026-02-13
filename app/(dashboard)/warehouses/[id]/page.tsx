import { mockWarehouses } from '@/lib/mock-data';
import WarehouseDetailClient from './WarehouseDetailClient';

export function generateStaticParams() {
  return mockWarehouses.map((wh) => ({ id: wh.id }));
}

export default async function WarehouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WarehouseDetailClient id={id} />;
}
