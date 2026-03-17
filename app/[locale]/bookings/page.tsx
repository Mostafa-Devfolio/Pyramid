'use client';
import { getClass } from '@/services/ApiServices';
import React, { useEffect, useRef, useState } from 'react';
import { DateRangePicker, Slider, CheckboxGroup, Checkbox, Input } from '@heroui/react';
import { ISearchBooking } from '../interface/booking';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { baseURL } from '../page';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDown, MapPin, Search, Users, Settings2, SlidersHorizontal, Star } from 'lucide-react';
import { Triangle } from 'react-loader-spinner';
import { CarouselCSR } from '../_Components/Carsoul/Carsoul-CSR';
import { useRouter } from 'next/navigation';
import { showToast } from 'nextjs-toast-notify';

// Types for missing interfaces to prevent TS errors based on your code
interface ILocation {
  latitude: number;
  longitude: number;
  displayName: string;
}
interface IDates {
  start: { year: number; month: number; day: number };
  end: { year: number; month: number; day: number };
}
type propertyType = string;

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
  const [selected, setSelected] = React.useState<string[]>([]);
  const [distance, setDistance] = useState(10);
  const [bedRooms, setBedRooms] = useState(1);
  const [bathRooms, setBathRooms] = useState(1);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function goToBooking(slug: string, propertyId: number, adults: number, children: number) {
    router.push(
      `bookings/${slug}?id=${propertyId}&checkin=${checkInDate}&checkout=${checkOutDate}&adults=${adults}&children=${children}`
    );
  }

  async function searchAllProperties() {
    setIsLoading(true);
    if (!dates?.start || !dates?.end) {
      showToast.error('Please select Check-in and Check-out dates first!', {
        duration: 4000,
        position: 'bottom-right',
      });
      setIsLoading(false);
      return;
    }
    const getIn = `${dates.start.year}-${String(dates.start.month).padStart(2, '0')}-${String(dates.start.day).padStart(2, '0')}`;
    const getOut = `${dates.end.year}-${String(dates.end.month).padStart(2, '0')}-${String(dates.end.day).padStart(2, '0')}`;
    setCheckInDate(getIn);
    setCheckOutDate(getOut);
    const body = {
      checkInDate: getIn,
      checkOutDate: getOut,
      adults,
      children,
      rooms,
      propertyType,
      minStarRating,
      lat,
      lng,
      radiusKm: 50,
      minPrice: valuee[0],
      maxPrice: valuee[1],
      exactStarRatings: selected ?? [],
      maxDistanceKm: distance,
      minBedrooms: bedRooms,
      minBathrooms: bathRooms,
    };
    const data = await getClass.searchProperties(body);
    setGettingProperties(data.data);
    setIsLoading(false);
    setIsSearched(true);
  }

  async function sendLocation(val: string) {
    if (val === '') {
      setLocations([]);
      return;
    }
    const data = await getClass.getLocation(val);
    setLocations(data.data);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roomsRef.current && !roomsRef.current.contains(event.target as Node)) setIsOpenedRooms(false);
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) setIsOpenedOptions(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* 2026 Modern Search Bar Container (Floating) */}
        <div className="animate-in fade-in slide-in-from-top-4 relative z-[100] mb-12 rounded-[2.5rem] border border-slate-800 bg-slate-950 p-2 shadow-2xl duration-500">
          <div className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-12">
            {/* Location Column */}
            <div className="group relative lg:col-span-4">
              <div className="flex h-16 items-center gap-3 rounded-[2rem] bg-white px-6 transition-all focus-within:ring-2 focus-within:ring-blue-500">
                <MapPin className="shrink-0 text-blue-500" size={20} />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="w-full bg-transparent font-bold text-slate-900 outline-none placeholder:text-slate-400"
                  value={locationName}
                  onChange={(e) => {
                    setLocationName(e.target.value);
                    setIsOpenedLocation(true);
                    setTimeout(() => sendLocation(e.target.value), 500);
                  }}
                />
                {locationName && (
                  <button
                    onClick={() => setLocationName('')}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                  >
                    <XMarkIcon className="h-4 w-4 text-slate-500" />
                  </button>
                )}
              </div>

              {/* Dropdown Suggestions */}
              {locations.length > 0 && isOpenedLocation && (
                <div className="absolute top-full left-0 z-[110] mt-2 w-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-2 shadow-2xl">
                  {locations.map((loc) => (
                    <div
                      key={loc.latitude}
                      onClick={() => {
                        setLat(loc.latitude);
                        setLng(loc.longitude);
                        setLocationName(loc.displayName);
                        setIsOpenedLocation(false);
                        setLocations([]);
                      }}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-blue-50"
                    >
                      <MapPin size={16} className="shrink-0 text-slate-400" />
                      <span className="line-clamp-1 font-bold text-slate-700">{loc.displayName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Column */}
            <div className="lg:col-span-3">
              <DateRangePicker
                onChange={(newDate: any) => setDates(newDate)}
                className="h-16 w-full"
                variant="flat"
                radius="full"
                classNames={{ base: 'bg-white h-16 rounded-[2rem] px-4', inputWrapper: 'bg-transparent shadow-none' }}
              />
            </div>

            {/* Guests/Rooms Column */}
            <div ref={roomsRef} className="relative lg:col-span-3">
              <button
                onClick={() => setIsOpenedRooms(!isOpenedRooms)}
                className="flex h-16 w-full items-center justify-between gap-3 rounded-[2rem] bg-white px-6 font-bold text-slate-700 transition-all hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <Users className="shrink-0 text-blue-500" size={20} />
                  <span className="truncate text-sm">
                    {adults} Ad, {children} Ch, {rooms} Rm
                  </span>
                </div>
                <ChevronDown size={18} className="shrink-0 text-slate-400" />
              </button>

              {isOpenedRooms && (
                <div className="absolute top-full left-0 z-[110] mt-2 w-full space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl lg:right-0 lg:left-auto lg:min-w-[320px]">
                  {[
                    {
                      label: 'Adults',
                      val: adults,
                      inc: () => setAdults(adults + 1),
                      dec: () => adults > 1 && setAdults(adults - 1),
                    },
                    {
                      label: 'Children',
                      val: children,
                      inc: () => setChildren(children + 1),
                      dec: () => children > 0 && setChildren(children - 1),
                    },
                    {
                      label: 'Rooms',
                      val: rooms,
                      inc: () => setRooms(rooms + 1),
                      dec: () => rooms > 1 && setRooms(rooms - 1),
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.label}</span>
                      <div className="flex items-center gap-4 rounded-xl border border-slate-100 p-1">
                        <button
                          onClick={item.dec}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 font-bold text-blue-600 transition-colors hover:bg-blue-50"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-black">{item.val}</span>
                        <button
                          onClick={item.inc}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 font-bold text-white shadow-sm transition-colors hover:bg-blue-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Options & Search Button */}
            <div className="flex gap-2 lg:col-span-2">
              <div ref={optionsRef} className="relative flex-1">
                <button
                  onClick={() => setIsOpenedOptions(!isOpenedOptions)}
                  className="flex h-16 w-full items-center justify-center rounded-[2rem] bg-slate-800 text-white transition-colors hover:bg-slate-700"
                >
                  <Settings2 size={20} />
                </button>

                {/* BUG FIX: Added left-0 sm:left-auto sm:right-0 to prevent mobile off-screen bleeding */}
                {isOpenedOptions && (
                  <div className="absolute top-full left-0 z-[110] mt-2 w-[calc(100vw-32px)] space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl sm:right-0 sm:left-auto sm:w-72">
                    <div className="space-y-2">
                      <label className="pl-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Property Type
                      </label>
                      <select
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="">All Types</option>
                        <option value="hotel">Hotel</option>
                        <option value="villa">Villa</option>
                        <option value="apartment">Apartment</option>
                        <option value="resort">Resort</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="pl-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Min Stars
                      </label>
                      <select
                        onChange={(e) => setMinStarRating(Number(e.target.value))}
                        className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="0">Any Rating</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} Stars
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={searchAllProperties}
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[2rem] bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-transform hover:scale-105 active:scale-95"
              >
                <Search size={22} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        {/* Grid for Results & Filters */}
        <div className="relative z-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* BUG FIX: Sidebar Filters (static on mobile, sticky on desktop) */}
          {isSearched && (
            <aside className="static z-20 space-y-6 lg:sticky lg:top-28 lg:col-span-3">
              <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                <h4 className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-lg font-black text-slate-900">
                  <SlidersHorizontal size={20} className="text-blue-500" /> Filter by
                </h4>

                <div className="space-y-8">
                  <div>
                    <Slider
                      label="Budget per night"
                      step={100}
                      minValue={200}
                      maxValue={7000}
                      value={valuee}
                      onChange={(v) => setValuee(v as number[])}
                      formatOptions={{ style: 'currency', currency: 'EGP' }}
                      classNames={{ filler: 'bg-blue-600', thumb: 'bg-white border-2 border-blue-600' }}
                      className="font-bold text-slate-700"
                    />
                    <p className="mt-3 text-xs font-black tracking-wider text-blue-600">
                      {valuee[0]} - {valuee[1]} EGP
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h5 className="mb-3 text-xs font-black tracking-widest text-slate-400 uppercase">
                      Property Rating
                    </h5>
                    <CheckboxGroup value={selected} onValueChange={setSelected}>
                      {['2', '3', '4', '5'].map((s) => (
                        <Checkbox
                          key={s}
                          value={s}
                          size="sm"
                          classNames={{ label: 'text-sm font-bold text-slate-700 ml-1 flex items-center gap-1' }}
                        >
                          {s} <Star size={14} className="fill-amber-400 pb-0.5 text-amber-400" />
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <Input
                      label="Max Distance (km)"
                      type="number"
                      variant="bordered"
                      value={String(distance)}
                      onChange={(e) => setDistance(Number(e.target.value))}
                      classNames={{
                        inputWrapper: 'rounded-2xl border-slate-200 bg-slate-50',
                        label: 'font-black uppercase tracking-widest text-slate-400',
                      }}
                    />
                  </div>

                  <div className="space-y-5 border-t border-slate-100 pt-6">
                    <h5 className="text-xs font-black tracking-widest text-slate-400 uppercase">Layout</h5>
                    {[
                      {
                        label: 'Bedrooms',
                        val: bedRooms,
                        inc: () => setBedRooms(bedRooms + 1),
                        dec: () => bedRooms > 1 && setBedRooms(bedRooms - 1),
                      },
                      {
                        label: 'Bathrooms',
                        val: bathRooms,
                        inc: () => setBathRooms(bathRooms + 1),
                        dec: () => bathRooms > 1 && setBathRooms(bathRooms - 1),
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">{item.label}</span>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-1">
                          <button
                            onClick={item.dec}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 font-bold text-blue-600 transition-colors hover:bg-blue-50"
                          >
                            -
                          </button>
                          <span className="w-4 text-center font-black">{item.val}</span>
                          <button
                            onClick={item.inc}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 font-bold text-white shadow-sm transition-colors hover:bg-blue-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={searchAllProperties}
                    className="w-full rounded-full bg-slate-900 py-4 font-black text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 active:scale-95"
                  >
                    Update Results
                  </button>
                </div>
              </div>
            </aside>
          )}

          {/* Results Main Column */}
          <div className={`relative z-10 ${isSearched ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Triangle height="80" width="80" color="#2563eb" />
                <p className="mt-6 animate-pulse text-sm font-black tracking-widest text-blue-600 uppercase">
                  Finding best properties...
                </p>
              </div>
            ) : isSearched ? (
              <div className="animate-in fade-in slide-in-from-bottom-8 space-y-6 duration-700">
                <h2 className="mb-2 text-2xl font-black text-slate-900">
                  {gettingProperties.length} Properties in {locationName || 'selected area'}
                </h2>

                {gettingProperties.length === 0 && (
                  <div className="flex flex-col items-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                      <Search className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">No properties found</h3>
                    <p className="mt-2 font-medium text-slate-500">
                      Try adjusting your filters or searching a different area.
                    </p>
                  </div>
                )}

                {gettingProperties.map((eachProperty) => (
                  <div
                    key={eachProperty.id}
                    className="group flex flex-col gap-6 rounded-[2.5rem] border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 md:flex-row"
                  >
                    <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-[2rem] bg-slate-100 md:w-72">
                      <Image
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        src={
                          eachProperty.images.length === 0 ? IMAGE_PLACEHOLDER : `${baseURL}${eachProperty.images[0]}`
                        }
                        alt={eachProperty.name}
                      />
                      {eachProperty.isFeatured && (
                        <div className="absolute top-4 left-4 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md">
                          Featured
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-2 pr-2">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3
                              onClick={() => goToBooking(eachProperty.slug, eachProperty.id, adults, children)}
                              className="line-clamp-2 cursor-pointer text-2xl leading-tight font-black text-slate-900 transition-colors hover:text-blue-600"
                            >
                              {eachProperty.name}
                            </h3>
                            <p className="mt-2 flex items-center gap-1.5 text-xs font-bold tracking-widest text-blue-500 uppercase">
                              <MapPin size={12} /> {eachProperty.city} • {eachProperty.distanceFromCityCenterKm}km from
                              center
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <div className="hidden text-right sm:block">
                              <p className="text-sm leading-none font-black text-slate-900">
                                {eachProperty.reviewWord}
                              </p>
                              <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
                                {eachProperty.totalReviews} reviews
                              </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl rounded-br-none bg-blue-600 font-black text-white shadow-lg shadow-blue-600/30">
                              {eachProperty.userReviewScore}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black tracking-widest text-slate-600 uppercase">
                            {eachProperty.propertyType}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black tracking-widest text-slate-600 uppercase">
                            {eachProperty.availableRooms?.[0]?.name || 'Standard Room'}
                          </span>
                          {eachProperty.paymentPolicy === 'pay_at_checkin' && (
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black tracking-widest text-emerald-700 uppercase">
                              Pay at property
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                            {eachProperty.numberOfNights} nights, {adults} adults
                          </p>
                          <p className="text-3xl font-black text-slate-900">EGP {eachProperty.totalStayPrice}</p>
                          <p className="text-[10px] font-bold text-slate-400">
                            +EGP {eachProperty.taxesAndFees} taxes & charges
                          </p>
                        </div>
                        <button
                          onClick={() => goToBooking(eachProperty.slug, eachProperty.id, adults, children)}
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 font-black whitespace-nowrap text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95 sm:w-auto"
                        >
                          See availability <ChevronDown size={16} className="-rotate-90" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
                <CarouselCSR />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
