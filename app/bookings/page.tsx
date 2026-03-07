'use client';
import { getClass } from '@/services/ApiServices';
import React, { useEffect, useRef, useState } from 'react';
import { DateRangePicker, Slider, CheckboxGroup, Checkbox, Input } from '@heroui/react';
import { ISearchBooking } from '../interface/booking';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { baseURL } from '../page';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowDown } from 'lucide-react';
import { Triangle } from 'react-loader-spinner';
import { CarouselCSR } from '../_Components/Carsoul/Carsoul-CSR';
import { useRouter } from 'next/navigation';
import { showToast } from "nextjs-toast-notify";

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
  const [checkInDate, setCheckInDate] = useState<string>();
  const [checkOutDate, setCheckOutDate] = useState<string>();
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
  const [valuee, setValuee] = React.useState([200, 7000]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [selected, setSelected] = React.useState([]);
  const [distance, setDistance] = useState(10);
  const [bedRooms, setBedRooms] = useState(1);
  const [bathRooms, setBathRooms] = useState(1);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  function goToBooking(slug: string, propertyId: number, adults: number, children: number){
    router.push(`bookings/${slug}?id=${propertyId}&checkin=${checkInDate}&checkout=${checkOutDate}&adults=${adults}&children=${children}`)
  }

  async function searchAllProperties() {
    setIsLoading(true);
    if (!dates?.start || !dates?.end) {
      showToast.error('Please select Check-in and Check-out dates first!', {
        duration: 4000,
        progress: true,
        position: 'bottom-right',
        transition: 'bounceIn',
        icon: '',
        sound: true,
      });
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
    setCheckInDate(getIn);
    setCheckOutDate(getOut);
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
      minPrice: valuee[0],
      maxPrice: valuee[1],
      exactStarRatings: selected ?? 0,
      maxDistanceKm: distance,
      minBedrooms: bedRooms,
      minBathrooms: bathRooms,
    };
    const data = await getClass.searchProperties(body);
    setGettingProperties(data.data);
    setIsLoading(false);
    setIsLoading(false);
    setIsSearched(true);
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

  function decreaseBathRooms() {
    if (bathRooms == 1) {
      return;
    } else {
      setBathRooms(bathRooms - 1);
    }
  }
  function decreaseBedRooms() {
    if (bedRooms == 1) {
      return;
    } else {
      setBedRooms(bedRooms - 1);
    }
  }

  useEffect(() => {
    async function getBanners() {
      const data = await getClass.getModulesBanner();
    }
    getBanners();

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
        <div ref={roomsRef} className="relative h-full w-full rounded-xl bg-white p-3 sm:col-span-3">
          <div
            className="relative flex h-full items-center justify-center"
            onClick={() => setIsOpenedRooms(!isOpenedRooms)}
          >
            <div className="flex h-full items-center justify-center gap-3 px-0">
              <h5 className="select-none">
                {adults} {adults == 1 ? 'adult' : 'adults'} ·
              </h5>
              <h5 className="select-none">
                {children} {children == 1 || children == 0 ? 'child' : 'children'} ·
              </h5>
              <h5 className="select-none">
                {rooms} {rooms == 1 ? 'room' : 'rooms'}
              </h5>
            </div>
            <ArrowDown className="absolute top-[50%] right-1 h-6 w-6 translate-y-[-50%]" />
          </div>
          {isOpenedRooms && (
            <div className="absolute top-full left-0 z-1000 mt-5 flex w-full flex-col gap-3 rounded-sm bg-white p-2 shadow-2xl">
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
          className="relative flex cursor-pointer items-center justify-center rounded-xl bg-white p-2 sm:col-span-1"
        >
          <h5 className="select-none" onClick={() => setIsOpenedOptions(!isOpenedOptions)}>
            Options
          </h5>
          {isOpenedOptions && (
            <div className="absolute top-full left-0 z-1000 mt-5 flex flex-col gap-5 rounded-sm bg-white p-2 shadow-2xl">
              <div className="flex justify-between gap-5">
                <h5>Property type</h5>
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
                <h5>Rating</h5>
                <select onChange={(e) => setMinStarRating(Number(e.target.value))}>
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
            className="h-full w-full cursor-pointer rounded-xl bg-blue-600 p-2 font-bold text-white hover:bg-blue-800"
          >
            Search
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {isLoading && (
          <div className="flex h-50 items-center justify-center sm:col-span-3">
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}
        {isSearched && (
          <>
            <div className="my-3 h-fit rounded-xl border p-3 sm:col-span-1">
              <h4 className="mb-2 border-b-1 pb-1">Filter by:</h4>
              <h5>Your budget (per night)</h5>
              <div className="mt-4 flex w-full max-w-md flex-col items-start gap-2">
                <Slider
                  className="max-w-md"
                  formatOptions={{ style: 'currency', currency: 'EGP' }}
                  label="Select a budget"
                  maxValue={7000}
                  minValue={200}
                  step={100}
                  value={valuee}
                  onChange={setValuee}
                />
                <p className="text-default-500 text-small font-medium">
                  Selected budget: {Array.isArray(valuee) && valuee.map((b) => `${b}`).join(' – ')}
                </p>
              </div>
              <div className="my-2 border-t-1 pt-2">
                <h5>Property rating</h5>
                <p>Find high-quality hotels and holiday rentals</p>
                <div className="flex flex-col gap-3">
                  <CheckboxGroup color="warning" label="Select cities" value={selected} onValueChange={setSelected}>
                    <Checkbox value="2">2 stars</Checkbox>
                    <Checkbox value="3">3 stars</Checkbox>
                    <Checkbox value="4">4 stars</Checkbox>
                    <Checkbox value="5">5 stars</Checkbox>
                  </CheckboxGroup>
                  <p className="text-default-500 text-small">Selected: {selected.join(', ')}</p>
                </div>
              </div>
              <div className="my-3 border-t-1 pt-2">
                <h5>Distance from center</h5>
                <Input
                  isClearable
                  className="mt-2 max-w-xs"
                  defaultValue="10"
                  label="Enter distance search in km"
                  placeholder="10"
                  type="number"
                  variant="bordered"
                  // eslint-disable-next-line no-console
                  onChange={(e) => setDistance(Number(e.target.value))}
                />
              </div>
              <div className="mt-2 border-t-1 pt-2">
                <h5 className="mb-2">Bedrooms and bathrooms</h5>
                <div className="grid grid-cols-4 items-center gap-3">
                  <h5>BedRooms</h5>
                  <div className="col-span-3 grid grid-cols-3 gap-5 rounded-xl border p-2">
                    <div
                      onClick={() => decreaseBedRooms()}
                      className="flex cursor-pointer items-center justify-center text-[30px] text-blue-500 select-none hover:bg-blue-50"
                    >
                      -
                    </div>
                    <div className="text-[30px]">{bedRooms}</div>
                    <div
                      onClick={() => setBedRooms(bedRooms + 1)}
                      className="flex cursor-pointer items-center justify-center text-[30px] text-blue-500 select-none hover:bg-blue-50"
                    >
                      +
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-3">
                  <h5>Bathrooms</h5>
                  <div className="col-span-3 my-2 grid grid-cols-3 gap-5 rounded-xl border p-2">
                    <div
                      onClick={() => decreaseBathRooms()}
                      className="flex cursor-pointer items-center justify-center text-[30px] text-blue-500 select-none hover:bg-blue-50"
                    >
                      -
                    </div>
                    <div className="text-[30px]">{bathRooms}</div>
                    <div
                      onClick={() => setBathRooms(bathRooms + 1)}
                      className="flex cursor-pointer items-center justify-center text-[30px] text-blue-500 select-none hover:bg-blue-50"
                    >
                      +
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <button
                  onClick={() => searchAllProperties()}
                  className="cursor-pointer rounded-md bg-blue-600 px-10 py-4 text-white hover:bg-blue-800"
                >
                  Filter
                </button>
              </div>
            </div>
            <div className="sm:col-span-2">
              {gettingProperties.map((eachProperty: ISearchBooking) => {
                return (
                  <div
                    key={eachProperty.id}
                    className="mt-3 grid grid-cols-1 gap-5 rounded-xl border stroke-1 p-3 sm:grid-cols-4"
                  >
                    <div onClick={() => goToBooking(eachProperty.slug, eachProperty.id, adults, children)} className="cursor-pointer rounded-xl border sm:col-span-1">
                      <Image
                        className="w-full rounded-xl"
                        width={300}
                        height={300}
                        src={
                          eachProperty.images.length == 0 ? IMAGE_PLACEHOLDER : `${baseURL}${eachProperty.images[0]}`
                        }
                        alt={`${eachProperty.name}`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <h3 onClick={() => goToBooking(eachProperty.slug, eachProperty.id, adults, children)} className="cursor-pointer text-blue-600 hover:text-black">{eachProperty.name}</h3>
                      <p>
                        {eachProperty.city} <span className="text-gray-100 select-none">&bull;</span>{' '}
                        {eachProperty.distanceFromCityCenterKm} km from center{' '}
                        <span className="text-gray-100 select-none">&bull;</span> {eachProperty.nearbyLandmark}
                      </p>
                      <p>
                        {eachProperty.landmarkDistance} from {eachProperty.landmarkName}
                      </p>
                      <div className="border-l pl-2">
                        <h5>{eachProperty.propertyType}</h5>
                        <h5>{eachProperty.availableRooms[0].name}</h5>
                        {eachProperty.paymentPolicy == 'pay_at_checkin' && (
                          <h5>No prepayment needed – pay at the property</h5>
                        )}
                        {eachProperty.paymentPolicy == 'prepay_online' && <h5>Pay online first to book it</h5>}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="mb-4 grid cursor-pointer grid-cols-2 justify-between gap-5">
                        <div>
                          <h5>{eachProperty.reviewWord}</h5>
                          <p className="text-[12px]">{eachProperty.totalReviews} reviews</p>
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
                        <button onClick={() => goToBooking(eachProperty.slug, eachProperty.id, adults, children)} className="cursor-pointer rounded-md bg-blue-500 p-3 text-white hover:bg-blue-700">
                          See availability &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className="sm:col-span-3">
          <CarouselCSR checkIn={checkInDate} checkOut={checkOutDate}/>
        </div>
      </div>
    </div>
  );
}
