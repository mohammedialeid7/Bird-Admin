import { mockRiders } from '@/lib/mock-data';
import RiderDetailClient from './RiderDetailClient';

export function generateStaticParams() {
  return mockRiders.map((rider) => ({ id: rider.id }));
}

export default async function RiderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RiderDetailClient id={id} />;
}
