'use client';
import { Button } from '@/components/ui/button';
import { getClass } from '@/services/ApiServices';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { IAddress } from '../interface/addressInterface';
import { getLoginTo } from '../login/login';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/ContextAPI/authContext';

export default function Address() {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const router = useRouter();
  const { token } = useAuth();

  async function getAddress() {
    if(!token) return;
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

    const updatedDefault = {
      isDefault: true,
    };
    const data = await getClass.updateAddress(addressId, updatedDefault, token);
    getAddress();
  }

  useEffect(() => {
    async function getAddresses() {
      if (!token) return;
      const data = await getClass.getAddress(token);
      setAddresses(data);
    }
    getAddresses();
  }, []);

  return (
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
        <h1>Addresses</h1>
      </div>
      <Button className="mt-3">
        <Link href={'/address/add'}>Add</Link>
      </Button>

      <div className="mt-5 grid grid-cols-3 gap-5">
        {addresses.map((address: IAddress) => {
          return (
            <div key={address.id} className="relative truncate rounded-2xl border stroke-1 p-5 text-gray-500 shadow-sm">
              <h4 className="mb-2 truncate text-lg font-bold text-black">{address.label || 'Address'}</h4>

              <h4 className="truncate">
                <span className="font-semibold text-black">Street:</span> {address.street}
              </h4>
              <h4 className="truncate">
                <span className="font-semibold text-black">Bldg/Apt:</span> {address.building}, Floor {address.floor},
                Apt {address.apartment}
              </h4>
              <h4 className="truncate">
                <span className="font-semibold text-black">City:</span> {address.city}
              </h4>

              {/* Show Google Maps Link if coordinates exist */}
              {address.latitude && address.longitude && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-sm text-blue-500 underline"
                >
                  View on Map
                </a>
              )}

              <h4 className="mt-2 text-sm">
                Default:{' '}
                <span className={address.isDefault ? 'font-bold text-green-600' : ''}>
                  {address.isDefault ? 'Yes' : 'No'}
                </span>
              </h4>

              {address.isDefault == false && (
                <Button className="mt-3 w-full" variant="outline" onClick={() => updateAddress(address.id)}>
                  Set Default
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
