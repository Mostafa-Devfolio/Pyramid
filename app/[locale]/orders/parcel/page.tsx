'use client';
import { IParcelOrders } from '@/app/[locale]/interface/parcelOrdersInterface';
import { getLoginTo } from '@/app/[locale]/login/login';
import { Button } from '@/components/ui/button';
import { getClass } from '@/services/ApiServices';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const TaxiRoutingMap = dynamic(() => import('@/components/TaxiRoutingMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full animate-pulse items-center justify-center rounded-3xl bg-gray-100 font-bold text-gray-400">
      Initializing Tracking Map...
    </div>
  ),
});

export default function ParcelOrders() {
  const [saveParcel, setSaveParcel] = useState<IParcelOrders[]>([]);

  async function getParcel() {
    const token = await getLoginTo();
    const userData = await getClass.userProfile(token);
    const data = await getClass.getParcel(token, userData?.id);
    const pending = data.filter((par: IParcelOrders) =>
      ['pending', 'accepted', 'picked_up'].includes(par.deliveryStatus)
    );
    setSaveParcel(pending);
  }

  async function cancelOrder(orderId: string) {
    const token = await getLoginTo();
    await getClass.deleteParcelOrder(token, orderId);
    getParcel();
  }

  useEffect(() => {
    async function getParcels() {
      const token = await getLoginTo();
      const userData = await getClass.userProfile(token);
      const data = await getClass.getParcel(token, userData?.id);
      const pending = data.filter((par: IParcelOrders) =>
        ['pending', 'accepted', 'picked_up'].includes(par.deliveryStatus)
      );
      setSaveParcel(pending);
    }
    getParcels();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'picked_up') return 'bg-blue-100 text-blue-700';
    if (status === 'accepted') return 'bg-indigo-100 text-indigo-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="space-y-8">
      {saveParcel.length !== 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {saveParcel.map((parcel: IParcelOrders) => (
            <div
              key={parcel.id}
              className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between border-b border-gray-100 bg-gray-50/50 p-6 sm:px-8">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Parcel ID</span>
                    <p className="text-lg font-black text-gray-900">#{parcel.id}</p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase ${getStatusColor(parcel.deliveryStatus)}`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-current"></span>
                  </span>
                  {parcel.deliveryStatus.replace('_', ' ')}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                  {/* Left Column: Map & Primary Status */}
                  <div className="space-y-6 lg:col-span-7">
                    <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-gray-100 shadow-inner">
                      <TaxiRoutingMap
                        readOnly={true}
                        initialPickup={{
                          lat: parcel.pickupLat || parcel.pickupLocation?.lat,
                          lng: parcel.pickupLng || parcel.pickupLocation?.lng,
                          address: parcel.pickupLocation?.address,
                        }}
                        initialDest={{
                          lat: parcel.dropoffLat || parcel.dropoffLocation?.lat,
                          lng: parcel.dropoffLng || parcel.dropoffLocation?.lng,
                          address: parcel.dropoffLocation?.address,
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="mb-1 text-[10px] font-bold text-gray-400 uppercase">Time</p>
                        <p className="font-bold text-gray-900">{parcel.scheduledAt || 'Now'}</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="mb-1 text-[10px] font-bold text-gray-400 uppercase">Payment</p>
                        <p className="font-bold text-gray-900 uppercase">{parcel.paymentMethod}</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="mb-1 text-[10px] font-bold text-gray-400 uppercase">Payer</p>
                        <p className="font-bold text-gray-900 capitalize">{parcel.payer}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className="flex flex-col justify-between lg:col-span-5">
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-3">
                          <h3 className="flex items-center gap-2 text-sm font-black tracking-wider text-gray-900 uppercase">
                            <i className="fa-solid fa-circle-down text-[10px] text-blue-500"></i> Receiver
                          </h3>
                          <div className="space-y-1 text-sm">
                            <p className="font-bold text-gray-900">{parcel.receiverName}</p>
                            <p className="font-medium text-gray-500">{parcel.receiverPhone}</p>
                            <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                              {parcel.recipientAddress}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h3 className="flex items-center gap-2 text-sm font-black tracking-wider text-gray-900 uppercase">
                            <i className="fa-solid fa-circle-up text-[10px] text-amber-500"></i> Sender
                          </h3>
                          <div className="space-y-1 text-sm">
                            <p className="font-bold text-gray-900">{parcel.senderName}</p>
                            <p className="font-medium text-gray-500">{parcel.senderPhone}</p>
                            <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">{parcel.senderAddress}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
                        <h3 className="mb-4 text-xs font-bold tracking-widest text-slate-400 uppercase">
                          Trip Summary
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-slate-400">Total Distance</span>
                            <span className="font-bold">{parcel.distanceKm} km</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-800 pt-3">
                            <span className="text-base font-bold">Delivery Fee</span>
                            <span className="text-xl font-black text-green-400">{parcel.estimatedPrice} EGP</span>
                          </div>
                        </div>
                        {parcel.generalNotes && (
                          <div className="mt-4 rounded-xl bg-white/5 p-3 text-[11px] text-slate-300 italic">
                            {parcel.generalNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      {parcel.deliveryStatus === 'pending' && (
                        <button
                          onClick={() => cancelOrder(parcel.documentId)}
                          className="rounded-full bg-red-50 px-8 py-3 text-sm font-bold text-red-600 shadow-sm transition-all hover:bg-red-600 hover:text-white active:scale-95"
                        >
                          Cancel Trip
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-24 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-gray-400">
            <i className="fa-solid fa-truck-fast text-3xl"></i>
          </div>
          <h2 className="mb-2 text-2xl font-black text-gray-900">No Active Parcels</h2>
          <p className="mb-6 font-medium text-gray-500">Need to send something? Start a new delivery.</p>
          <Button className="rounded-full px-10 py-5 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95">
            Send Package
          </Button>
        </div>
      )}
    </div>
  );
}
