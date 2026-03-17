'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getLoginTo } from '@/app/[locale]/login/login';
import { getClass } from '@/services/ApiServices';
import {
  Car,
  Bus,
  Bike,
  Navigation,
  AlertTriangle,
  Clock,
  CreditCard,
  Wallet,
  Banknote,
  MapPin,
  X,
  MessageSquare,
  Phone,
  ShieldAlert,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';

const TaxiRoutingMap = dynamic(() => import('@/components/TaxiRoutingMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-100 w-full animate-pulse items-center justify-center rounded-[2.5rem] bg-slate-100 font-bold text-slate-400">
      Loading Map...
    </div>
  ),
});

export default function TaxiBookingPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [pricing, setPricing] = useState<any>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wallet' | 'online'>('cash');

  const [vehicle, setVehicle] = useState<'car' | 'motorcycle' | 'bus' | null>(null);
  const [tripData, setTripData] = useState<{ km: number; pickup: any; dest: any } | null>(null);

  const [rideType, setRideType] = useState<'uberX' | 'comfort' | 'indriver'>('uberX');
  const [inDriverOffer, setInDriverOffer] = useState<number | ''>('');

  const [availableBuses, setAvailableBuses] = useState<any[]>([]);
  const [selectedBus, setSelectedBus] = useState<any | null>(null);
  const [isSearchingBuses, setIsSearchingBuses] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');

  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState<{ sender: 'me' | 'driver'; text: string }[]>([]);

  const calculateLiveETA = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    const timeMinutes = Math.ceil((distance / 30) * 60) + 2;
    return { distance: distance.toFixed(1), time: timeMinutes };
  };

  useEffect(() => {
    async function loadData() {
      try {
        const token = await getLoginTo();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const resPricing = await fetch('***REMOVED***/api/pricing-config', { headers });
        const jsonPricing = await resPricing.json();
        if (jsonPricing?.data) setPricing(jsonPricing.data);

        const resWallet = await fetch('***REMOVED***/api/loyalty/me', { headers });
        const jsonWallet = await resWallet.json();
        if (jsonWallet?.data?.walletBalance) setWalletBalance(Number(jsonWallet.data.walletBalance));

        if (token) {
          const resActive = await fetch(
            '***REMOVED***/api/rides?filters[status][$in][0]=pending&filters[status][$in][1]=accepted&filters[status][$in][2]=arrived&filters[status][$in][3]=in_progress&populate=*',
            { headers }
          );
          const jsonActive = await resActive.json();
          if (jsonActive?.data && jsonActive.data.length > 0) {
            const trip = jsonActive.data[0];
            setActiveTrip(trip);
            setVehicle(trip.vehicleType || 'car');
            setTripData({ km: trip.distanceKm || 0, pickup: trip.pickup, dest: trip.destination });
            setStep(4);
          }
        }
      } catch (error: any) {
        setPricingError(error.message);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function updateLocationSurge() {
      if (tripData?.pickup) {
        try {
          const token = await getLoginTo();
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          };
          const res = await fetch(
            `***REMOVED***/api/pricing-config?lat=${tripData.pickup.lat}&lng=${tripData.pickup.lng}`,
            { headers }
          );
          const json = await res.json();
          if (json?.data) setPricing(json.data);
        } catch (error) {
          console.warn('Could not fetch dynamic location surge pricing', error);
        }
      }
    }
    updateLocationSurge();
  }, [tripData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 4 && activeTrip?.documentId) {
      interval = setInterval(async () => {
        try {
          const token = await getLoginTo();
          const res = await fetch(`***REMOVED***/api/rides/${activeTrip.documentId}?populate=*`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const json = await res.json();
          if (json?.data) {
            setActiveTrip(json.data);
            if (json.data.driverLocation) setDriverLocation(json.data.driverLocation);
          }
        } catch (err) {}
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [step, activeTrip?.documentId]);

  const prices = (() => {
    if (!pricing || !tripData) return null;
    const surge = pricing.surgeMultiplier ? Number(pricing.surgeMultiplier) : 1;
    const baseUberX = (pricing.carBaseFee + tripData.km * pricing.carPerKmFee) * surge;

    return {
      car: Math.ceil(baseUberX),
      comfort: Math.ceil((baseUberX + pricing.comfortSurcharge) * surge),
      indriverMin: Math.floor(baseUberX * 0.8),
      indriverMax: Math.ceil(baseUberX * 1.6),
      motorcycle: Math.ceil((pricing.motorcycleBaseFee + tripData.km * pricing.motorcyclePerKmFee) * surge),
    };
  })();

  const targetPrice = (() => {
    if (vehicle === 'bus') return selectedBus?.price || 0;
    if (rideType === 'indriver') return Number(inDriverOffer) || 0;
    if (vehicle === 'car') return rideType === 'comfort' ? prices?.comfort || 0 : prices?.car || 0;
    return prices?.motorcycle || 0;
  })();

  const isWalletInsufficient = paymentMethod === 'wallet' && walletBalance < targetPrice;

  const handleFindBuses = async () => {
    if (!tripData) return;
    setIsSearchingBuses(true);
    setStep(3);
    try {
      const token = await getLoginTo();
      const res = await fetch(
        `***REMOVED***/api/bus-trips/searchNearMe?pickupLat=${tripData.pickup.lat}&pickupLng=${tripData.pickup.lng}&destLat=${tripData.dest.lat}&destLng=${tripData.dest.lng}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      const json = await res.json();
      setAvailableBuses(json.data || []);
    } catch (e) {
      alert('Network error finding buses.');
    } finally {
      setIsSearchingBuses(false);
    }
  };

  const handleRequestRide = async () => {
    const token = await getLoginTo();
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    if (vehicle === 'bus' && selectedBus) {
      try {
        const busId = selectedBus.documentId || selectedBus.id;
        const res = await fetch(`***REMOVED***/api/bus-trips/${busId}/book`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ data: { paymentMethod } }),
        });
        const json = await res.json();
        if (json.error) return alert(`Booking Failed: ${json.error.message}`);

        const payRes = await fetch('***REMOVED***/api/checkout/universal', {
          method: 'POST',
          headers,
          body: JSON.stringify({ moduleType: 'bus', moduleId: json.data.id, amountEgp: targetPrice, paymentMethod }),
        });
        const payJson = await payRes.json();

        if (payJson.error) return alert(`Payment Error: ${payJson.error}`);
        if (paymentMethod === 'online' && payJson.iframeUrl) {
          window.location.href = payJson.iframeUrl;
          return;
        }
        setStep(4);
      } catch (e) {
        alert('Failed to connect to booking server.');
      }
      return;
    }

    const payload = {
      pickup: tripData?.pickup,
      destination: tripData?.dest,
      distanceKm: tripData?.km,
      recommendedPrice: targetPrice,
      finalPrice: targetPrice,
      vehicleType: vehicle,
      rideType: vehicle === 'car' ? rideType : 'uberX',
      userOfferedPrice: rideType === 'indriver' ? Number(inDriverOffer) : null,
      scheduledAt: isScheduled && scheduledTime ? new Date(scheduledTime).toISOString() : null,
      status: 'pending',
    };

    try {
      const res = await fetch('***REMOVED***/api/rides', {
        method: 'POST',
        body: JSON.stringify({ data: payload }),
        headers,
      });
      const json = await res.json();

      if (json.error) return alert(`Backend Error: ${json.error.message}.`);

      if (json.data) {
        setActiveTrip(json.data);
        const payRes = await fetch('***REMOVED***/api/checkout/universal', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            moduleType: 'ride',
            moduleId: json.data.documentId || json.data.id,
            amountEgp: targetPrice,
            paymentMethod,
          }),
        });
        const payJson = await payRes.json();

        if (payJson.error) return alert(`Payment Error: ${payJson.error}`);
        if (paymentMethod === 'online' && payJson.iframeUrl) {
          window.location.href = payJson.iframeUrl;
          return;
        }
        setStep(4);
      }
    } catch (e) {
      alert('Network Error.');
    }
  };

  const handleCancelRide = async () => {
    if (!activeTrip) return;
    const confirmCancel = confirm('Are you sure you want to cancel this request?');
    if (!confirmCancel) return;

    try {
      const token = await getLoginTo();
      const data = await getClass.cancelTrip(token, activeTrip.documentId, activeTrip.id);
      if (data.data) {
        setActiveTrip(null);
        setTripData(null);
        setStep(1);
      } else {
        alert('Could not cancel ride.');
      }
    } catch (err) {
      alert('Network Error while cancelling.');
    }
  };

  const handleSOS = () => alert('🚨 SOS TRIGGERED!');
  const handleSendMessage = () => {
    if (chatMsg.trim()) {
      setMessages([...messages, { sender: 'me', text: chatMsg }]);
      setChatMsg('');
    }
  };

  const isConfirmDisabled =
    (vehicle === 'car' &&
      rideType === 'indriver' &&
      (!inDriverOffer || inDriverOffer < (prices?.indriverMin || 0) || inDriverOffer > (prices?.indriverMax || 0))) ||
    (vehicle === 'bus' && !selectedBus) ||
    isWalletInsufficient ||
    isSearchingBuses;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900 selection:bg-black selection:text-white">
      {step < 4 && (
        <div className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto flex h-20 max-w-2xl items-center justify-between px-4">
            <div className="flex items-center gap-4">
              {step > 1 && (
                <button
                  onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <h1 className="text-2xl font-black tracking-tight">Request a Ride</h1>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2.5 w-8 rounded-full transition-all duration-300 ${step >= s ? 'bg-black' : 'bg-slate-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`mx-auto ${step === 4 ? 'w-full' : 'max-w-2xl px-4 pt-10'}`}>
        {/* STEP 1: Select Vehicle */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-black text-slate-900">What do you need?</h2>
              <p className="font-medium text-slate-500">Select a vehicle type to begin your journey.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  id: 'car',
                  icon: <Car size={32} />,
                  title: 'Car',
                  sub: 'Up to 4 passengers • UberX & InDriver',
                  color: 'blue',
                },
                {
                  id: 'motorcycle',
                  icon: <Bike size={32} />,
                  title: 'Motorcycle',
                  sub: '1 passenger • Beat the traffic',
                  color: 'emerald',
                },
                {
                  id: 'bus',
                  icon: <Bus size={32} />,
                  title: 'Mass Transit Bus',
                  sub: 'Scheduled Routes • Reserve a seat',
                  color: 'amber',
                  badge: 'SWVL STYLE',
                },
              ].map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    setVehicle(v.id as 'car' | 'motorcycle' | 'bus' | null);
                    setStep(2);
                  }}
                  className="group relative flex cursor-pointer items-center gap-6 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-2xl hover:shadow-slate-900/10"
                >
                  {v.badge && (
                    <div className="absolute top-4 right-4 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black tracking-widest text-amber-800 uppercase">
                      {v.badge}
                    </div>
                  )}
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-${v.color}-600 group-hover:text-white`}
                  >
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{v.title}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">{v.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Set Route */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 space-y-6 duration-500">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Set Your Route</h2>
              <p className="mt-1 font-medium text-slate-500">Pin your pickup and drop-off locations.</p>
            </div>

            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-900/10">
              <TaxiRoutingMap onRouteFound={(km, pickup, dest) => setTripData({ km, pickup, dest })} />

              <div className="absolute bottom-6 left-1/2 w-full -translate-x-1/2 px-6">
                <button
                  onClick={vehicle === 'bus' ? handleFindBuses : () => setStep(3)}
                  disabled={!tripData}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-5 text-lg font-black text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:transform-none disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Navigation size={20} /> {vehicle === 'bus' ? 'Find Buses Near Me' : 'Confirm Route'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Finalize / Prices */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 space-y-6 duration-500">
            <h2 className="mb-6 text-3xl font-black text-slate-900">
              {vehicle === 'bus' ? 'Select Bus' : 'Review & Pay'}
            </h2>

            {pricingError ? (
              <div className="flex flex-col items-center gap-3 rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center font-bold text-red-700">
                <AlertTriangle size={32} /> Connection Failed
              </div>
            ) : !prices ? (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-black" />
                <p className="animate-pulse text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Calculating Fares...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Surge Badge */}
                {pricing?.surgeMultiplier > 1 && (
                  <div className="flex items-center gap-4 rounded-3xl border border-orange-200 bg-orange-50 p-6 text-orange-800 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-200 text-orange-600">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black tracking-widest uppercase">High Demand</h4>
                      <p className="mt-1 text-xs font-medium">
                        {pricing.surgeReason || 'Fares are slightly higher in your area right now.'}
                      </p>
                    </div>
                  </div>
                )}

                {vehicle !== 'bus' && (
                  <div className="space-y-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                        Trip Distance
                      </span>
                      <span className="text-lg font-black text-slate-900">{tripData?.km} km</span>
                    </div>

                    {vehicle === 'car' && (
                      <div className="space-y-6 border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">Select Class</h3>
                        <div className="flex rounded-full bg-slate-100 p-1.5">
                          {[
                            { id: 'uberX', label: 'Standard', price: prices.car },
                            { id: 'comfort', label: 'Comfort', price: prices.comfort },
                            { id: 'indriver', label: 'Bid Price', price: null },
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setRideType(t.id as 'uberX' | 'comfort' | 'indriver')}
                              className={`flex-1 rounded-full py-3 text-xs font-black transition-all duration-300 ${rideType === t.id ? 'bg-white text-black shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                              {t.label}
                              {t.price && (
                                <span className="mt-0.5 block text-[10px] font-bold text-slate-400">{t.price} EGP</span>
                              )}
                            </button>
                          ))}
                        </div>

                        {rideType === 'indriver' && (
                          <div className="animate-in fade-in zoom-in-95 space-y-4 rounded-3xl border border-blue-200 bg-blue-50 p-6">
                            <div className="flex items-center justify-between text-sm font-bold text-blue-900">
                              <span>Recommended: {prices.car} EGP</span>
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
                                Range: {prices.indriverMin}-{prices.indriverMax} EGP
                              </span>
                            </div>
                            <input
                              type="number"
                              placeholder="Enter your offer"
                              value={inDriverOffer}
                              onChange={(e) => setInDriverOffer(Number(e.target.value))}
                              className="w-full rounded-2xl border border-blue-200 bg-white p-4 text-center text-xl font-black transition-all outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                          <span className="text-sm font-black text-slate-900">Final Fare</span>
                          <span className="text-3xl font-black text-emerald-500">{targetPrice} EGP</span>
                        </div>
                      </div>
                    )}

                    {vehicle === 'motorcycle' && (
                      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                        <span className="text-sm font-black text-slate-900">Final Fare</span>
                        <span className="text-3xl font-black text-emerald-500">{targetPrice} EGP</span>
                      </div>
                    )}

                    <div className="border-t border-slate-100 pt-6">
                      <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                        <span className="flex items-center gap-2 font-bold text-slate-900">
                          <Clock size={18} /> Schedule for later
                        </span>
                        <input
                          type="checkbox"
                          checked={isScheduled}
                          onChange={(e) => setIsScheduled(e.target.checked)}
                          className="h-5 w-5 accent-black"
                        />
                      </label>
                      {isScheduled && (
                        <input
                          type="datetime-local"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white p-4 font-bold transition-all outline-none focus:ring-2 focus:ring-black"
                        />
                      )}
                    </div>
                  </div>
                )}

                {vehicle === 'bus' && (
                  <div className="space-y-4">
                    {isSearchingBuses ? (
                      <div className="flex flex-col items-center gap-4 rounded-[2.5rem] border border-slate-200 bg-white py-20 text-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-black" />
                        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                          Searching Routes...
                        </span>
                      </div>
                    ) : availableBuses.length === 0 ? (
                      <div className="flex flex-col items-center gap-4 rounded-[2.5rem] border border-red-200 bg-red-50 p-10 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
                          <Bus size={24} />
                        </div>
                        <h3 className="text-xl font-black text-red-700">No Routes Found</h3>
                        <p className="text-sm font-medium text-red-600/70">
                          No buses pass near your route at this time.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {availableBuses.map((bus) => {
                          const isFull = bus.capacity - bus.bookedSeats <= 0;
                          return (
                            <div
                              key={bus.id}
                              onClick={() => !isFull && setSelectedBus(bus)}
                              className={`rounded-[2rem] border-2 p-6 transition-all ${isFull ? 'border-slate-100 bg-slate-50 opacity-60 grayscale' : 'cursor-pointer bg-white hover:-translate-y-1 hover:shadow-xl'} ${selectedBus?.id === bus.id ? 'border-black shadow-lg shadow-black/10' : 'border-slate-100'}`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <span className="mb-3 inline-block rounded-lg bg-slate-900 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase">
                                    Route {bus.tripCode}
                                  </span>
                                  <h4 className="text-xl leading-tight font-black text-slate-900">{bus.routeName}</h4>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-black text-slate-900">{bus.price} EGP</div>
                                  <div
                                    className={`mt-2 inline-block rounded-md px-2 py-1 text-[10px] font-black tracking-widest uppercase ${isFull ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}
                                  >
                                    {isFull ? 'Sold Out' : `${bus.capacity - bus.bookedSeats} Seats`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {(vehicle !== 'bus' || selectedBus) && (
                  <div className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                    <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">Payment Method</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {[
                        { id: 'cash', icon: <Banknote />, label: 'Cash' },
                        { id: 'wallet', icon: <Wallet />, label: 'Wallet', sub: `${walletBalance.toFixed(2)} EGP` },
                        { id: 'online', icon: <CreditCard />, label: 'Online' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setPaymentMethod(p.id as 'cash' | 'wallet' | 'online')}
                          className={`flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${paymentMethod === p.id ? 'border-black bg-slate-900 text-white shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'}`}
                        >
                          <div className="mb-2">{p.icon}</div>
                          <span className="text-xs font-black tracking-wider uppercase">{p.label}</span>
                          {p.sub && (
                            <span
                              className={`mt-1 text-[10px] font-bold ${paymentMethod === p.id ? 'text-slate-300' : 'text-slate-400'}`}
                            >
                              {p.sub}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    {paymentMethod === 'wallet' && isWalletInsufficient && (
                      <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-xs font-bold text-red-600">
                        <AlertTriangle size={16} /> Insufficient wallet balance for this {targetPrice} EGP trip.
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleRequestRide}
                  disabled={isConfirmDisabled}
                  className="w-full rounded-full bg-black py-5 text-xl font-black text-white shadow-2xl shadow-black/20 transition-all hover:scale-[1.02] active:scale-95 disabled:transform-none disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {vehicle === 'bus'
                    ? selectedBus
                      ? `Pay ${selectedBus.price} EGP & Book`
                      : 'Select a Bus Route'
                    : 'Confirm Ride'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Active Ride Dashboard */}
        {step === 4 && (
          <div className="animate-in fade-in fixed inset-0 z-[100] flex h-screen w-full flex-col bg-white">
            {vehicle === 'bus' && !activeTrip ? (
              <div className="flex flex-1 flex-col items-center justify-center bg-emerald-50 p-8 text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="mb-2 text-4xl font-black tracking-tight text-emerald-900">Ticket Confirmed!</h2>
                <p className="mb-10 font-medium text-emerald-700">
                  Payment method: <strong>{paymentMethod.toUpperCase()}</strong>
                </p>
                <button
                  onClick={() => {
                    setStep(1);
                    setActiveTrip(null);
                  }}
                  className="rounded-full bg-emerald-600 px-10 py-4 font-black text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-95"
                >
                  Book Another Ride
                </button>
              </div>
            ) : (
              <>
                {/* Immersive Full Map Area */}
                <div className="relative flex-1 bg-slate-200">
                  <TaxiRoutingMap
                    initialPickup={tripData?.pickup}
                    initialDest={tripData?.dest}
                    driverCoords={driverLocation}
                    readOnly={true}
                  />
                  {/* SOS Button Overlay */}
                  <button
                    onClick={handleSOS}
                    className="absolute top-6 right-6 z-[1000] flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-red-600 shadow-2xl shadow-red-600/50 transition-transform active:scale-90"
                  >
                    <ShieldAlert size={24} className="text-white" />
                  </button>
                </div>

                {/* Bottom Sheet Dashboard */}
                <div className="relative z-[1001] -mt-10 flex flex-col rounded-t-[2.5rem] bg-white p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.15)]">
                  {/* Status Pill */}
                  <div className="mb-8 flex justify-center text-center">
                    {!activeTrip || activeTrip.status === 'pending' ? (
                      <div className="inline-flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50 px-6 py-2 text-sm font-black text-blue-700 shadow-sm">
                        <div className="relative flex h-3 w-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
                        </div>
                        Finding your Captain...
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-6 py-2 text-sm font-black text-emerald-700 shadow-sm">
                        {activeTrip.status === 'accepted' && '✅ Captain is on the way'}
                        {activeTrip.status === 'arrived' && '📍 Captain has arrived!'}
                        {activeTrip.status === 'in_progress' && '🚗 Heading to Destination'}
                      </div>
                    )}
                  </div>

                  {/* Trip Metrics */}
                  <div className="mb-8 grid grid-cols-3 gap-4 border-b border-slate-100 pb-8">
                    <div className="border-r border-slate-100 text-center">
                      <p className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">Distance</p>
                      <p className="text-2xl font-black text-slate-900">
                        {tripData?.km || 0} <span className="text-xs font-bold text-slate-500">km</span>
                      </p>
                    </div>
                    <div className="border-r border-slate-100 text-center">
                      <p className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">Fare</p>
                      <p className="text-2xl font-black text-emerald-500">
                        {activeTrip?.finalPrice || targetPrice} <span className="text-xs font-bold">EGP</span>
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">Time</p>
                      <p className="text-2xl font-black text-slate-900">
                        ~{Math.ceil((tripData?.km || 0) * 2.5)}{' '}
                        <span className="text-xs font-bold text-slate-500">min</span>
                      </p>
                    </div>
                  </div>

                  {/* Driver/Status View */}
                  {!activeTrip || activeTrip.status === 'pending' ? (
                    <div className="mb-8 flex items-center gap-6 rounded-3xl border border-slate-100 bg-slate-50 p-6">
                      <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <Car size={32} className="text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-black text-slate-900">Broadcasting to drivers...</p>
                        <p className="text-sm font-medium text-slate-500">Your request is live.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8 flex items-center gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                      <div className="relative">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400">
                          <User size={32} />
                        </div>
                        <div className="absolute -right-2 -bottom-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-[10px] text-white">
                          ★
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1 text-xl leading-none font-black text-slate-900">
                          {activeTrip.driver?.username || 'Captain Ahmed'}
                        </h4>
                        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                          Nissan Sunny •{' '}
                          <span className="rounded bg-slate-100 px-2 py-0.5 font-black text-black">ط أ ر ٥٦٧٨</span>
                        </p>
                        {driverLocation && tripData?.pickup && activeTrip.status === 'accepted' && (
                          <p className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black tracking-widest text-blue-600 uppercase">
                            {
                              calculateLiveETA(
                                driverLocation.lat,
                                driverLocation.lng,
                                tripData.pickup.lat,
                                tripData.pickup.lng
                              ).time
                            }{' '}
                            mins away
                          </p>
                        )}
                      </div>
                      <button className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Phone size={20} />
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowChat(true)}
                      className="flex flex-2 items-center justify-center gap-3 rounded-full bg-slate-900 py-5 font-black text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 active:scale-95"
                    >
                      <MessageSquare size={20} />{' '}
                      {activeTrip?.status === 'accepted' ? 'Chat with Captain' : 'Message Drivers'}
                    </button>

                    {(!activeTrip || activeTrip.status === 'pending' || activeTrip.status === 'accepted') && (
                      <button
                        onClick={handleCancelRide}
                        className="flex flex-1 items-center justify-center rounded-full bg-red-50 py-5 font-black text-red-600 transition-colors hover:bg-red-100 active:scale-95"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Floating Chat Modal */}
        {showChat && (
          <div className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
            <div className="animate-in slide-in-from-bottom flex h-[80vh] w-full flex-col overflow-hidden rounded-t-[2.5rem] bg-white shadow-2xl duration-300 sm:h-[600px] sm:max-w-md sm:rounded-[2.5rem]">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Driver Chat</h3>
                  <div className="mt-1 flex items-center gap-1.5">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-6">
                <div className="mb-6 text-center">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    End-to-end encrypted
                  </span>
                </div>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[80%] rounded-2xl p-4 text-sm font-medium shadow-sm ${m.sender === 'me' ? 'ml-auto rounded-br-sm bg-blue-600 text-white' : 'mr-auto rounded-bl-sm border border-slate-100 bg-white text-slate-900'}`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 border-t border-slate-100 bg-white p-4">
                <input
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-6 py-4 font-medium transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="rounded-full bg-blue-600 px-6 font-black text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
