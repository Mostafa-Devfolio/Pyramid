'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { Button } from '@/components/ui/button';
import { User, UserPen, ChevronLeft } from 'lucide-react';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const [isSelected, setIsSelected] = useState(-1);
  const pathName = usePathname();
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    function getReady() {
      if (pathName == '/settings') {
        setIsSelected(0);
      } else if (pathName == '/settings/user-edit') {
        setIsSelected(1);
      }
    }
    getReady();
  }, [pathName]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      {auth ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/profile')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 active:scale-95"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Settings</h1>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Sidebar Navigation */}
            <nav className="space-y-2 rounded-[2rem] border border-gray-100 bg-gray-50/50 p-4 lg:col-span-4">
              <Link
                href={'/settings'}
                className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 ${isSelected == 0 ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-white hover:text-black'}`}
                onClick={() => setIsSelected(0)}
              >
                <User size={18} />
                <span>User Information</span>
              </Link>
              <Link
                href={'/settings/user-edit'}
                className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 ${isSelected == 1 ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-white hover:text-black'}`}
                onClick={() => setIsSelected(1)}
              >
                <UserPen size={18} />
                <span>Edit Profile</span>
              </Link>
            </nav>

            {/* Content Area */}
            <main className="min-h-[400px] rounded-[2rem] border border-gray-100 bg-white p-2 shadow-sm lg:col-span-8">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Please login to access settings</h1>
          <Button
            className="rounded-full px-10 py-6 font-bold shadow-xl transition-transform hover:scale-105"
            onClick={() => router.push('/login')}
          >
            Login to Account
          </Button>
        </div>
      )}
    </div>
  );
}
