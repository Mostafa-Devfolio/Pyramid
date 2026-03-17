'use client';
import { IParcelOrders } from '@/app/[locale]/interface/parcelOrdersInterface';
import { getLoginTo } from '@/app/[locale]/login/login';
import { Button } from '@/components/ui/button';
import { getClass } from '@/services/ApiServices';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const TaxiRoutingMap = dynamic(() => import('@/components/TaxiRoutingMap'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full animate-pulse rounded-2xl bg-gray-100" />,
});

export default function ParcelCancelled() {
  const [saveParcel, setSaveParcel] = useState<IParcelOrders[]>([]);

  
  useEffect(() => {
    async function getParcel() {
      const token = await getLoginTo();
      const userData = await getClass.userProfile(token);
      const data = await getClass.getParcel(token, userData?.id);
      const filtered = data.filter((par: IParcelOrders) => par.deliveryStatus === 'cancelled');
      setSaveParcel(filtered);
    }
    getParcel();
  }, []);

  return (
    <div className="space-y-6">
      {saveParcel.length !== 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {saveParcel.map((parcel: IParcelOrders) => (
            <div
              key={parcel.id}
              className="group flex flex-col rounded-3xl border border-gray-100 bg-white opacity-70 shadow-sm grayscale transition-all hover:opacity-100 hover:grayscale-0"
            >
              <div className="flex items-center justify-between border-b border-gray-100 p-6 sm:px-8">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Cancelled Parcel
                  </span>
                  <p className="text-lg font-black text-gray-900">#{parcel.id}</p>
                </div>
                <div className="rounded-full bg-red-50 px-4 py-1 text-xs font-bold text-red-600 uppercase">
                  {parcel.deliveryStatus}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-2">
                <div className="h-48 overflow-hidden rounded-2xl border border-gray-50">
                  <TaxiRoutingMap
                    readOnly={true}
                    initialPickup={{
                      lat: parcel.pickupLat || parcel.pickupLocation?.lat,
                      lng: parcel.pickupLng || parcel.pickupLocation?.lng,
                    }}
                    initialDest={{
                      lat: parcel.dropoffLat || parcel.dropoffLocation?.lat,
                      lng: parcel.dropoffLng || parcel.dropoffLocation?.lng,
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Receiver</p>
                    <p className="font-bold text-gray-800">{parcel.receiverName}</p>
                    <p className="text-gray-500">{parcel.recipientAddress}</p>
                  </div>
                  <div className="flex flex-col justify-center rounded-2xl bg-gray-50 p-5">
                    <p className="mb-1 text-xs font-bold text-gray-400 uppercase">Fee</p>
                    <p className="text-xl font-black text-gray-400 line-through">{parcel.estimatedPrice} EGP</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
          <i className="fa-solid fa-ban mb-4 text-5xl"></i>
          <h2 className="text-xl font-bold">No Cancelled Parcels</h2>
        </div>
      )}
    </div>
  );
}
