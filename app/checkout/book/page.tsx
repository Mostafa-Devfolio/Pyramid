'use client';
import { FacilitiesCategory, IProperty } from '@/app/interface/property';
import { baseURL } from '@/app/page';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
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
  const [userProfile, setUserProfile] = useState<any>(null);

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

  const [paymentMethod, setPaymentMethod] = useState('cash');
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
    <div className="bg-gray-50 pb-20 font-sans text-gray-800">
      <div className="mb-6 border-b bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-sm font-medium md:justify-center md:gap-20">
          <div className="flex items-center text-green-700">
            <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-700 text-white">✓</div>
            Your selection
          </div>
          <div className="flex items-center border-b-2 border-blue-700 pb-1 font-bold text-blue-700">
            <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-white">2</div>
            Details and Finish booking
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="sticky top-4 flex flex-col gap-4">
            <div className="rounded border bg-white shadow-sm">
              {propertyStore?.images?.[0]?.url && (
                <div className="relative h-40 w-full">
                  <Image
                    layout="fill"
                    className="rounded-t object-cover"
                    src={`${baseURL}${propertyStore?.images?.[0]?.url}`}
                    alt={`${propertyStore?.name}`}
                  />
                </div>
              )}
              <div className="p-4">
                <p className="mb-1 text-xs text-gray-500">{propertyStore?.propertyType || 'Hotel'}</p>
                <div className="mb-1 flex">
                  {Array.from({ length: propertyStore?.starRating || 0 }).map((_, index) => (
                    <Star key={index} className="h-3 w-3 fill-amber-500 text-yellow-400" />
                  ))}
                </div>
                <h3 className="mb-2 text-lg leading-tight font-bold">{propertyStore?.name || 'Property Name'}</h3>
                <p className="mb-3 text-xs text-gray-600">{propertyStore?.address || 'Address'}</p>

                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-sm rounded-br-none bg-blue-800 px-2 py-1 text-sm font-bold text-white">
                    {propertyStore?.userReviewScore || '8.5'}
                  </div>
                  <p className="text-sm font-bold">
                    {propertyStore?.reviewWord || 'Very Good'}{' '}
                    <span className="text-xs font-normal text-gray-500">· {propertyStore?.totalReviews} reviews</span>
                  </p>
                </div>

                <div className="mb-3 flex flex-wrap gap-2 text-xs font-medium">
                  {propertyStore?.isFeatured && (
                    <span className="rounded bg-orange-100 px-2 py-1 text-orange-800">Featured</span>
                  )}
                  {propertyStore?.isHighestRated && (
                    <span className="rounded bg-blue-100 px-2 py-1 text-blue-800">Highest Rated</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-green-700">
                  {propertyStore?.facilitiesCategories?.map((facility: FacilitiesCategory, index) => {
                    if (index > 3) return null;
                    return (
                      <span key={index} className="truncate rounded border border-green-700 px-2 py-1">
                        ✓ {facility.category}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded border bg-white p-4 shadow-sm">
              <h3 className="mb-4 font-bold">Your booking details</h3>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="border-r pr-2">
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="text-sm font-bold">{checkInDate}</p>
                  <p className="text-xs text-gray-500">14:00 – 23:00</p>
                </div>
                <div className="pl-2">
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="text-sm font-bold">{checkOutDate}</p>
                  <p className="text-xs text-gray-500">07:00 – 12:00</p>
                </div>
              </div>

              <p className="text-sm text-gray-600">Total length of stay:</p>
              <p className="mb-4 text-sm font-bold">{days} nights</p>

              <hr className="mb-4" />
              <p className="text-sm text-gray-600">You selected</p>
              <p className="mb-1 text-sm font-bold">
                {quantity} room for {adult} {adult && Number(adult) > 1 ? 'adults' : 'adult'}
              </p>
              <p className="mb-2 text-xs">{roomType}</p>
              <p onClick={goToBooking} className="w-fit cursor-pointer text-sm text-blue-600 hover:underline">
                Change your selection
              </p>
            </div>

            <div className="rounded border border-blue-200 bg-blue-50 p-4 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">Your price summary</h3>

              <div className="mb-2 flex justify-between text-sm text-gray-600">
                <span>Original price</span>
                <span className="line-through">EGP {(Number(totalAmount) * 1.15).toFixed(2)}</span>
              </div>

              <div className="mb-4 flex justify-between text-sm font-medium text-green-700">
                <span>Early Booker Deal</span>
                <span>- EGP {(Number(totalAmount) * 0.15).toFixed(2)}</span>
              </div>

              <div className="-mx-4 mb-4 flex items-end justify-between border border-blue-100 bg-white p-4">
                <span className="text-2xl font-bold text-gray-800">Price</span>
                <span className="text-3xl font-extrabold text-blue-900">EGP {totalAmount}</span>
              </div>

              <p className="mb-4 text-right text-xs text-gray-500">
                Includes EGP {estimatedTaxes} in taxes and charges
              </p>

              <div className="rounded border bg-white p-3">
                <h4 className="mb-1 text-sm font-bold">Price information</h4>
                <ul className="list-disc space-y-2 pl-4 text-xs text-gray-600">
                  <li>Please note that by Egyptian law all foreign guests must pay in a foreign currency.</li>
                  <li>Egyptian citizens are required to pay in the local currency.</li>
                </ul>
              </div>
            </div>

            <div className="rounded border bg-white p-4 shadow-sm">
              <h3 className="mb-2 font-bold">Your payment schedule</h3>
              <p className="mb-4 text-sm font-bold text-green-700">
                {paymentMethod === 'cash'
                  ? "No payment today. You'll pay when you stay."
                  : 'You will pay securely online today.'}
              </p>

              <h3 className="mb-2 font-bold">How much will it cost to cancel?</h3>
              <p className="text-sm font-bold text-green-700">Free cancellation anytime</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:col-span-2">
          {token && (
            <div className="flex items-center gap-4 rounded border bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {firstName ? firstName.charAt(0) : 'U'}
              </div>
              <div>
                <p className="font-bold">You are signed in</p>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
            </div>
          )}

          <div className="rounded border bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-xl font-bold">Enter your details</h2>
            <p className="mb-6 flex justify-between text-sm text-gray-500">
              <span>
                Almost done! Just fill in the <span className="text-red-600">*</span> required info
              </span>
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold">
                  First name <span className="text-red-600">*</span>
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-400 p-2 outline-blue-600"
                />
              </div>
              <div>
                <label className="text-sm font-bold">
                  Last name <span className="text-red-600">*</span>
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-400 p-2 outline-blue-600"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-sm font-bold">
                  Email address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-400 p-2 outline-blue-600"
                />
                <p className="mt-1 text-xs text-gray-500">Confirmation email goes to this address</p>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-sm font-bold">
                  Country/region <span className="text-red-600">*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-400 bg-white p-2 outline-blue-600"
                >
                  <option>Egypt</option>
                  <option>United Arab Emirates</option>
                  <option>Saudi Arabia</option>
                  <option>United Kingdom</option>
                  <option>United States</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-bold">
                  Phone number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 100 000 0000"
                  className="mt-1 w-full rounded border border-gray-400 p-2 outline-blue-600"
                />
                <p className="mt-1 text-xs text-gray-500">Needed by the property to validate your booking.</p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2">
              <input
                type="checkbox"
                checked={paperless}
                onChange={() => setPaperless(!paperless)}
                className="mt-1 h-4 w-4 cursor-pointer accent-blue-600"
              />
              <label className="text-sm">
                Yes, I&#39;d like free paperless confirmation (recommended)
                <br />
                <span className="text-gray-500">We&#39;ll text you a link to download our app</span>
              </label>
            </div>

            <hr className="my-6" />

            <div className="mb-6">
              <h3 className="mb-2 text-sm font-bold">
                Who are you booking for? <span className="font-normal text-gray-500">(optional)</span>
              </h3>
              <label className="mb-2 flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  value="main"
                  checked={bookingFor === 'main'}
                  onChange={() => setBookingFor('main')}
                  className="h-5 w-5 accent-blue-600"
                />
                <span>I am the main guest</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  value="other"
                  checked={bookingFor === 'other'}
                  onChange={() => setBookingFor('other')}
                  className="h-5 w-5 accent-blue-600"
                />
                <span>Booking is for someone else</span>
              </label>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold">
                Are you travelling for work? <span className="font-normal text-gray-500">(optional)</span>
              </h3>
              <div className="flex gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="yes"
                    checked={travelForWork === 'yes'}
                    onChange={() => setTravelForWork('yes')}
                    className="h-5 w-5 accent-blue-600"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="no"
                    checked={travelForWork === 'no'}
                    onChange={() => setTravelForWork('no')}
                    className="h-5 w-5 accent-blue-600"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          <div className="rounded border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">{roomType || 'Deluxe Double Room'}</h2>
            <p className="mb-1 text-sm font-bold text-green-700">✓ Free cancellation anytime</p>
            <p className="mb-4 text-sm text-gray-600">
              Guests: {adult} {adult && Number(adult) > 1 ? 'adults' : 'adult'}
            </p>

            <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
              <p className="mb-1 text-sm font-bold text-blue-800">Your Genius benefits</p>
              <p className="text-sm text-blue-900">
                <strong>13% discount:</strong> You&#39;re getting a discount on the price of this option before taxes
                and charges are applied.
              </p>
            </div>
          </div>

          <div className="rounded border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Add to your stay</h2>

            <label className="mb-4 flex cursor-pointer items-start gap-3 rounded border-b p-2 pb-4 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={airportShuttle}
                onChange={() => setAirportShuttle(!airportShuttle)}
                className="mt-1 h-5 w-5 accent-blue-600"
              />
              <div>
                <p className="text-sm font-bold">I&#39;m interested in requesting an airport shuttle</p>
                <p className="text-xs text-gray-600">
                  We’ll tell your accommodation that you’re interested so they can provide details and costs.
                </p>
              </div>
            </label>

            <label className="mb-4 flex cursor-pointer items-start gap-3 rounded border-b p-2 pb-4 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={rentalCar}
                onChange={() => setRentalCar(!rentalCar)}
                className="mt-1 h-5 w-5 accent-blue-600"
              />
              <div>
                <p className="text-sm font-bold">I’m interested in renting a car with up to 15% off</p>
                <p className="text-xs text-gray-600">
                  Save up to 15% off on select rental cars with your Genius rewards.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded p-2 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={airportTaxi}
                onChange={() => setAirportTaxi(!airportTaxi)}
                className="mt-1 h-5 w-5 accent-blue-600"
              />
              <div>
                <p className="text-sm font-bold">I’m interested in booking an airport taxi with 10% off</p>
                <p className="text-xs text-gray-600">Save 10% on all airport taxis when you book with us.</p>
              </div>
            </label>
          </div>

          <div className="rounded border bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-bold">Special requests</h2>
            <p className="mb-4 text-sm text-gray-600">
              Special requests cannot be guaranteed – but the property will do its best to meet your needs. You can
              always make a special request after your booking is complete!
            </p>
            <label className="text-sm font-bold">
              Please write your requests in English or Arabic.{' '}
              <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <textarea
              rows={4}
              value={specialRequestsText}
              onChange={(e) => setSpecialRequestsText(e.target.value)}
              className="mt-2 w-full rounded border border-gray-400 p-2 outline-blue-600"
            />
          </div>

          <div className="rounded border bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-bold">Your arrival time</h2>
            <p className="mb-1 text-sm font-bold text-green-700">
              ✓ Your room will be ready for check-in between 14:00 and 23:00
            </p>
            <p className="mb-4 text-sm font-bold text-green-700">✓ 24-hour front desk – Help whenever you need it!</p>

            <label className="text-sm font-bold">
              Add your estimated arrival time <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <select
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="mt-2 block w-full rounded border border-gray-400 bg-white p-2 outline-blue-600 md:w-1/2"
            >
              <option>I don&#39;t know</option>
              <option>12:00 - 13:00</option>
              <option>13:00 - 14:00</option>
              <option>14:00 - 15:00</option>
              <option>15:00 - 16:00</option>
              <option>16:00 - 17:00</option>
              <option>17:00 - 18:00</option>
              <option>22:00 - 23:00</option>
            </select>
          </div>

          <div className="rounded border border-blue-400 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-blue-900">How do you want to pay?</h2>
            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer items-center gap-3 rounded border border-blue-200 bg-blue-50 p-3">
                <input
                  type="radio"
                  className="h-5 w-5 accent-blue-700"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="font-bold text-blue-900">Pay now in full (Credit Card / Visa)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded border border-green-200 bg-green-50 p-3">
                <input
                  type="radio"
                  className="h-5 w-5 accent-green-700"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="font-bold text-green-900">Pay at the property (No payment today)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded border p-3 hover:bg-gray-50">
                <input
                  type="radio"
                  className="h-5 w-5 accent-gray-700"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="font-bold text-gray-800">Pay with Digital Wallet Balance</span>
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              disabled={isSubmitting}
              onClick={() => checkoutBooking()}
              className="w-full rounded-md bg-blue-600 px-10 py-4 text-lg font-bold text-white shadow transition-all hover:bg-blue-700 disabled:bg-blue-400 md:w-auto"
            >
              {isSubmitting ? 'Processing...' : 'Next: Final details >'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
