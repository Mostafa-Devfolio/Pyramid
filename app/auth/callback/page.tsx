'use client';

import React, { Suspense } from 'react';
import CallbackClient from './CallbackClient';

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="my-5 text-center">Loading...</div>}>
      <CallbackClient />
    </Suspense>
  );
}