'use client';
import { getClass } from '@/services/ApiServices';
import React, { useEffect, useState } from 'react';
import { getLoginTo } from '../login/login';
import { Switch } from '@heroui/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ICourierTypes } from '../interface/Courier/courierTypes';
import { IUser } from '../interface/userData';
import {
  Package,
  MapPin,
  Navigation,
  User,
  ArrowRight,
  Wallet,
  CreditCard,
  Banknote,
  ChevronLeft,
  Truck,
  CheckCircle2,
  Tag,
} from 'lucide-react';
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
      pickupLocation: { lat: tripData?.pickup.lat, lng: tripData?.pickup.lng, address: 'Pickup Point' },
      dropoffLocation: { lat: tripData?.dest.lat, lng: tripData?.dest.lng, address: 'Destination Point' },
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

    await getClass.universalCheckout(token, paymentPayload);
    router.push('/orders/parcel');
  }

  useEffect(() => {
    async function getCouriers() {
      const token = await getLoginTo();
      const couriers = await getClass.getCourier(token);
      await getClass.getAddress(token); // Executed in original code
      const user = await getClass.userProfile(token);
      setUserData(user);
      setCourier(couriers);
    }
    getCouriers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <h1 className="text-2xl font-black tracking-tight">Send a Parcel</h1>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            {[
              { id: 0, label: 'Package Type' },
              { id: 1, label: 'Route' },
              { id: 2, label: 'Details' },
            ].map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 text-sm font-bold transition-colors ${step >= s.id ? 'text-blue-600' : 'text-slate-400'}`}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step > s.id ? 'bg-blue-600 text-white' : step === s.id ? 'border-2 border-blue-600' : 'border-2 border-slate-300'}`}
                  >
                    {step > s.id ? <CheckCircle2 size={14} /> : s.id + 1}
                  </div>
                  {s.label}
                </div>
                {s.id !== 2 && <div className={`h-[2px] w-6 ${step > s.id ? 'bg-blue-600' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-10">
        {/* STEP 0: Select Parcel Type */}
        {step === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-4xl font-black text-slate-900">What are you sending?</h2>
              <p className="font-medium text-slate-500">
                Select the package type that best matches your item&apos;s size and weight. This helps us assign the
                right vehicle.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courier?.map((courierr: ICourierTypes) => (
                <div
                  key={courierr.id}
                  onClick={() => {
                    setParcelType(courierr.documentId);
                    setParcelTypeName(courierr.name);
                    setStep(1);
                    setMaxWeight(courierr.maxWeightKg);
                    setBaseFee(courierr.baseFee);
                  }}
                  className="group relative flex cursor-pointer flex-col items-start gap-4 rounded-[2.5rem] border-2 border-slate-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-900/10"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Package size={32} />
                  </div>
                  <div className="w-full">
                    <h3 className="mb-2 text-2xl font-black text-slate-900">{courierr.name}</h3>
                    <p className="mb-6 line-clamp-2 h-10 text-sm font-medium text-slate-500">{courierr.description}</p>
                    <div className="flex w-full items-end justify-between border-t border-slate-100 pt-6">
                      <div>
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Max Weight
                        </span>
                        <p className="text-sm font-bold text-slate-700">{courierr.maxWeightKg} KG</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Base Fee
                        </span>
                        <p className="text-lg font-black text-blue-600">{courierr.baseFee} EGP</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Set Route */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 space-y-6 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Set Your Route</h2>
                <p className="mt-1 font-medium text-slate-500">Pin your pickup and drop-off locations.</p>
              </div>
            </div>

            <div className="relative h-[600px] w-full overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-900/10">
              <TaxiRoutingMap onRouteFound={(km, pickup, dest) => setTripData({ km, pickup, dest })} />

              <div className="absolute bottom-6 left-1/2 w-full max-w-sm -translate-x-1/2 px-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={!tripData}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-5 text-lg font-black text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:transform-none disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Navigation size={20} /> Confirm Route
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Details & Checkout */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 grid grid-cols-1 items-start gap-8 duration-500 lg:grid-cols-12">
            {/* Left Column: Form Details */}
            <div className="space-y-8 lg:col-span-7">
              {/* Sender Details */}
              <section className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="flex items-center gap-3 text-xl font-black text-slate-900">
                    <User className="text-blue-500" /> Sender Details
                  </h3>
                  <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                    <span className="text-xs font-bold tracking-widest text-slate-600 uppercase">Is this you?</span>
                    <Switch onChange={() => setIsS(!isS)} size="sm" color="primary" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="pl-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={isS ? userData?.username : senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Omar"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="pl-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Sender Phone
                    </label>
                    <input
                      type="text"
                      minLength={10}
                      maxLength={14}
                      value={isS ? userData?.phone : senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                      placeholder="011xxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="pl-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Detailed Address
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setSenderAddress(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Building 65, Floor 5, Apt 9"
                    />
                  </div>
                </div>
              </section>

              {/* Receiver Details */}
              <section className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="flex items-center gap-3 text-xl font-black text-slate-900">
                    <MapPin className="text-emerald-500" /> Receiver Details
                  </h3>
                  <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                    <span className="text-xs font-bold tracking-widest text-slate-600 uppercase">Is this you?</span>
                    <Switch onChange={() => setIsR(!isR)} size="sm" color="primary" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="pl-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Receiver Name
                    </label>
                    <input
                      type="text"
                      value={isR ? userData?.username : receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Ahmed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="pl-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Receiver Phone
                    </label>
                    <input
                      type="text"
                      minLength={10}
                      maxLength={14}
                      value={isR ? userData?.phone : receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                      placeholder="010xxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="pl-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Detailed Address
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setReceiverAddress(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Building 22, Floor 2, Apt 4"
                    />
                  </div>
                </div>
              </section>

              {/* Parcel Settings */}
              <section className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="flex items-center gap-3 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                  <Package className="text-amber-500" /> Package Specifics
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="pl-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Weight (KG)
                    </label>
                    <input
                      type="number"
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 0.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="pl-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Notes to Driver
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Fragile, Handle with care"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <span className="text-sm font-black text-amber-900">Who will pay the delivery fee?</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${!whoPay ? 'text-amber-700' : 'text-slate-400'}`}>Sender</span>
                    <Switch
                      onChange={() => {
                        setWhoPay(!whoPay);
                        setSenderOrReceiver(senderOrReceiver === 'sender' ? 'receiver' : 'sender');
                      }}
                      size="sm"
                      color="warning"
                    />
                    <span className={`text-xs font-bold ${whoPay ? 'text-amber-700' : 'text-slate-400'}`}>
                      Receiver
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Checkout & Summary */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
              {/* Payment Selection Card */}
              <div className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="border-b border-slate-100 pb-4 text-lg font-black text-slate-900">Payment Method</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'cash', label: 'Cash on Delivery', icon: <Banknote size={20} />, color: 'emerald' },
                    {
                      id: 'wallet',
                      label: 'Prism Wallet',
                      icon: <Wallet size={20} />,
                      sub: `${userData?.walletBalance.toFixed(2)} EGP`,
                      color: 'slate',
                    },
                    { id: 'online', label: 'Pay Online', icon: <CreditCard size={20} />, color: 'blue' },
                  ].map((pay) => (
                    <label
                      key={pay.id}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all ${paymentMethod === pay.id ? `border-${pay.color}-500 bg-${pay.color}-50/30` : 'border-slate-100 bg-white hover:border-slate-300'}`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          value={pay.id}
                          checked={paymentMethod === pay.id}
                          onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'wallet' | 'online')}
                          className="hidden"
                        />
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${paymentMethod === pay.id ? `bg-${pay.color}-600 text-white shadow-md` : 'bg-slate-100 text-slate-500'}`}
                        >
                          {pay.icon}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{pay.label}</p>
                          {pay.sub && <p className="text-[10px] font-black text-slate-400 uppercase">{pay.sub}</p>}
                        </div>
                      </div>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${paymentMethod === pay.id ? `border-${pay.color}-600` : 'border-slate-300'}`}
                      >
                        {paymentMethod === pay.id && <div className={`h-2.5 w-2.5 rounded-full bg-${pay.color}-600`} />}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        onChange={(e) => setCoupon(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Promo Code"
                      />
                    </div>
                    <button
                      onClick={() => setIsApplied(true)}
                      className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
                    >
                      Apply
                    </button>
                  </div>
                  {isApplied && coupon && (
                    <p className="mt-2 pl-2 text-[10px] font-bold tracking-widest text-emerald-600 uppercase">
                      Coupon Applied
                    </p>
                  )}
                </div>
              </div>

              {/* Order Summary & Submission */}
              <div className="space-y-6 rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
                {calculation === null ? (
                  <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                      <Truck size={24} />
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                      We need to calculate your delivery fee based on the provided route.
                    </p>
                    <button
                      onClick={deliveryFee}
                      className="w-full rounded-full bg-blue-600 py-4 font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
                    >
                      Calculate Delivery Fee
                    </button>
                  </div>
                ) : (
                  <div className="animate-in fade-in zoom-in-95 space-y-6 duration-300">
                    <h3 className="border-b border-slate-800 pb-4 text-xs font-black tracking-[0.2em] text-slate-400 uppercase">
                      Trip Summary
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-slate-300">
                        <span>Route Distance</span>
                        <span className="font-bold text-white">{calculation.distanceKm} km</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Package Type</span>
                        <span className="font-bold text-white">{parcelTypeName}</span>
                      </div>
                    </div>
                    <div className="flex items-end justify-between border-t border-slate-800 pt-6">
                      <span className="text-lg font-bold">Total Fee</span>
                      <span className="text-4xl font-black text-emerald-400">
                        {calculation.deliveryFee}{' '}
                        <span className="text-lg text-emerald-600">{calculation.currency}</span>
                      </span>
                    </div>
                    <button
                      onClick={placeCourierOrder}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-5 text-lg font-black text-white shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
                    >
                      Place Order <ArrowRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
