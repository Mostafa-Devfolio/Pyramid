'use client';
import { Button } from '@/components/ui/button';
import { authContext, useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { auth, setAuth } = useAuth();
  const [isSelected, setIsSelected] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    // if(!auth){
    //     router.push('/login')
    // }
    if (pathname == '/orders') {
      setIsSelected(0);
    } else if (pathname == '/orders/completed') {
      setIsSelected(1);
    } else if (pathname == '/orders/cancelled') {
      setIsSelected(2);
    } else if (pathname == '/orders/subscription') {
      setIsSelected(3);
    } else if (pathname == '/orders/parcel') {
      setIsSelected(4);
    } else if (pathname == '/orders/parcel-completed') {
      setIsSelected(5);
    } else if (pathname == '/orders/parcel-cancelled') {
      setIsSelected(6);
    }
  }, []);
  return (
    <div>
      {auth ? (
        <div>
          <div className="flex items-center gap-1">
            <h2 onClick={() => router.push('/profile')} className="counter cursor-pointer">
              <svg width="2em" height="2em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 12H8M8 12L12 8M8 12L12 16"
                  stroke="black"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </h2>
            <h1>Orders</h1>
          </div>
          <div className="mx-auto my-3 grid grid-cols-2">
            <Link
              className={`rounded-xl p-2 text-center hover:bg-gray-300 ${isSelected == 0 || isSelected == 1 || isSelected == 2 || isSelected == 3 ? 'bg-gray-300 font-bold' : ''}`}
              href={'/orders/'}
              onClick={() => setIsSelected(0)}
            >
              E-commerce Orders
            </Link>
            <Link
              className={`rounded-xl p-2 text-center hover:bg-gray-300 ${isSelected == 4 || isSelected == 5 || isSelected == 6 ? 'bg-gray-300 font-bold' : ''}`}
              href={'/orders/parcel'}
              onClick={() => setIsSelected(4)}
            >
              Parcel Orders
            </Link>
          </div>
          {(isSelected == 0 || isSelected == 1 || isSelected == 2 || isSelected == 3) && (
            <div className="mx-auto mt-3 grid grid-cols-4">
              <Link
                onClick={() => setIsSelected(0)}
                className={`rounded-xl p-2 text-center hover:bg-gray-300 ${isSelected == 0 ? 'bg-gray-300' : ''}`}
                href={'/orders/'}
              >
                <h3>Processing</h3>
              </Link>
              <Link
                onClick={() => setIsSelected(1)}
                className={`rounded-xl p-2 text-center hover:bg-gray-300 ${isSelected == 1 ? 'bg-gray-300' : ''}`}
                href={'/orders/completed'}
              >
                <h3>Completed</h3>
              </Link>
              <Link
                onClick={() => setIsSelected(2)}
                className={`rounded-xl p-2 text-center hover:bg-gray-300 ${isSelected == 2 ? 'bg-gray-300' : ''}`}
                href={'/orders/cancelled'}
              >
                <h3>Cancelled</h3>
              </Link>
              <Link
                onClick={() => setIsSelected(3)}
                className={`rounded-xl p-2 text-center hover:bg-gray-300 ${isSelected == 3 ? 'bg-gray-300' : ''}`}
                href={'/orders/subscription'}
              >
                <h3>Subscribed</h3>
              </Link>
            </div>
          )}
          {(isSelected == 4 || isSelected == 5 || isSelected == 6) && (
            <div className="mx-auto mt-3 grid grid-cols-3">
              <Link
                onClick={() => setIsSelected(4)}
                className={`rounded-xl p-2 text-center hover:bg-gray-300 ${isSelected == 4 ? 'bg-gray-300' : ''}`}
                href={'/orders/parcel'}
              >
                <h3>Processing</h3>
              </Link>
              <Link
                onClick={() => setIsSelected(5)}
                className={`rounded-xl p-2 text-center hover:bg-gray-300 ${isSelected == 5 ? 'bg-gray-300' : ''}`}
                href={'/orders/parcel-completed'}
              >
                <h3>Completed</h3>
              </Link>
              <Link
                onClick={() => setIsSelected(6)}
                className={`rounded-xl p-2 text-center hover:bg-gray-300 ${isSelected == 6 ? 'bg-gray-300' : ''}`}
                href={'/orders/parcel-cancelled'}
              >
                <h3>Cancelled</h3>
              </Link>
            </div>
          )}
          <div className="mt-5">{children}</div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="my-5">Please login to see your orders!</h1>
          <Button className="cursor-pointer" onClick={() => router.push('/login')}>
            Login
          </Button>
        </div>
      )}
    </div>
  );
}
