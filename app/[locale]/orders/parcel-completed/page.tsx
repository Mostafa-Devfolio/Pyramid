'use client';
import { IParcelOrders } from '@/app/[locale]/interface/parcelOrdersInterface';
import { getLoginTo } from '@/app/[locale]/login/login';
import { Button } from '@/components/ui/button';
import { getClass } from '@/services/ApiServices';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const TaxiRoutingMap = dynamic(() => import('@/components/TaxiRoutingMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full animate-pulse rounded-2xl bg-gray-100" />,
});

export default function ParcelCompleted() {
  const [saveParcel, setSaveParcel] = useState<IParcelOrders[]>([]);

  
  useEffect(() => {
    async function getParcel() {
      const token = await getLoginTo();
      const userData = await getClass.userProfile(token);
      const data = await getClass.getParcel(token, userData?.id);
      const delivered = data.filter((par: IParcelOrders) => par.deliveryStatus === 'delivered');
      setSaveParcel(delivered);
    }
    getParcel();
  }, []);

  return (
    <div className="space-y-8">
      {saveParcel.length !== 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {saveParcel.map((parcel: IParcelOrders) => (
            <div
              key={parcel.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-emerald-50 bg-emerald-50/30 p-6 sm:px-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-widest text-emerald-600/60 uppercase">
                    Delivered Parcel
                  </span>
                  <p className="text-lg font-black text-gray-900">#{parcel.id}</p>
                </div>
                <div className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white uppercase shadow-sm">
                  Completed
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-12">
                <div className="lg:col-span-6">
                  <div className="h-64 overflow-hidden rounded-2xl border border-gray-100">
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
                </div>
                <div className="flex flex-col justify-between lg:col-span-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">To</p>
                      <p className="font-bold text-gray-900">{parcel.receiverName}</p>
                      <p className="text-xs text-gray-500">{parcel.recipientAddress}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">From</p>
                      <p className="font-bold text-gray-900">{parcel.senderName}</p>
                      <p className="text-xs text-gray-500">{parcel.senderAddress}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Distance</p>
                      <p className="text-lg font-black text-gray-900">{parcel.distanceKm} km</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase">Total Paid</p>
                      <p className="text-2xl font-black text-emerald-600">{parcel.estimatedPrice} EGP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-300">
            <i className="fa-solid fa-circle-check text-4xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900">No Completed Deliveries</h2>
        </div>
      )}
    </div>
  );
}
