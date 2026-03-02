'use client';
import { getClass } from '@/services/ApiServices';
import React, { useContext, useEffect, useState } from 'react';
import { getLoginTo } from '../login/login';
import { Switch } from '@heroui/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ICourierTypes } from '../interface/Courier/courierTypes';
import { IUser } from '../interface/userData';

import dynamic from 'next/dynamic';

const TaxiRoutingMap = dynamic(() => import('@/components/TaxiRoutingMap'), { ssr: false });

type calculate = {
  baseFee: number;
  currency: string;
  deliveryFee: number;
  distanceKm: number;
};

type LocationPoint = {
  lat: number;
  lng: number;
  address: string;
};

type TripData = {
  km: number;
  pickup: LocationPoint;
  dest: LocationPoint;
};

export default function Courier() {
  const [courier, setCourier] = useState<ICourierTypes[]>([]);
  const [step, setStep] = useState(0);
  const [parcelType, setParcelType] = useState<string | null>(null);
  const [userData, setUserData] = useState<IUser>();
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [isR, setIsR] = useState(false);
  const [isS, setIsS] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [weight, setWeight] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [maxWeight, setMaxWeight] = useState<number | null>(null);
  const [baseFee, setBaseFee] = useState<number | null>(null);
  const [calculation, setCalculation] = useState<calculate | null>(null);
  const [whoPay, setWhoPay] = useState(false);
  const [senderOrReceiver, setSenderOrReceiver] = useState<'sender' | 'receiver'>('sender');
  const [coupon, setCoupon] = useState<string>('');
  const [isApplied, setIsApplied] = useState(false);
  const [parcelTypeName, setParcelTypeName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wallet' | 'online'>('cash');
  const router = useRouter();

  async function deliveryFee() {
    const token = await getLoginTo();
    const body = {
      parcelTypeId: parcelType,
      pickupLocation: {
        lat: tripData?.pickup.lat,
        lng: tripData?.pickup.lng,
        address: 'Pickup Point',
      },
      dropoffLocation: {
        lat: tripData?.dest.lat,
        lng: tripData?.dest.lng,
        address: 'Destination Point',
      },
      receiverName: receiverName,
      receiverPhone: receiverPhone,
    };
    const data = await getClass.courierDeliveryFee(body, token);
    setCalculation(data);
  }

  async function placeCourierOrder() {
    const token = await getLoginTo();
    const body = {
      parcelType: parcelType,
      parcelTypeString: parcelTypeName,
      pickupLocation: {
        lat: tripData?.pickup.lat,
        lng: tripData?.pickup.lng,
        address: tripData?.pickup.address || 'Unknown Pickup Address',
      },
      dropoffLocation: {
        lat: tripData?.dest.lat,
        lng: tripData?.dest.lng,
        address: tripData?.dest.address || 'Unknown Destination Address',
      },

      pickupLat: tripData?.pickup.lat,
      pickupLng: tripData?.pickup.lng,
      dropoffLat: tripData?.dest.lat,
      dropoffLng: tripData?.dest.lng,
      distanceKm: calculation?.distanceKm,
      receiverName: receiverName,
      receiverPhone: receiverPhone,
      senderName: senderName,
      senderPhone: senderPhone,
      generalNotes: notes,
      estimatedPrice: calculation?.deliveryFee,
      senderAddress: senderAddress,
      recipientAddress: receiverAddress,
      payer: senderOrReceiver,
      paymentMethod: paymentMethod,
    };
    const data = await getClass.placeCourier(token, body);

    const paymentPayload = {
      moduleType: 'parcelBooking',
      moduleId: data.data.documentId || data.data.id,
      amountEgp: calculation?.deliveryFee,
      paymentMethod: paymentMethod,
      couponCode: coupon && coupon.trim() !== '' ? coupon : undefined,
      deliveryFeeEgp: calculation?.deliveryFee,
    };

    const pay = await getClass.universalCheckout(token, paymentPayload);
    router.push('/orders/parcel');
  }

  useEffect(() => {
    async function getCouriers() {
      const token = await getLoginTo();
      const couriers = await getClass.getCourier(token);
      const address = await getClass.getAddress(token);
      const user = await getClass.userProfile(token);
      setUserData(user);
      setCourier(couriers);
    }
    getCouriers();
  }, []);

  return (
    <div className="container mx-auto my-5">
      <h1>Courier</h1>
      {step === 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {courier?.map((courierr: ICourierTypes) => {
            return (
              <div
                onClick={() => {
                  setParcelType(courierr.documentId);
                  setParcelTypeName(courierr.name);
                  setStep(1);
                  setMaxWeight(courierr.maxWeightKg);
                  setBaseFee(courierr.baseFee);
                }}
                key={courierr.id}
                className="my-3 rounded-2xl border-2 p-2 text-center hover:border-black hover:bg-gray-50"
              >
                <h3>{courierr.name}</h3>
                <p className="my-4 truncate text-gray-400">{courierr.description}</p>
                <h4 className="text-red-600">Max weight &lt; {courierr.maxWeightKg}</h4>
                <h4 className="font-bold">{courierr.baseFee} EGP</h4>
              </div>
            );
          })}
        </div>
      )}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-right-4">
          <div className="mb-4 flex items-center gap-3">
            <button onClick={() => setStep(0)} className="rounded-full bg-gray-200 p-2 font-bold">
              ←
            </button>
            <h1 className="text-2xl font-bold">Set Your Route</h1>
          </div>
          <TaxiRoutingMap onRouteFound={(km, pickup, dest) => setTripData({ km, pickup, dest })} />
          <button
            onClick={() => setStep(2)}
            disabled={!tripData}
            className="mt-6 w-full rounded-xl bg-black py-4 font-bold text-white disabled:bg-gray-300"
          >
            {'Confirm Route & View Prices'}
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="grid grid-cols-1 gap-3 rounded-xl border stroke-1 p-2">
            <div className="flex justify-between">
              <h3 className="text-red-500">Reciever Details</h3>
              <Switch onChange={() => setIsR(!isR)} size="sm">
                is you?
              </Switch>
            </div>
            <div className="flex items-center gap-5">
              <h3 className="w-48">Reciever name</h3>
              <input
                type="text"
                value={isR ? userData?.username : receiverName}
                className="rounded-xl border stroke-1 p-2"
                placeholder="ex: Ahmed"
                onChange={(e) => setReceiverName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-5">
              <h3 className="w-48">Reciever phone</h3>
              <input
                type="text"
                minLength={10}
                maxLength={14}
                value={isR ? userData?.phone : receiverPhone}
                className="rounded-xl border stroke-1 p-2"
                placeholder="ex: 010xxxxxxxx"
                onChange={(e) => setReceiverPhone(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-5">
              <h3 className="w-48">Reciever Address</h3>
              <input
                type="text"
                className="rounded-xl border stroke-1 p-2"
                placeholder="ex: building 22, floor 2, apartment 4"
                onChange={(e) => setReceiverAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 rounded-xl border stroke-1 p-2">
            <div className="flex justify-between">
              <h3 className="text-red-500">Sender Details</h3>
              <Switch onChange={() => setIsS(!isS)} size="sm">
                is you?
              </Switch>
            </div>
            <div className="flex items-center gap-5">
              <h3 className="w-48">Sender name</h3>
              <input
                type="text"
                value={isS ? userData?.username : senderName}
                className="rounded-xl border stroke-1 p-2"
                placeholder="ex: Omar"
                onChange={(e) => setSenderName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-5">
              <h3 className="w-48">Sender phone</h3>
              <input
                type="text"
                minLength={10}
                maxLength={14}
                value={isS ? userData?.phone : senderPhone}
                className="rounded-xl border stroke-1 p-2"
                placeholder="ex: 011xxxxxxxx"
                onChange={(e) => setSenderPhone(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-5">
              <h3 className="w-48">Sender address</h3>
              <input
                type="text"
                className="rounded-xl border stroke-1 p-2"
                placeholder="ex: building 65, floor 5, apartment 9"
                onChange={(e) => setSenderAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 rounded-xl border stroke-1 p-2">
            <h3 className="text-red-500">Parcel Details</h3>
            <div className="flex items-center gap-5">
              <h3 className="w-48">Package weight (KG)</h3>
              <input
                type="text"
                onChange={(e) => setWeight(Number(e.target.value))}
                className="rounded-xl border stroke-1 p-2"
                placeholder="ex: 0.5"
              />
            </div>
            <div className="flex items-center gap-5">
              <h3 className="w-48">Notes</h3>
              <input
                type="text"
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-xl border stroke-1 p-2"
                placeholder="ex: must be boxed"
              />
            </div>
            <Switch
              onChange={() => {
                setWhoPay(!whoPay);
                setSenderOrReceiver(senderOrReceiver === 'sender' ? 'receiver' : 'sender');
              }}
              size="sm"
            >
              Who will pay the delivery fee?{' '}
              <span className="font-bold text-green-600">{whoPay ? 'Receiver' : 'Sender'}</span>
            </Switch>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              onChange={(e) => setCoupon(e.target.value)}
              className="rounded-xl border stroke-1 p-2"
              placeholder="ex: FIRSTORDER"
              id=""
            />
            <Button onClick={() => setIsApplied(true)} className="right-0 w-15">
              APPLY
            </Button>
          </div>
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-bold text-gray-800">Select Payment Method</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all ${paymentMethod === 'cash' ? 'border-black bg-gray-50 ring-2 ring-black' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="mb-1 text-xl">💵</span>
                <span className="text-xs font-bold text-gray-800">Cash</span>
              </button>
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all ${paymentMethod === 'wallet' ? 'border-black bg-gray-50 ring-2 ring-black' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="mb-1 text-xl">💳</span>
                <span className="text-xs font-bold text-gray-800">Wallet</span>
                <span className="text-[10px] font-semibold text-gray-500">
                  {userData?.walletBalance.toFixed(2)} EGP
                </span>
              </button>
              <button
                onClick={() => setPaymentMethod('online')}
                className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all ${paymentMethod === 'online' ? 'border-black bg-gray-50 ring-2 ring-black' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="mb-1 text-xl">🌐</span>
                <span className="text-xs font-bold text-gray-800">Pay Online</span>
              </button>
            </div>
          </div>
          {calculation == null ? (
            <Button onClick={() => deliveryFee()}>Calculate delivery fee</Button>
          ) : (
            <div className="rounded-xl bg-green-300 p-2 text-center">
              <h3>
                Delivering this parcel will cost {calculation.deliveryFee} {calculation.currency}
              </h3>
            </div>
          )}
          {
            <Button disabled={calculation === null} onClick={() => placeCourierOrder()}>
              Place Order
            </Button>
          }
        </div>
      )}
    </div>
  );
}
