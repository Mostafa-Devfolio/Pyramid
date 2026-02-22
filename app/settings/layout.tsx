'use client';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { Button } from '@/components/ui/button';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const [isSelected, setIsSelected] = useState(-1);
  const pathName = usePathname();
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (pathName == '/settings') {
      setIsSelected(0);
    } else if (pathName == '/settings/user-edit') {
      setIsSelected(1);
    }
  }, []);

  return (
    <div>
      {auth ? (
        <div className="container mx-auto my-5">
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
            <h2>Settings</h2>
          </div>
          <div className="my-5 rounded-2xl border">
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
              <div className="col-span-1 flex flex-col gap-3 rounded-2xl border py-4">
                <Link
                  href={'/settings'}
                  className={`cursor-pointer ${isSelected == 0 ? 'rounded bg-gray-400 p-2 text-white' : ''}`}
                  onClick={() => {
                    setIsSelected(0);
                  }}
                >
                  <h3 className="pl-5">User Information</h3>
                </Link>
                <Link
                  href={'/settings/user-edit'}
                  className={`cursor-pointer ${isSelected == 1 ? 'rounded bg-gray-400 p-2 text-white' : ''}`}
                  onClick={() => {
                    setIsSelected(1);
                  }}
                >
                  <h3 className="pl-5">Information edit</h3>
                </Link>
              </div>
              <div className="col-span-2 rounded-2xl border">
                {children}
                {/* User Info here if clicked on user information */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="my-5">Please login to access the settings</h1>
          <Button className="cursor-pointer" onClick={() => router.push('/login')}>
            Login
          </Button>
        </div>
      )}
    </div>
  );
}
