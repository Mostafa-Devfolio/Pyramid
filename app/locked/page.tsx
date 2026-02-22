"use client"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Locked() {
    const router = useRouter();
  return (
    <div className="text-center">
      <h1 className="my-5">Please login to see your orders!</h1>
      <Button className="cursor-pointer" onClick={() => router.push('/login')}>
        Login
      </Button>
    </div>
  );
}
