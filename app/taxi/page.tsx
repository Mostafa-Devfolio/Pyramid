'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getLoginTo } from '@/app/login/login';
import { getClass } from '@/services/ApiServices';

// Dynamically load the map so it only runs on the client
const TaxiRoutingMap = dynamic(() => import('@/components/TaxiRoutingMap'), { ssr: false });

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

  // Calculate Live ETA
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

  // 1. Initial Data Load (Pricing, Wallet, Active Trips)
  useEffect(() => {
    async function loadData() {
      try {
        const token = await getLoginTo();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const resPricing = await fetch('https://pyramid.devfolio.net/api/pricing-config', { headers });
        const jsonPricing = await resPricing.json();
        if (jsonPricing?.data) setPricing(jsonPricing.data);

        const resWallet = await fetch('https://pyramid.devfolio.net/api/loyalty/me', { headers });
        const jsonWallet = await resWallet.json();
        if (jsonWallet?.data?.walletBalance) setWalletBalance(Number(jsonWallet.data.walletBalance));

        if (token) {
          const resActive = await fetch(
            'https://pyramid.devfolio.net/api/rides?filters[status][$in][0]=pending&filters[status][$in][1]=accepted&filters[status][$in][2]=arrived&filters[status][$in][3]=in_progress&populate=*',
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

  // 🟢 2. DYNAMIC LOCATION SURGE (Weather specific to pickup location)
  useEffect(() => {
    async function updateLocationSurge() {
      if (tripData?.pickup) {
        try {
          const token = await getLoginTo();
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const res = await fetch(
            `https://pyramid.devfolio.net/api/pricing-config?lat=${tripData.pickup.lat}&lng=${tripData.pickup.lng}`,
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

  // Live Polling
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 4 && activeTrip?.documentId) {
      interval = setInterval(async () => {
        try {
          const token = await getLoginTo();
          const res = await fetch(`https://pyramid.devfolio.net/api/rides/${activeTrip.documentId}?populate=*`, {
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

  // 🟢 APPLY SURGE MULTIPLIER TO PRICES
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
        `https://pyramid.devfolio.net/api/bus-trips/searchNearMe?pickupLat=${tripData.pickup.lat}&pickupLng=${tripData.pickup.lng}&destLat=${tripData.dest.lat}&destLng=${tripData.dest.lng}`,
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
        const res = await fetch(`https://pyramid.devfolio.net/api/bus-trips/${busId}/book`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ data: { paymentMethod } }),
        });
        const json = await res.json();
        if (json.error) return alert(`Booking Failed: ${json.error.message}`);

        const payRes = await fetch('https://pyramid.devfolio.net/api/checkout/universal', {
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
      const res = await fetch('https://pyramid.devfolio.net/api/rides', {
        method: 'POST',
        body: JSON.stringify({ data: payload }),
        headers,
      });
      const json = await res.json();

      if (json.error) return alert(`Backend Error: ${json.error.message}.`);

      if (json.data) {
        setActiveTrip(json.data);

        const payRes = await fetch('https://pyramid.devfolio.net/api/checkout/universal', {
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
      const data = await getClass.cancelTrip(token, activeTrip.documentId, activeTrip.id)

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
    <div className="container mx-auto min-h-screen max-w-md bg-gray-50 px-4 pt-4 pb-24 sm:min-h-full sm:max-w-full">
      {step < 4 && (
        <div className="mb-6 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-black' : 'bg-gray-200'}`} />
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-right-4">
          <h1 className="mb-6 text-2xl font-bold">What do you need?</h1>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div
              onClick={() => {
                setVehicle('car');
                setStep(2);
              }}
              className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:border-black"
            >
              <div className="text-4xl">🚗</div>
              <div>
                <h3 className="text-lg font-bold">Car</h3>
                <p className="text-sm text-gray-500">Up to 4 passengers • UberX & InDriver</p>
              </div>
            </div>
            <div
              onClick={() => {
                setVehicle('motorcycle');
                setStep(2);
              }}
              className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:border-black"
            >
              <div className="text-4xl">🏍️</div>
              <div>
                <h3 className="text-lg font-bold">Motorcycle</h3>
                <p className="text-sm text-gray-500">1 passenger • Beat the traffic</p>
              </div>
            </div>
            <div
              onClick={() => {
                setVehicle('bus');
                setStep(2);
              }}
              className="relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:border-black"
            >
              <div className="absolute -top-4 -right-4 origin-bottom-left rotate-45 transform bg-blue-100 px-6 py-1 text-[10px] font-bold text-blue-800 shadow-sm">
                SWVL STYLE
              </div>
              <div className="text-4xl">🚌</div>
              <div>
                <h3 className="text-lg font-bold">Mass Transit Bus</h3>
                <p className="text-sm text-gray-500">Scheduled Routes • Reserve a seat</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4">
          <div className="mb-4 flex items-center gap-3">
            <button onClick={() => setStep(1)} className="rounded-full bg-gray-200 p-2 font-bold">
              ←
            </button>
            <h1 className="text-2xl font-bold">Set Your Route</h1>
          </div>
          <TaxiRoutingMap onRouteFound={(km, pickup, dest) => setTripData({ km, pickup, dest })} />
          <button
            onClick={vehicle === 'bus' ? handleFindBuses : () => setStep(3)}
            disabled={!tripData}
            className="mt-6 w-full rounded-xl bg-black py-4 font-bold text-white disabled:bg-gray-300"
          >
            {vehicle === 'bus' ? 'Find Buses Near Me' : 'Confirm Route & View Prices'}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-4">
          <div className="mb-4 flex items-center gap-3">
            <button onClick={() => setStep(2)} className="rounded-full bg-gray-200 p-2 font-bold">
              ←
            </button>
            <h1 className="text-2xl font-bold">{vehicle === 'bus' ? 'Select Bus & Pay' : 'Finalize Ride'}</h1>
          </div>

          {pricingError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              ⚠️ Connection Failed
            </div>
          ) : !prices ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
              Loading...
            </div>
          ) : (
            <>
              {/* 🟢 SURGE PRICING BADGE */}
              {pricing?.surgeMultiplier > 1 && (
                <div className="mb-4 flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 p-3 text-orange-800">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h4 className="text-sm font-bold">Fares are currently higher</h4>
                    <p className="text-xs">{pricing.surgeReason || 'High demand in this area.'}</p>
                  </div>
                </div>
              )}

              {vehicle !== 'bus' && (
                <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between text-lg">
                    <span className="font-semibold text-gray-500">Distance</span>
                    <span className="font-bold">{tripData?.km} km</span>
                  </div>

                  {vehicle === 'car' && (
                    <div className="border-t pt-4">
                      <h3 className="mb-3 font-bold">Service Class</h3>
                      <div className="mb-4 flex gap-2">
                        <button
                          onClick={() => setRideType('uberX')}
                          className={`flex-1 rounded-lg py-2 text-sm font-bold ${rideType === 'uberX' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          UberX
                        </button>
                        <button
                          onClick={() => setRideType('comfort')}
                          className={`flex-1 rounded-lg py-2 text-sm font-bold ${rideType === 'comfort' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          Comfort
                        </button>
                        <button
                          onClick={() => setRideType('indriver')}
                          className={`flex-1 rounded-lg py-2 text-sm font-bold ${rideType === 'indriver' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          Bid Price
                        </button>
                      </div>

                      {rideType === 'indriver' && (
                        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                          <p className="mb-2 text-sm font-semibold text-blue-800">
                            Recommended: {prices.car} EGP <br />
                            <span className="text-xs font-normal">
                              (Range: {prices.indriverMin} - {prices.indriverMax} EGP)
                            </span>
                          </p>
                          <input
                            type="number"
                            placeholder="Enter your offer"
                            value={inDriverOffer}
                            onChange={(e) => setInDriverOffer(Number(e.target.value))}
                            className="w-full rounded-lg border border-blue-200 p-3 outline-none"
                          />
                        </div>
                      )}
                      <div className="mt-3 rounded-lg border border-green-100 bg-green-50 p-2 text-center text-md font-bold text-green-600">Your Trip will Cost{targetPrice} EGP.</div>
                    </div>
                  )}

                  <div className="mt-2 border-t pt-4">
                    <label className="mb-3 flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isScheduled}
                        onChange={(e) => setIsScheduled(e.target.checked)}
                        className="h-5 w-5 rounded text-black"
                      />
                      <span className="font-bold text-gray-800">Schedule for later</span>
                    </label>
                    {isScheduled && (
                      <input
                        type="datetime-local"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 p-3 outline-none"
                      />
                    )}
                  </div>
                </div>
              )}

              {vehicle === 'bus' && (
                <div className="mb-6 space-y-4">
                  {isSearchingBuses ? (
                    <div className="py-10 text-center">
                      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
                      Searching routes...
                    </div>
                  ) : availableBuses.length === 0 ? (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center font-bold text-red-700">
                      No buses pass near your route at this time.
                    </div>
                  ) : (
                    availableBuses.map((bus) => {
                      const isFull = bus.capacity - bus.bookedSeats <= 0;
                      return (
                        <div
                          key={bus.id}
                          onClick={() => !isFull && setSelectedBus(bus)}
                          className={`rounded-2xl border p-4 transition-all ${isFull ? 'bg-gray-50 opacity-60' : 'cursor-pointer'} ${selectedBus?.id === bus.id ? 'border-black bg-blue-50 ring-2 ring-black' : 'bg-white hover:border-gray-300'}`}
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <span className="mb-2 inline-block rounded bg-black px-2 py-1 text-xs font-bold text-white">
                                {bus.tripCode}
                              </span>
                              <h4 className="text-lg leading-none font-bold text-gray-800">{bus.routeName}</h4>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold">{bus.price} EGP</div>
                              <div className={`mt-1 text-xs font-bold ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                                {isFull ? 'Full Capacity' : `${bus.capacity - bus.bookedSeats} Seats Left`}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {(vehicle !== 'bus' || selectedBus) && (
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
                      <span className="text-[10px] font-semibold text-gray-500">{walletBalance.toFixed(2)} EGP</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('online')}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all ${paymentMethod === 'online' ? 'border-black bg-gray-50 ring-2 ring-black' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <span className="mb-1 text-xl">🌐</span>
                      <span className="text-xs font-bold text-gray-800">Pay Online</span>
                    </button>
                  </div>
                  {paymentMethod === 'wallet' && isWalletInsufficient && (
                    <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-2 text-center text-xs font-bold text-red-600">
                      Insufficient wallet balance for this {targetPrice} EGP trip.
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleRequestRide}
                disabled={isConfirmDisabled}
                className="w-full rounded-xl bg-black py-4 text-lg font-bold text-white shadow-lg disabled:bg-gray-300"
              >
                {vehicle === 'bus'
                  ? selectedBus
                    ? `Pay ${selectedBus.price} EGP & Book`
                    : 'Select a Bus Route'
                  : 'Confirm Ride'}
              </button>
            </>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="animate-in fade-in slide-in-from-right-4 -mx-4 -mt-4">
          {vehicle === 'bus' && !activeTrip ? (
            <div className="pt-10 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <span className="text-4xl">🎫</span>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-green-700">Ticket Confirmed!</h2>
              <p className="mb-6 text-gray-500">
                Payment method: <strong>{paymentMethod.toUpperCase()}</strong>
              </p>
            </div>
          ) : (
            <div className="flex h-screen flex-col">
              <div className="relative flex-1 bg-gray-200">
                <TaxiRoutingMap
                  initialPickup={tripData?.pickup}
                  initialDest={tripData?.dest}
                  driverCoords={driverLocation}
                  readOnly={true}
                />
                <button
                  onClick={handleSOS}
                  className="absolute top-4 right-4 z-[1000] flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-red-600 font-bold text-white shadow-2xl"
                >
                  SOS
                </button>
              </div>

              <div className="relative z-[1001] -mt-6 rounded-t-3xl border-t border-gray-100 bg-white p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.15)]">
                <div className="mb-6 text-center">
                  {!activeTrip || activeTrip.status === 'pending' ? (
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-700">
                      <div className="h-2 w-2 animate-ping rounded-full bg-blue-600" /> Finding your Captain...
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-bold text-green-700">
                      {activeTrip.status === 'accepted' && '✅ Captain is on the way'}
                      {activeTrip.status === 'arrived' && '📍 Captain has arrived!'}
                      {activeTrip.status === 'in_progress' && '🚗 Heading to Destination'}
                    </div>
                  )}
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4 border-b pb-6">
                  <div className="border-r text-center">
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Distance</p>
                    <p className="text-lg font-black">
                      {tripData?.km || 0} <span className="text-xs font-bold text-gray-500">km</span>
                    </p>
                  </div>
                  <div className="border-r text-center">
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Total Fare</p>
                    <p className="text-lg font-black text-green-600">
                      {activeTrip?.finalPrice || targetPrice} <span className="text-xs font-bold">EGP</span>
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Trip Time</p>
                    <p className="text-lg font-black">
                      ~{Math.ceil((tripData?.km || 0) * 2.5)}{' '}
                      <span className="text-xs font-bold text-gray-500">min</span>
                    </p>
                  </div>
                </div>

                {!activeTrip || activeTrip.status === 'pending' ? (
                  <div className="mb-6 flex items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
                    <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-gray-200 text-xl">
                      🚕
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-700">Broadcasting to drivers...</p>
                      <p className="text-xs text-gray-500">Your request is live.</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-300 text-3xl">
                        🧑🏽‍✈️
                      </div>
                      <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg leading-tight font-bold">
                        {activeTrip.driver?.username || 'Captain Ahmed'}
                      </h4>
                      <p className="text-xs font-medium text-gray-500">
                        Nissan Sunny • <span className="font-bold text-black">ط أ ر ٥٦٧٨</span>
                      </p>
                      {driverLocation && tripData?.pickup && activeTrip.status === 'accepted' && (
                        <p className="mt-1 text-[11px] font-bold tracking-tight text-blue-600 uppercase">
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
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowChat(true)}
                    className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-black py-4 font-bold text-white transition-colors hover:bg-gray-800"
                  >
                    <span className="text-xl">💬</span>{' '}
                    {activeTrip?.status === 'accepted' ? 'Chat with Captain' : 'Message Drivers'}
                  </button>

                  {(!activeTrip || activeTrip.status === 'pending' || activeTrip.status === 'accepted') && (
                    <button
                      onClick={handleCancelRide}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-100 py-4 font-bold text-red-600 transition-colors hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showChat && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/60">
          <div className="animate-in slide-in-from-bottom flex h-[70vh] w-full max-w-md flex-col rounded-t-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 className="text-lg font-bold">Chat with Driver</h3>
                <p className="text-xs font-bold text-green-600">Online</p>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-5">
              <div className="mb-4 text-center text-xs text-gray-400">Messages are end-to-end encrypted</div>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] rounded-2xl p-3 ${m.sender === 'me' ? 'ml-auto rounded-br-sm bg-black text-white' : 'mr-auto rounded-bl-sm border border-gray-200 bg-white text-black'}`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t bg-white p-4">
              <input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="rounded-xl bg-black px-6 font-bold text-white transition-colors hover:bg-gray-800"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
