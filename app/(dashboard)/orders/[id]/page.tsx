import { mockOrders } from '@/lib/mock-data';
import OrderDetailClient from './OrderDetailClient';

export function generateStaticParams() {
  return mockOrders.map((order) => ({ id: order.id }));
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailClient id={id} />;
}
