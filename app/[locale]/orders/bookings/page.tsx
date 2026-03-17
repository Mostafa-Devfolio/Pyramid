'use client';
import { IReserved } from '@/app/[locale]/interface/reservedProperty';
import { baseURL } from '@/app/[locale]/page';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function OrdersBooking() {
  const [getBook, setGetBook] = useState<IReserved[]>();
  const { token } = useAuth();

  useEffect(() => {
    async function getReserve() {
      if (!token) return;
      const data = await getClass.getReservations(token);
      setGetBook(data.data);
    }
    getReserve();
  }, [token]);

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Booking Summary</h2>
        <p className="text-sm font-medium text-pretty text-gray-500">
          Manage your upcoming stays and property reservations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {getBook?.map((booked: IReserved) => {
          return (
            <div
              key={booked.id}
              className="group relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:flex-row"
            >
              {/* Image Section */}
              <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-50 shadow-inner md:h-auto md:w-64">
                <Image
                  fill
                  src={`${baseURL}${booked.property.images[0].url}`}
                  alt={booked.property.images[0].alternativeText ?? 'Property'}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Modern Status Overlay */}
                <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-widest text-black uppercase shadow-sm backdrop-blur-md">
                  Confirmed
                </div>
              </div>

              {/* Details Section */}
              <div className="flex flex-1 flex-col justify-between py-2">
                <div>
                  <h3 className="mb-4 text-xl font-extrabold text-gray-900 transition-colors group-hover:text-blue-600">
                    {booked.property.name}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Price Chip */}
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <i className="fa-solid fa-receipt text-sm"></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Total Amount</span>
                        <span>EGP {booked.totalAmount}</span>
                      </div>
                    </div>

                    {/* Dates Chip */}
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <i className="fa-regular fa-calendar-check text-sm"></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Stay Period</span>
                        <span>
                          {booked.checkInDate} - {booked.checkOutDate}
                        </span>
                      </div>
                    </div>

                    {/* Rate/Room Chip */}
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                        <i className="fa-solid fa-bed text-sm"></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Rate ID</span>
                        <span className="max-w-[150px] truncate">{booked.bookedRooms[0].rateId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-4">
                  <div className="text-xs font-bold tracking-widest text-gray-400 uppercase">Ref: #{booked.id}</div>
                  <button className="rounded-full bg-black px-6 py-3 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-800 active:scale-95">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(!getBook || getBook.length === 0) && (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <i className="fa-solid fa-hotel text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900">No bookings yet</h3>
          <p className="mb-6 text-gray-500">Find your perfect stay today.</p>
          <button className="rounded-full bg-black px-10 py-4 font-bold text-white shadow-xl transition-transform hover:scale-105 active:scale-95">
            Explore Hotels
          </button>
        </div>
      )}
    </div>
  );
}
