'use client';
import { IParcelOrders } from '@/app/interface/parcelOrdersInterface';
import { getLoginTo } from '@/app/login/login';
import { Button } from '@/components/ui/button';
import { authContext } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const TaxiRoutingMap = dynamic(() => import('@/components/TaxiRoutingMap'), {
  ssr: false,
  loading: () => <div className="flex h-[500px] w-full items-center justify-center rounded-2xl bg-gray-100 animate-pulse">Loading Map...</div>
});

export default function ParcelOrders() {
  const [saveParcel, setSaveParcel] = useState([]);

  async function getParcel() {
    const token = await getLoginTo();
    const userData = await getClass.userProfile(token);
    console.log('object', userData);
    const data = await getClass.getParcel(token, userData?.id);
    const pending = data.filter(
      (par: IParcelOrders) =>
        par.deliveryStatus == 'pending' || par.deliveryStatus == 'accepted' || par.deliveryStatus == 'picked_up'
    );
    setSaveParcel(pending);
  }

  async function cancelOrder(orderId: string) {
    const token = await getLoginTo();
    const userData = await getClass.userProfile(token);
    const data = await getClass.deleteParcelOrder(token, orderId);
    getParcel();
  }

  useEffect(() => {
    getParcel();
  }, []);
  return (
    <div className="">
      {saveParcel.length != 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-3">
          {saveParcel.map((parcel: IParcelOrders) => {
            return (
              <div key={parcel.id}>
                {(parcel.deliveryStatus == 'pending' ||
                  parcel.deliveryStatus == 'accepted' ||
                  parcel.deliveryStatus == 'picked_up') && (
                    <div className="grid grid-cols-2 rounded-xl border stroke-1 p-4 gap-6">
                      <div>
                        <h4>
                          Order Id: <span className="text-green-600">{parcel.id}</span>
                        </h4>
                        <h4>
                          Order Status: <span className="text-green-600">{parcel.deliveryStatus}</span>
                        </h4>
                        <h4>
                          Delivery Time:{' '}
                          <span className="text-green-600">
                            {parcel.scheduledAt == null ? 'Now' : parcel.scheduledAt}
                          </span>
                        </h4>
                        <h4>
                          Payment Method: <span className="text-green-600">{parcel.paymentMethod}</span>
                        </h4>
                        <h4>
                          Payment Status: <span className="text-green-600">{parcel.paymentStatus}</span>
                        </h4>
                        <h4>
                          Who pays the order? <span className="text-green-600">{parcel.payer}</span>
                        </h4>
                        <div className="h-64 my-5">
                        <TaxiRoutingMap 
                          readOnly={true}
                          initialPickup={{ 
                            lat: parcel.pickupLat || parcel.pickupLocation?.lat, 
                            lng: parcel.pickupLng || parcel.pickupLocation?.lng,
                            address: parcel.pickupLocation?.address
                          }}
                          initialDest={{ 
                            lat: parcel.dropoffLat || parcel.dropoffLocation?.lat, 
                            lng: parcel.dropoffLng || parcel.dropoffLocation?.lng,
                            address: parcel.dropoffLocation?.address
                          }}
                        />
                      </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="">
                          <h3>Receiver Details</h3>
                          <h4>
                            Receiver Name: <span className="text-green-600">{parcel.receiverName}</span>
                          </h4>
                          <h4>
                            Receiver Phone: <span className="text-green-600">{parcel.receiverPhone}</span>
                          </h4>
                          <h4>
                            Receiver Address: <span className="text-green-600">{parcel.recipientAddress}</span>
                          </h4>
                        </div>
                        <div className="">
                          <h3>Sender Details</h3>
                          <h4>
                            Sender Name: <span className="text-green-600">{parcel.senderName}</span>
                          </h4>
                          <h4>
                            Sender Phone: <span className="text-green-600">{parcel.senderPhone}</span>
                          </h4>
                          <h4>
                            Sender Address: <span className="text-green-600">{parcel.senderAddress}</span>
                          </h4>
                        </div>
                        <div className="">
                          <h3>Trip Details</h3>
                          <h4>
                            Distance Km: <span className="text-green-600">{parcel.distanceKm} km</span>
                          </h4>
                          <h4>
                            Delivery Fee: <span className="text-green-600">{parcel.estimatedPrice} EGP</span>
                          </h4>
                          <h4>
                            Notes: <span className="text-green-600">{parcel.generalNotes}</span>
                          </h4>
                        </div>
                      </div>
                      <div className=""></div>
                      <div className="my-5">
                        {parcel.deliveryStatus == 'pending' && (
                          <Button onClick={() => cancelOrder(parcel.documentId)}>Cancel</Button>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3">
          <h2>No Parcel Processing Orders!</h2>
          <Button>Shop Now</Button>
        </div>
      )}
    </div>
  );
}
