import React from 'react';

export default function VendorsSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border shadow-lg">
      <div className="aspect-square bg-gray-200" />

      <div className="space-y-3 p-5">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-24 rounded bg-gray-200" />
      </div>
    </div>
  );
}
