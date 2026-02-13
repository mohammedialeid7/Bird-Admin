'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { Proof } from '@/lib/types';

export function PODViewer({ proof }: { proof: Proof }) {
  const [lightbox, setLightbox] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex gap-4 flex-wrap">
        {/* Photo */}
        <button
          onClick={() => setLightbox(true)}
          className="relative w-40 h-30 rounded-lg overflow-hidden border hover:ring-2 hover:ring-primary transition-all cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proof.photo_url}
            alt="Proof photo"
            className="w-full h-full object-cover"
          />
        </button>

        {/* Signature */}
        {proof.signature_url && (
          <div className="relative w-40 h-24 rounded-lg overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={proof.signature_url}
              alt="Signature"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Failure reason */}
      {proof.failure_reason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-medium text-red-800">Failure Reason</p>
          <p className="text-sm text-red-700">{proof.failure_reason}</p>
        </div>
      )}

      {/* Item condition */}
      {proof.item_condition_note && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-medium text-blue-800">Item Condition</p>
          <p className="text-sm text-blue-700">{proof.item_condition_note}</p>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Proof Photo</DialogTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proof.photo_url}
            alt="Proof photo full size"
            className="w-full rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
