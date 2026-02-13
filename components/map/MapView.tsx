'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type MapViewInner from './MapViewInner';

const MapViewDynamic = dynamic(() => import('./MapViewInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] rounded-lg bg-muted flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

export function MapView(props: ComponentProps<typeof MapViewInner>) {
  return <MapViewDynamic {...props} />;
}
