'use client';
import { getClass } from '@/services/ApiServices';
import React, { useEffect, useRef, useState } from 'react';
import { DateRangePicker } from '@heroui/react';
import { ISearchBooking } from '../interface/booking';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { baseURL } from '../page';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowDown } from 'lucide-react';

export interface ILocation {
  displayName: string;
  latitude: number;
  longitude: number;
  type: string;
  city: string;
  country: string;
}

interface IDates {
  start: {
    year: number;
    month: number;
    day: number;
  };
  end: {
    year: number;
    month: number;
    day: number;
  };
}

type propertyType = 'hotel' | 'villa' | 'apartment' | 'resort' | '';

export default function Booking() {
  const [gettingProperties, setGettingProperties] = useState<ISearchBooking[]>([]);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [checkInDate, setCheckInDate] = useState();
  const [checkOutDate, setCheckOutDate] = useState();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [propertyType, setPropertyType] = useState<propertyType>('');
  const [minStarRating, setMinStarRating] = useState<number | null>(0);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [dates, setDates] = useState<IDates | null>(null);
  const [isOpenedRooms, setIsOpenedRooms] = useState(false);
  const [isOpenedOptions, setIsOpenedOptions] = useState(false);
  const [isOpenedLocation, setIsOpenedLocation] = useState(false);
  const roomsRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const [locationName, setLocationName] = useState('');

  async function searchAllProperties() {
    if (!dates?.start || !dates?.end) {
      return;
    }
    let startDay = `${dates?.start.day}`;
    let startMonth = `${dates?.start.month}`;
    let endDay = `${dates?.end.day}`;
    let endMonth = `${dates?.end.month}`;
    if (dates?.start?.month > 0 && dates?.start?.month < 10) {
      startMonth = `0${dates?.start.month}`;
    }
    if (dates?.start?.day > 0 && dates?.start.day < 10) {
      startDay = `0${dates?.start.day}`;
    }
    if (dates?.end?.month > 0 && dates?.end.month < 10) {
      endMonth = `0${dates?.end.month}`;
    }
    if (dates?.end?.day > 0 && dates?.end.day < 10) {
      endDay = `0${dates?.end.day}`;
    }
    const getIn = `${dates?.start.year}-${startMonth}-${startDay}`;
    const getOut = `${dates?.end.year}-${endMonth}-${endDay}`;
    console.log(getIn);
    console.log(getOut);
    const body = {
      checkInDate: getIn,
      checkOutDate: getOut,
      adults: adults,
      children: children,
      rooms: rooms,
      propertyType: propertyType, // Empty string ignores the filter
      minStarRating: minStarRating, // 0 ignores the filter
      lat: lat,
      lng: lng,
      radiusKm: 50,
    };
    const data = await getClass.searchProperties(body);
    setGettingProperties(data.data);
  }

  async function sendLocation(locationDetails: string) {
    const data = await getClass.getLocation(locationDetails);
    console.log(dates);
    if (locationDetails == '') {
      setLocations([]);
    } else {
      setLocations(data.data);
    }
  }

  function decreaseAdults() {
    if (adults == 1) {
      return;
    } else {
      setAdults(adults - 1);
    }
  }
  function decreaseChildren() {
    if (children == 0) {
      return;
    } else {
      setChildren(children - 1);
    }
  }
  function decreaseRooms() {
    if (rooms == 1) {
      return;
    } else {
      setRooms(rooms - 1);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roomsRef.current && !roomsRef.current.contains(event.target as Node)) {
        setIsOpenedRooms(false);
      }

      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setIsOpenedOptions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="my-5">
      <div className="grid grid-cols-1 gap-2 rounded-xl border bg-yellow-400 stroke-1 p-2 sm:grid-cols-12">
        <div className="relative max-w-full rounded-xl bg-white p-3 sm:col-span-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Where are you going?"
              value={locationName}
              onChange={(e) => {
                setTimeout(() => {
                  sendLocation(e.target.value);
                }, 500);
                setLocationName(e.target.value);
                setIsOpenedLocation(true);
              }}
              className="w-full p-3 outline-none"
              id=""
            />
            {locationName.length > 0 && (
              <button className="absolute top-[50%] right-1 translate-y-[-50%]" onClick={() => setLocationName('')}>
                <XMarkIcon className="h-6 w-6" /> {/* Use Tailwind CSS classes for styling */}
              </button>
            )}
          </div>
          {locations.length !== 0 && isOpenedLocation && (
            <div className="absolute top-full left-0 z-50 flex flex-col gap-2 rounded-xl bg-white p-2">
              {locations?.map((location: ILocation) => {
                return (
                  <div
                    onClick={() => {
                      setLat(location.latitude);
                      setLng(location.longitude);
                      setLocationName(location.displayName);
                      setIsOpenedLocation(false);
                      setLocations([]);
                    }}
                    className="cursor-pointer rounded-sm hover:bg-gray-300"
                    key={location.latitude}
                  >
                    <h4>{location.displayName}</h4>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="h-full sm:col-span-3">
          <DateRangePicker
            onChange={(newDate) => setDates(newDate)}
            className="h-full w-full p-3"
            label="Check-in Date - Check-out date"
          />
        </div>
        <div
          ref={roomsRef}
          className="relative h-full w-full rounded-xl bg-white p-3 sm:col-span-3"
          onClick={() => setIsOpenedRooms(!isOpenedRooms)}
        >
          <div className="relative flex h-full items-center justify-center">
            <div className="flex h-full items-center justify-center gap-3">
              <h4 className="select-none">
                {adults} {adults == 1 ? 'adult' : 'adults'} ·
              </h4>
              <h4 className="select-none">
                {children} {children == 1 || children == 0 ? 'child' : 'children'} ·
              </h4>
              <h4 className="select-none">
                {rooms} {rooms == 1 ? 'room' : 'rooms'}
              </h4>
            </div>
            <ArrowDown className="absolute top-[50%] right-1 h-6 w-6 translate-y-[-50%]" />
          </div>
          {isOpenedRooms && (
            <div className="absolute top-full left-0 mt-5 flex w-full flex-col gap-3 rounded-sm bg-white p-2 shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <h4>Adults:</h4>
                <div className="grid grid-cols-3 gap-5 rounded-xl border p-2">
                  <div
                    onClick={() => decreaseAdults()}
                    className="flex cursor-pointer items-center justify-center text-[30px] text-blue-500 select-none hover:bg-blue-50"
                  >
                    -
                  </div>
                  <div className="text-[30px]">{adults}</div>
                  <div
                    onClick={() => setAdults(adults + 1)}
                    className="flex cursor-pointer items-center justify-center text-[30px] text-blue-500 select-none hover:bg-blue-50"
                  >
                    +
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <h4>Children:</h4>
                <div className="grid grid-cols-3 gap-5 rounded-xl border p-2">
                  <div
                    onClick={() => decreaseChildren()}
                    className="flex cursor-pointer items-center justify-center text-[30px] text-blue-500 select-none hover:bg-blue-50"
                  >
                    -
                  </div>
                  <div className="text-[30px]">{children}</div>
                  <div
                    onClick={() => setChildren(children + 1)}
                    className="flex cursor-pointer items-center justify-center text-[30px] text-blue-500 select-none hover:bg-blue-50"
                  >
                    +
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <h4>Rooms:</h4>
                <div className="grid grid-cols-3 gap-5 rounded-xl border p-2">
                  <div
                    onClick={() => decreaseRooms()}
                    className="flex cursor-pointer items-center justify-center text-[30px] text-blue-500 select-none hover:bg-blue-50"
                  >
                    -
                  </div>
                  <div className="text-[30px]">{rooms}</div>
                  <div
                    onClick={() => setRooms(rooms + 1)}
                    className="flex cursor-pointer items-center justify-center text-[30px] text-blue-500 select-none hover:bg-blue-50"
                  >
                    +
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          ref={optionsRef}
          onClick={() => setIsOpenedOptions(!isOpenedOptions)}
          className="relative flex cursor-pointer items-center justify-center rounded-xl bg-white p-2 sm:col-span-1"
        >
          <h3 className="select-none">Options</h3>
          {isOpenedOptions && (
            <div className="absolute top-full left-0 z-50 mt-5 flex flex-col gap-5 rounded-sm bg-white p-2 shadow-2xl">
              <div className="flex justify-between gap-5">
                <h4>Property type</h4>
                <select
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setPropertyType(e.target.value as propertyType)
                  }
                >
                  <option value="hotel">Hotel</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="resort">Resort</option>
                </select>
              </div>
              <div className="flex justify-between gap-5">
                <h4>Rating</h4>
                <select onChange={(e) => setMinStarRating(Number(e.target.value))} name="" id="">
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <div className="sm:col-span-1">
          <button
            onClick={() => searchAllProperties()}
            className="h-full w-full cursor-pointer rounded-xl bg-blue-600 p-2 font-bold text-white"
          >
            Search
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3">
        <div className="sm:col-span-1"></div>
        <div className="sm:col-span-2">
          {gettingProperties.map((eachProperty: ISearchBooking) => {
            return (
              <div key={eachProperty.id} className="grid grid-cols-1 sm:grid-cols-4 mt-3 gap-5 rounded-xl border stroke-1 p-3">
                <div className="sm:col-span-1 rounded-xl border">
                  <Image
                    className="w-full rounded-xl"
                    width={300}
                    height={300}
                    src={eachProperty.images.length == 0 ? IMAGE_PLACEHOLDER : `${baseURL}${eachProperty.images[0]}`}
                    alt={`${eachProperty.name}`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <h3 className="cursor-pointer text-blue-600 hover:text-black">{eachProperty.name}</h3>
                  <p>
                    {eachProperty.city} <span className="text-gray-100 select-none">&bull;</span>{' '}
                    {eachProperty.distanceFromCityCenterKm} km from center{' '}
                    <span className="text-gray-100 select-none">&bull;</span> {eachProperty.nearbyLandmark}
                  </p>
                  <p>
                    {eachProperty.landmarkDistance} from {eachProperty.landmarkName}
                  </p>
                  <div>
                    <h5>{eachProperty.propertyType}</h5>
                    <h5>{eachProperty.availableRooms[0].name}</h5>
                    {eachProperty.paymentPolicy == 'pay_at_checkin' && (
                      <h5>No prepayment needed – pay at the property</h5>
                    )}
                    {eachProperty.paymentPolicy == 'prepay_online' && <h5>Pay online first to book it</h5>}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="mb-4 grid cursor-pointer grid-cols-2 justify-between gap-2">
                    <div>
                      <h4>{eachProperty.reviewWord}</h4>
                      <p>{eachProperty.totalReviews} reviews</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-tl-md rounded-tr-md rounded-br-md bg-blue-800 text-white">
                      <h5 className="select-none">{eachProperty.userReviewScore}</h5>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <p>
                      {eachProperty.numberOfNights} nights, {adults} adults
                    </p>
                    {children > 0 && children < 2 && <p>, {children} child</p>}
                    {children > 1 && <p>, {children} children</p>}
                  </div>
                  <div className="">
                    <h4>EGP {eachProperty.totalStayPrice}</h4>
                    <p>+EGP {eachProperty.taxesAndFees} taxes and charges</p>
                  </div>
                  <div className="mt-4">
                    <button className="rounded-md bg-blue-500 p-3 text-white hover:bg-blue-700">
                      See availability &gt;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
