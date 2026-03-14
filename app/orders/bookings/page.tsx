'use client';
import { IReserved } from '@/app/interface/reservedProperty';
import { baseURL } from '@/app/page';
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
      console.log(getBook);
    }
    getReserve();
  }, [token]);
  return (
    <div className="my-3">
      <h2>Your booking summary</h2>
      {getBook?.map((booked: IReserved) => {
        return (
          <div key={booked.id} className="my-2 grid grid-cols-8 gap-5 p-3 shadow-sm cursor-pointer">
            <div className="col-span-1">
              <Image
                width={200}
                height={200}
                src={`${baseURL}${booked.property.images[0].url}`}
                alt={booked.property.images[0].alternativeText ?? 'Booking Orders'}
                className="rounded"
              />
            </div>
            <div className="col-span-4">
              <h4 className="mb-3">{booked.property.name}</h4>
              <div className='flex flex-col gap-1'>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px">
                    <path d="M.311 2.56v6.257a3.75 3.75 0 0 0 1.098 2.651l11.56 11.562a2.25 2.25 0 0 0 3.182 0l6.88-6.88a2.25 2.25 0 0 0 0-3.181L11.468 1.408A3.75 3.75 0 0 0 8.818.31H2.56A2.25 2.25 0 0 0 .31 2.56zm1.5 0a.75.75 0 0 1 .75-.75h6.257a2.25 2.25 0 0 1 1.59.659l11.562 11.56a.75.75 0 0 1 0 1.06l-6.88 6.88a.75.75 0 0 1-1.06 0L2.47 10.409a2.25 2.25 0 0 1-.659-1.59zm5.25 3.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.5 0a2.25 2.25 0 1 0-4.5 0 2.25 2.25 0 0 0 4.5 0"></path>
                  </svg>
                  <p>Total price: approx.EGP {booked.totalAmount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px">
                    <path d="M22.502 13.5v8.25a.75.75 0 0 1-.75.75h-19.5a.75.75 0 0 1-.75-.75V5.25a.75.75 0 0 1 .75-.75h19.5a.75.75 0 0 1 .75.75zm1.5 0V5.25A2.25 2.25 0 0 0 21.752 3h-19.5a2.25 2.25 0 0 0-2.25 2.25v16.5A2.25 2.25 0 0 0 2.252 24h19.5a2.25 2.25 0 0 0 2.25-2.25zm-23.25-3h22.5a.75.75 0 0 0 0-1.5H.752a.75.75 0 0 0 0 1.5M7.502 6V.75a.75.75 0 0 0-1.5 0V6a.75.75 0 0 0 1.5 0m10.5 0V.75a.75.75 0 0 0-1.5 0V6a.75.75 0 0 0 1.5 0"></path>
                  </svg>
                  <p>
                    {booked.checkInDate} - {booked.checkOutDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px">
                    <path d="M2.75 12h18.5c.69 0 1.25.56 1.25 1.25V18l.75-.75H.75l.75.75v-4.75c0-.69.56-1.25 1.25-1.25m0-1.5A2.75 2.75 0 0 0 0 13.25V18c0 .414.336.75.75.75h22.5A.75.75 0 0 0 24 18v-4.75a2.75 2.75 0 0 0-2.75-2.75zM0 18v3a.75.75 0 0 0 1.5 0v-3A.75.75 0 0 0 0 18m22.5 0v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-1.5 0m-.75-6.75V4.5a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 2.25 4.5v6.75a.75.75 0 0 0 1.5 0V4.5a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 0 1.5 0m-13.25-3h7a.25.25 0 0 1 .25.25v2.75l.75-.75h-9l.75.75V8.5a.25.25 0 0 1 .25-.25m0-1.5A1.75 1.75 0 0 0 6.75 8.5v2.75c0 .414.336.75.75.75h9a.75.75 0 0 0 .75-.75V8.5a1.75 1.75 0 0 0-1.75-1.75z"></path>
                  </svg>
                  <p>{booked.bookedRooms[0].rateId}</p>
                </div>
              </div>
            </div>
                <div className="col-span-3 flex items-end justify-end">
                    <button className='bg-blue-600 cursor-pointer hover:bg-blue-800 text-white p-2 rounded '>View or update details</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
