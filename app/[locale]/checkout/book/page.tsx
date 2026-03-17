'use client';
import { FacilitiesCategory, IProperty } from '@/app/[locale]/interface/property';
import { baseURL } from '@/app/[locale]/page';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Star,
  ShieldCheck,
  CreditCard,
  User,
  Plane,
  Car,
  Clock,
  Banknote,
  Wallet,
  ChevronRight,
  CheckCircle2,
  Briefcase,
} from 'lucide-react';
import { showToast } from 'nextjs-toast-notify';

export default function CheckoutBooking() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const property = searchParams.get('property');
  const userParam = searchParams.get('user');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const totalAmount = searchParams.get('totalAmount');
  const status = searchParams.get('status');
  const roomTypeId = searchParams.get('roomTypeId');
  const rateId = searchParams.get('rateId');
  const quantity = searchParams.get('quantity') || '1';
  const price = searchParams.get('price');
  const mealPlan = searchParams.get('mealPlan');
  const propertyId = searchParams.get('propertyId');
  const days = searchParams.get('days');
  const adult = searchParams.get('adults');
  const children = searchParams.get('children');
  const roomType = searchParams.get('roomType');

  const [propertyStore, setPropertyStore] = useState<IProperty>();
  const [userProfile, setUserProfile] = useState();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Egypt');
  const [bookingFor, setBookingFor] = useState('main');
  const [travelForWork, setTravelForWork] = useState('no');
  const [paperless, setPaperless] = useState(true);

  const [airportShuttle, setAirportShuttle] = useState(false);
  const [rentalCar, setRentalCar] = useState(false);
  const [airportTaxi, setAirportTaxi] = useState(false);
  const [specialRequestsText, setSpecialRequestsText] = useState('');
  const [arrivalTime, setArrivalTime] = useState("I don't know");

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wallet' | 'online'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedTaxes = totalAmount ? (Number(totalAmount) * 0.14).toFixed(2) : '0.00';
  const subtotal = totalAmount ? (Number(totalAmount) - Number(estimatedTaxes)).toFixed(2) : '0.00';

  useEffect(() => {
    async function getProperty() {
      if (propertyId) {
        const data = await getClass.getGeneralProperty(propertyId);
        setPropertyStore(data.data);
      }
    }
    getProperty();
  }, [propertyId]);

  useEffect(() => {
    async function fetchUser() {
      if (token) {
        const user = await getClass.userProfile(token);
        if (user) {
          setUserProfile(user);
          setFirstName(user.firstName || '');
          setLastName(user.lastName || '');
          setEmail(user.email || '');
          setPhone(user.phone || '');
        }
      }
    }
    fetchUser();
  }, [token]);

  async function goToBooking() {
    router.push(
      `/bookings/${propertyStore?.slug}?id=${propertyId}&checkin=${checkInDate}&checkout=${checkOutDate}&adults=${adult}&children=${children}`
    );
  }

  async function checkoutBooking() {
    if (!token) return;
    if (!firstName || !lastName || !email || !phone) {
      showToast.error('Please fill in your required contact details (*).', { position: 'bottom-right' });
      return;
    }

    setIsSubmitting(true);

    const body = {
      property: property,
      user: userParam || userProfile?.documentId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      totalAmount: Number(totalAmount),
      status: 'pending',
      guestFirstName: firstName,
      guestLastName: lastName,
      guestEmail: email,
      guestPhone: phone,
      bookingFor: bookingFor === 'main' ? 'main_guest' : 'someone_else',
      travelForWork: travelForWork === 'yes',
      arrivalTime: arrivalTime,
      airportShuttleRequested: airportShuttle,
      rentalCarRequested: rentalCar,
      airportTaxiRequested: airportTaxi,
      paperlessConfirmation: paperless,
      specialRequests: specialRequestsText,
      bookedRooms: [
        {
          roomTypeId: Number(roomTypeId),
          rateId: rateId,
          quantity: Number(quantity),
          price: Number(price || totalAmount),
          mealPlan: mealPlan,
        },
      ],
      paymentMethod: paymentMethod,
    };

    try {
      const data = await getClass.bookProperty(token, body);

      if (data?.data) {
        if (paymentMethod === 'online') {
          showToast.success('Redirecting to secure payment gateway...', { position: 'bottom-right' });
          window.location.href = `${baseURL}/api/payment/pay?reservationId=${data.data.documentId}&amount=${totalAmount}`;
        } else {
          showToast.success('Booking Confirmed!', { position: 'bottom-right' });
          router.push(`/orders/bookings`);
        }
      } else {
        showToast.error('Booking failed. The room may have just sold out.', { position: 'bottom-right' });
      }
    } catch (error) {
      showToast.error('A network error occurred.', { position: 'bottom-right' });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-center gap-4 px-4 sm:gap-6">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
            <CheckCircle2 size={20} />
            <span className="hidden sm:inline">Your selection</span>
          </div>
          <ChevronRight className="text-slate-300" size={16} />
          <div className="flex h-full items-center gap-2 border-b-2 border-blue-600 pt-0.5 text-sm font-bold text-blue-600">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
              2
            </div>
            <span>Final Details</span>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 px-4 pt-10 duration-500 lg:grid-cols-12">
        {/* Left Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-28 lg:col-span-4">
          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="group relative h-48 w-full overflow-hidden bg-slate-100">
              {propertyStore?.images?.[0]?.url && (
                <Image
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  src={`${baseURL}${propertyStore.images[0].url}`}
                  alt="Property"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent" />
              <div className="absolute right-5 bottom-5 left-5 text-white">
                <p className="mb-1 text-[10px] font-black tracking-widest uppercase opacity-80">
                  {propertyStore?.propertyType || 'Hotel'}
                </p>
                <h3 className="line-clamp-2 text-xl leading-tight font-black">
                  {propertyStore?.name || 'Property Name'}
                </h3>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {Array.from({ length: propertyStore?.starRating || 0 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                  <span className="text-sm font-black text-blue-700">{propertyStore?.userReviewScore || '8.5'}</span>
                  <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                    {propertyStore?.reviewWord || 'Very Good'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Check-in</p>
                    <p className="text-sm font-black text-slate-900">{checkInDate}</p>
                    <p className="text-[10px] font-bold text-slate-500">14:00 – 23:00</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Check-out</p>
                    <p className="text-sm font-black text-slate-900">{checkOutDate}</p>
                    <p className="text-[10px] font-bold text-slate-500">07:00 – 12:00</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm font-black text-slate-900">
                    {quantity}x {roomType || 'Room'}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {days} nights • {adult} adults
                  </p>
                  <button
                    onClick={goToBooking}
                    className="mt-3 text-[10px] font-black tracking-widest text-blue-600 uppercase hover:underline"
                  >
                    Edit Selection
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
            <h4 className="mb-6 text-xs font-black tracking-widest text-slate-400 uppercase">Price Summary</h4>
            <div className="mb-6 space-y-3 border-b border-slate-800 pb-6 text-sm font-medium">
              <div className="flex justify-between text-slate-400">
                <span>Original price</span>
                <span className="line-through">EGP {(Number(totalAmount) * 1.15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Early Booker Deal</span>
                <span>- EGP {(Number(totalAmount) * 0.15).toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-2 flex items-end justify-between">
              <span className="text-lg font-black tracking-widest text-slate-300 uppercase">Total</span>
              <span className="text-4xl font-black text-white">EGP {totalAmount}</span>
            </div>
            <p className="text-right text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Includes EGP {estimatedTaxes} in taxes & fees
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <ShieldCheck className="shrink-0 text-emerald-500" size={32} />
            <p className="text-xs leading-relaxed font-bold text-slate-600">
              Secure payment processing. Free cancellation available anytime before check-in.
            </p>
          </div>
        </aside>

        {/* Right Main Column: Form */}
        <main className="space-y-8 lg:col-span-8">
          {token && (
            <div className="flex items-center gap-4 rounded-[2rem] border border-blue-100 bg-blue-50/50 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white shadow-lg shadow-blue-200">
                {firstName ? firstName.charAt(0) : 'U'}
              </div>
              <div>
                <p className="font-black text-slate-900">Signed in as {firstName}</p>
                <p className="text-sm font-medium text-slate-500">{email}</p>
              </div>
            </div>
          )}

          {/* Section 1: Guest Information */}
          <section className="space-y-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <User size={20} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Guest Details</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  First Name *
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Last Name *
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Country/Region *
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white"
                >
                  <option>Egypt</option>
                  <option>United Arab Emirates</option>
                  <option>Saudi Arabia</option>
                  <option>United Kingdom</option>
                  <option>United States</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 100 000 0000"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <label className="group flex cursor-pointer items-start gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={paperless}
                onChange={() => setPaperless(!paperless)}
                className="mt-1 h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 transition-colors group-hover:text-blue-600">
                  Digital Confirmation (Recommended)
                </span>
                <span className="text-xs font-medium text-slate-500">
                  We&apos;ll text you a paperless link to access your booking offline.
                </span>
              </div>
            </label>
          </section>

          {/* Section 2: Preferences */}
          <section className="space-y-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Personalize your stay</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-black text-slate-900">Who are you booking for?</h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'main', label: 'I am the main guest' },
                    { id: 'other', label: 'Booking for someone else' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setBookingFor(opt.id)}
                      className={`rounded-full border-2 px-6 py-2.5 text-sm font-bold transition-all ${bookingFor === opt.id ? 'border-black bg-black text-white shadow-lg' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-black text-slate-900">Is this a business trip?</h4>
                <div className="flex gap-3">
                  {[
                    { id: 'yes', label: 'Yes' },
                    { id: 'no', label: 'No' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setTravelForWork(opt.id)}
                      className={`rounded-full border-2 px-8 py-2.5 text-sm font-bold transition-all ${travelForWork === opt.id ? 'border-black bg-black text-white shadow-lg' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Add-ons & Requests */}
          <section className="space-y-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Add-ons & Requests</h2>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  state: airportShuttle,
                  set: setAirportShuttle,
                  icon: <Plane />,
                  label: 'Airport Shuttle',
                  sub: 'Request a pickup from the airport.',
                },
                {
                  state: rentalCar,
                  set: setRentalCar,
                  icon: <Car />,
                  label: 'Rental Car',
                  sub: 'Save up to 15% off with your Genius rewards.',
                },
                {
                  state: airportTaxi,
                  set: setAirportTaxi,
                  icon: <Clock />,
                  label: 'Airport Taxi',
                  sub: 'Save 10% on all airport taxis.',
                },
              ].map((item, idx) => (
                <label
                  key={idx}
                  className={`flex cursor-pointer items-center gap-5 rounded-3xl border-2 p-6 transition-all ${item.state ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={item.state}
                    onChange={() => item.set(!item.state)}
                  />
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.state ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900">{item.label}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">{item.sub}</p>
                  </div>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${item.state ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}
                  >
                    {item.state && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </label>
              ))}
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-6">
              <label className="flex items-center gap-2 text-sm font-black text-slate-900">
                <Briefcase size={16} className="text-blue-500" /> Special Requests
              </label>
              <textarea
                rows={4}
                value={specialRequestsText}
                onChange={(e) => setSpecialRequestsText(e.target.value)}
                placeholder="Write your requests in English or Arabic..."
                className="w-full rounded-[2rem] border border-slate-200 bg-slate-50 p-6 font-medium transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-6">
              <label className="flex items-center gap-2 text-sm font-black text-slate-900">
                <Clock size={16} className="text-emerald-500" /> Estimated Arrival Time
              </label>
              <select
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full max-w-sm cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option>I don&apos;t know</option>
                {['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '22:00'].map((t) => (
                  <option key={t}>
                    {t} - {Number(t.split(':')[0]) + 1}:00
                  </option>
                ))}
              </select>
              <p className="text-xs font-bold text-emerald-600">
                ✓ Your room will be ready for check-in between 14:00 and 23:00
              </p>
            </div>
          </section>

          {/* Section 4: Payment */}
          <section className="space-y-8 rounded-[2.5rem] border-2 border-blue-600 bg-white p-8 shadow-2xl shadow-blue-900/10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <CreditCard size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Payment Selection</h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'online', title: 'Pay now in full', sub: 'Credit Card / Visa', color: 'blue' },
                { id: 'cash', title: 'Pay at the property', sub: 'No payment today', color: 'emerald' },
                { id: 'wallet', title: 'Digital Wallet Balance', sub: 'Pay with Pyramids Wallet', color: 'slate' },
              ].map((pay) => (
                <label
                  key={pay.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-3xl border-2 p-6 transition-all ${paymentMethod === pay.id ? `border-${pay.color}-500 bg-${pay.color}-50/30` : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                >
                  <input
                    type="radio"
                    value={pay.id}
                    checked={paymentMethod === pay.id}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'wallet' | 'online')}
                    className={`h-5 w-5 accent-${pay.color}-600`}
                  />
                  <div>
                    <p className="font-black text-slate-900">{pay.title}</p>
                    <p className="text-xs font-medium text-slate-500">{pay.sub}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-8">
              <button
                disabled={isSubmitting}
                onClick={checkoutBooking}
                className="w-full rounded-full bg-slate-900 py-6 text-xl font-black text-white shadow-2xl shadow-slate-900/30 transition-all hover:scale-[1.02] active:scale-95 disabled:bg-slate-400"
              >
                {isSubmitting ? 'Confirming...' : 'Complete Booking'}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
