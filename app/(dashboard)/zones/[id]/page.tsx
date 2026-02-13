import { mockZones } from '@/lib/mock-data';
import ZoneDetailClient from './ZoneDetailClient';

export function generateStaticParams() {
  return mockZones.map((zone) => ({ id: zone.id }));
}

export default async function ZoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ZoneDetailClient id={id} />;
}
