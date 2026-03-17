'use client';
import { Button } from '@/components/ui/button';
import { getClass } from '@/services/ApiServices';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { IAddress } from '../interface/addressInterface';
import { getLoginTo } from '../login/login';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { MapPin, CheckCircle2, Navigation, Plus, ChevronLeft } from 'lucide-react';

export default function Address() {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const router = useRouter();
  const { token } = useAuth();

  async function getAddress() {
    if (!token) return;
    const data = await getClass.getAddress(token);
    setAddresses(data);
  }

  async function updateAddress(addressId: number) {
    const token: string = await getLoginTo();
    await Promise.all(
      addresses.map((address: IAddress) =>
        address.isDefault ? getClass.updateAddress(address.id, { isDefault: false }, token) : Promise.resolve()
      )
    );

    const updatedDefault = { isDefault: true };
    await getClass.updateAddress(addressId, updatedDefault, token);
    getAddress();
  }

  useEffect(() => {
    async function getAddresses() {
      if (!token) return;
      const data = await getClass.getAddress(token);
      setAddresses(data);
    }
    getAddresses();
  }, [token]);

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-10">
      {/* Header & Add Button */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/profile')}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 active:scale-95"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Saved Addresses</h1>
            <p className="text-sm font-medium text-gray-500">Manage where your orders get delivered.</p>
          </div>
        </div>

        <Link href={'/address/add'}>
          <button className="flex items-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95">
            <Plus size={18} strokeWidth={3} />
            <span>Add New Address</span>
          </button>
        </Link>
      </div>

      {/* Address Grid */}
      <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-6 duration-500 md:grid-cols-2 lg:grid-cols-3">
        {addresses.map((address: IAddress) => (
          <div
            key={address.id}
            className={`group relative flex flex-col rounded-[2.5rem] border p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 ${
              address.isDefault
                ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600'
                : 'border-gray-100 bg-white hover:border-black'
            }`}
          >
            {/* Header: Label & Status Icon */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${address.isDefault ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
                >
                  <MapPin size={20} />
                </div>
                <h3 className="max-w-37.5 truncate text-lg font-black text-gray-900">{address.label || 'Home'}</h3>
              </div>
              {address.isDefault && (
                <div className="flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-sm">
                  <CheckCircle2 size={12} />
                  Default
                </div>
              )}
            </div>

            {/* Address Content */}
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Location</p>
                <p className="text-sm leading-relaxed font-bold text-gray-800">
                  {address.street}, Building {address.building}
                </p>
                <p className="text-sm font-medium text-gray-500">
                  Floor {address.floor}, Apt {address.apartment}
                </p>
                <p className="text-sm font-bold text-gray-900">{address.city}</p>
              </div>

              {/* Original Map Link */}
              {address.latitude && address.longitude && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-blue-600 uppercase hover:underline"
                >
                  <Navigation size={14} />
                  View on Map
                </a>
              )}
            </div>

            {/* Footer Action */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              {address.isDefault === false ? (
                <button
                  onClick={() => updateAddress(address.id)}
                  className="w-full rounded-2xl border-2 border-gray-100 bg-transparent py-3 text-xs font-bold text-gray-600 transition-all hover:border-black hover:text-black active:scale-95"
                >
                  Set as Default
                </button>
              ) : (
                <button
                  disabled
                  className="w-full cursor-default rounded-2xl bg-gray-100/50 py-3 text-xs font-bold text-gray-400"
                >
                  Current Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-gray-200 bg-gray-50/50 py-24 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-300">
            <MapPin size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">No addresses saved</h2>
          <p className="mx-auto mt-2 max-w-xs text-gray-500">You haven&apos;t added any delivery locations yet.</p>
        </div>
      )}
    </div>
  );
}
