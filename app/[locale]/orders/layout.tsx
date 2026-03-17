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
    function getReady() {
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
      } else if (pathname == '/orders/bookings') {
        setIsSelected(7);
        return;
      }
    }
    getReady();
  }, [pathname]);

  return (
    <>
      {isSelected != 7 ? (
        <div className="container mx-auto max-w-5xl px-4 py-8">
          {auth ? (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:scale-105 hover:bg-gray-50 active:scale-95"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My Orders</h1>
              </div>

              {/* Main Navigation Tabs */}
              <div className="flex max-w-fit gap-2 rounded-full border border-gray-100 bg-gray-50 p-1.5 shadow-inner">
                <Link
                  className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${[0, 1, 2, 3].includes(isSelected) ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-black'}`}
                  href={'/orders/'}
                  onClick={() => setIsSelected(0)}
                >
                  E-commerce
                </Link>
                <Link
                  className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${[4, 5, 6].includes(isSelected) ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-black'}`}
                  href={'/orders/parcel'}
                  onClick={() => setIsSelected(4)}
                >
                  Parcel Services
                </Link>
              </div>

              {/* Sub Navigation Tabs */}
              {[0, 1, 2, 3].includes(isSelected) && (
                <div className="flex flex-wrap gap-2">
                  <Link
                    onClick={() => setIsSelected(0)}
                    className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${isSelected == 0 ? 'bg-black text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black'}`}
                    href={'/orders/'}
                  >
                    Processing
                  </Link>
                  <Link
                    onClick={() => setIsSelected(1)}
                    className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${isSelected == 1 ? 'bg-black text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black'}`}
                    href={'/orders/completed'}
                  >
                    Completed
                  </Link>
                  <Link
                    onClick={() => setIsSelected(2)}
                    className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${isSelected == 2 ? 'bg-black text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black'}`}
                    href={'/orders/cancelled'}
                  >
                    Cancelled
                  </Link>
                  <Link
                    onClick={() => setIsSelected(3)}
                    className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${isSelected == 3 ? 'bg-black text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black'}`}
                    href={'/orders/subscription'}
                  >
                    Subscribed
                  </Link>
                </div>
              )}

              {[4, 5, 6].includes(isSelected) && (
                <div className="flex flex-wrap gap-2">
                  <Link
                    onClick={() => setIsSelected(4)}
                    className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${isSelected == 4 ? 'bg-black text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black'}`}
                    href={'/orders/parcel'}
                  >
                    Processing
                  </Link>
                  <Link
                    onClick={() => setIsSelected(5)}
                    className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${isSelected == 5 ? 'bg-black text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black'}`}
                    href={'/orders/parcel-completed'}
                  >
                    Completed
                  </Link>
                  <Link
                    onClick={() => setIsSelected(6)}
                    className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${isSelected == 6 ? 'bg-black text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black'}`}
                    href={'/orders/parcel-cancelled'}
                  >
                    Cancelled
                  </Link>
                </div>
              )}

              {/* Dynamic Content */}
              <div className="animate-in fade-in mt-8 duration-500">{children}</div>
            </div>
          ) : (
            <div className="animate-in fade-in flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                <i className="fa-solid fa-lock text-4xl"></i>
              </div>
              <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900">Login Required</h1>
              <p className="mb-8 max-w-sm text-gray-500">Please sign in to view and manage your order history.</p>
              <Button
                className="rounded-full px-10 py-5 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                onClick={() => router.push('/login')}
              >
                Sign In Now
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-in fade-in">{children}</div>
      )}
    </>
  );
}
