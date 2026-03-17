'use client';
import {
  AvailableRoom2,
  FacilitiesCategory,
  IImage,
  IProperty,
  RateOption2,
  TopFacility,
} from '@/app/[locale]/interface/property';
import { getClass } from '@/services/ApiServices';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Star, MapPin, Wifi, X, CheckCircle2, ChevronDown, Users, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { baseURL } from '@/app/[locale]/page';
import { Slider, CheckboxGroup, Checkbox, Input } from '@heroui/react';
import { ArrowDown } from 'lucide-react';
import { showToast } from 'nextjs-toast-notify';
import { useAuth } from '@/lib/ContextAPI/authContext';
import dynamic from 'next/dynamic';

interface IDates {
  start: { year: number; month: number; day: number };
  end: { year: number; month: number; day: number };
}

const DateRangePicker = dynamic(() => import('@heroui/react').then((mod) => mod.DateRangePicker), { ssr: false });

export default function Property() {
  const params = useParams();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('id');
  const checkIn = searchParams.get('checkin');
  const checkOut = searchParams.get('checkout');
  const adult = searchParams.get('adults');
  const child = searchParams.get('children');

  const [saveProperty, setSaveProperty] = useState<IProperty | null>(null);
  const [saveImageUrl, setSaveImageUrl] = useState<string>('');
  const [saveImageAlt, setSaveImageAlt] = useState<string>('');
  const [isOpenedImage, setIsOpenedImage] = useState(false);
  const [isChosenImage, setIsChosenImage] = useState(false);
  const [isFaciltiesOpened, setIsFaciltiesOpened] = useState(false);
  const [dates, setDates] = useState<IDates | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [isOpenedRooms, setIsOpenedRooms] = useState(false);
  const roomsRef = useRef<HTMLDivElement | null>(null);
  const [selectedOne, setSelectedOne] = useState<string>('null');
  const [canReserve, setCanReserve] = useState(true);
  const { token } = useAuth();
  const [roomId, setRoomId] = useState<number>();
  const [totalPrice, setTotalPrice] = useState<number>();
  const [subTotalPrice, setSubTotalPrice] = useState<number>();
  const [taxes, setTaxes] = useState<number>();
  const [roomType, setRoomType] = useState('');

  function getDaysBetween(checkIn: string, checkOut: string) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays;
  }

  async function searchForProperty() {
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
    if (dates?.start?.month > 0 && dates?.start?.month < 10) startMonth = `0${dates?.start.month}`;
    if (dates?.start?.day > 0 && dates?.start.day < 10) startDay = `0${dates?.start.day}`;
    if (dates?.end?.month > 0 && dates?.end.month < 10) endMonth = `0${dates?.end.month}`;
    if (dates?.end?.day > 0 && dates?.end.day < 10) endDay = `0${dates?.end.day}`;
    
    const getIn = `${dates?.start.year}-${startMonth}-${startDay}`;
    const getOut = `${dates?.end.year}-${endMonth}-${endDay}`;
    if (propertyId == null) return;
    if (checkIn == null) return;
    if (checkOut == null) return;
    const data = await getClass.getProperty(propertyId, checkIn, checkOut);
    setSaveProperty(data.data);
  }

  async function reserveNow() {
    if (selectedOne == 'null') {
      setCanReserve(false);
      setTimeout(() => {
        setCanReserve(true);
      }, 5000);
    } else {
      if (!token) {
        showToast.error('Please signin so that you can reserve a book!', {
          duration: 4000,
          progress: true,
          position: 'top-center',
          transition: 'bounceIn',
          icon: '',
          sound: true,
        });
        return;
      }
      setCanReserve(true);
      const user = await getClass.userProfile(token);
      const days = getDaysBetween(checkIn!, checkOut!);
      const total = (subTotalPrice! + taxes!) * days;
      const checkoutUrl = `/checkout/book?property=${saveProperty?.documentId}&user=${user.documentId}&checkInDate=${checkIn}&checkOutDate=${checkOut}&totalAmount=${total}&status=pending&roomTypeId=${roomId}&rateId=${selectedOne}&quantity=1&price=${total}&mealPlan=BreakfastIncluded&propertyId=${saveProperty?.id}&days=${days}&adults=${adults}&childern=${children}&roomType=${roomType}`;
      window.location.href = checkoutUrl;
    }
  }

  useEffect(() => {
    async function getPropertyDetails() {
      if (propertyId == null) return;
      if (checkIn == null) return;
      if (checkOut == null) return;
      const data = await getClass.getProperty(propertyId, checkIn, checkOut);
      setSaveProperty(data.data);
    }
    getPropertyDetails();

    function getReady() {
      if (adult == null) return;
      if (child == null) return;
      setAdults(Number(adult));
      setChildren(Number(child));
    }
    getReady();
  }, [propertyId, adult, child, checkIn, checkOut]);

  function decreaseAdults() {
    if (adults > 1) setAdults(adults - 1);
  }
  function decreaseChildren() {
    if (children > 0) setChildren(children - 1);
  }
  function decreaseRooms() {
    if (rooms > 1) setRooms(rooms - 1);
  }

  return (
    <>
      <div
        className={`container mx-auto max-w-7xl px-4 py-8 transition-all duration-300 ${isOpenedImage ? 'pointer-events-none opacity-40 blur-sm' : ''}`}
      >
        {/* Header Section */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-1">
            {Array.from({ length: saveProperty?.starRating || 0 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">{saveProperty?.name}</h2>
          <p className="mt-2 flex items-center gap-2 font-medium text-slate-500">
            <MapPin size={16} className="text-blue-500" /> {saveProperty?.address}
          </p>
        </div>

        {/* Layout: Images & Review */}
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Images Grid */}
          <div className="h-[400px] sm:h-[500px] lg:col-span-3">
            <div className="grid h-full grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="h-full w-full cursor-pointer overflow-hidden rounded-l-[2rem] sm:col-span-2">
                {saveProperty?.images?.[0]?.url && (
                  <div className="group relative h-full w-full">
                    <Image
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={`${saveProperty?.images[0].url}`}
                      src={`${baseURL}${saveProperty?.images?.[0]?.url}`}
                      onClick={() => {
                        setSaveImageUrl(`${baseURL}${saveProperty?.images?.[0]?.url}`);
                        setSaveImageAlt(`${saveProperty?.images[0].url}`);
                        setIsOpenedImage(true);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="col-span-1 flex h-full flex-col gap-2">
                {saveProperty?.images?.[1]?.url && (
                  <div className="group relative h-1/2 w-full cursor-pointer overflow-hidden rounded-tr-[2rem]">
                    <Image
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={`${saveProperty?.images[0].url}`}
                      src={`${baseURL}${saveProperty?.images?.[1]?.url}`}
                      onClick={() => {
                        setSaveImageUrl(`${baseURL}${saveProperty?.images?.[1]?.url}`);
                        setSaveImageAlt(`${saveProperty?.images[0].url}`);
                        setIsOpenedImage(true);
                      }}
                    />
                  </div>
                )}
                {saveProperty?.images?.[2]?.url && (
                  <div className="group relative h-1/2 w-full cursor-pointer overflow-hidden rounded-br-[2rem]">
                    <Image
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={`${saveProperty?.images[0].url}`}
                      src={`${baseURL}${saveProperty?.images?.[2]?.url}`}
                      onClick={() => {
                        setSaveImageUrl(`${baseURL}${saveProperty?.images?.[2]?.url}`);
                        setSaveImageAlt(`${saveProperty?.images[0].url}`);
                        setIsOpenedImage(true);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Smaller thumbnails below */}
            <div className="mt-2 grid h-24 grid-cols-4 gap-2 sm:grid-cols-5">
              {saveProperty?.images?.map((image: IImage, index) => {
                if (index > 4) return null;
                return (
                  <div
                    className="group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl"
                    key={image.id}
                  >
                    {image?.url && index == 4 ? (
                      <div
                        className="relative h-full w-full"
                        onClick={() => {
                          setSaveImageUrl(`${baseURL}${image?.url}`);
                          setSaveImageAlt(`${image.alternativeText}`);
                          setIsOpenedImage(true);
                        }}
                      >
                        <Image
                          fill
                          className="object-cover"
                          alt={`${image.alternativeText}`}
                          src={`${baseURL}${image?.url}`}
                        />
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-colors group-hover:bg-slate-900/40" />
                        <h5 className="absolute inset-0 flex items-center justify-center text-sm font-black tracking-widest text-white uppercase">
                          + {saveProperty?.images?.length}
                        </h5>
                      </div>
                    ) : (
                      <div className="relative h-full w-full">
                        <Image
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          alt={`${image.alternativeText}`}
                          src={`${baseURL}${image?.url}`}
                          onClick={() => {
                            setSaveImageUrl(`${baseURL}${image?.url}`);
                            setSaveImageAlt(`${image.alternativeText}`);
                            setIsOpenedImage(true);
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Card */}
          <div className="mt-25 flex flex-col gap-4 sm:mt-0 lg:col-span-1">
            <div className="flex h-full flex-col justify-center rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between border-b border-slate-50 pb-6">
                <div>
                  <h5 className="text-xl font-black text-slate-900">{saveProperty?.reviewWord}</h5>
                  <p className="mt-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                    {saveProperty?.totalReviews} {(saveProperty?.totalReviews ?? 0) > 1 ? 'reviews' : 'review'}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl rounded-br-none bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-600/20">
                  {saveProperty?.userReviewScore}
                </div>
              </div>
              <div className="rounded-2xl bg-blue-50/50 p-4">
                <p className="mb-2 text-xs font-black tracking-widest text-blue-800 uppercase">Guests loved</p>
                <p className="text-sm leading-relaxed font-medium text-slate-600 italic">
                  &quot;{saveProperty?.reviews?.[0]?.comment}&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities Section */}
        <div className="mt-30 mb-10 space-y-4">
          <h3 className="text-xl font-black text-slate-900">Property Highlights</h3>
          <div className="flex flex-wrap gap-3">
            {saveProperty?.topFacilities.map((facilities: TopFacility, index) => {
              if (index > 3) return null;
              return (
                <div
                  key={facilities.name}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
                >
                  <CheckCircle2 size={16} className="text-emerald-500" /> {facilities.name}
                </div>
              );
            })}
            {saveProperty?.facilitiesCategories.map((facilities: FacilitiesCategory, index) => {
              if (index > 2) return null;
              return (
                <div
                  key={facilities.category}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm"
                >
                  <CheckCircle2 size={16} className="text-blue-500" /> {facilities.category}
                </div>
              );
            })}
            <button
              onClick={() => setIsFaciltiesOpened(true)}
              className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-black text-blue-700 transition-colors hover:bg-blue-100"
            >
              See all facilities &rarr;
            </button>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="mb-3 text-xl font-black text-slate-900">About this property</h3>
          <p className="max-w-4xl leading-relaxed font-medium text-slate-600">{saveProperty?.description}</p>
        </div>

        {/* Availability Search Bar */}
        <div className="mb-10 rounded-[2.5rem] bg-slate-950 p-2 shadow-2xl">
          <div className="flex h-full flex-col gap-2 sm:flex-row">
            <div className="flex-[2]">
              <DateRangePicker
                onChange={(newDate) => setDates(newDate)}
                className="h-[72px] w-full"
                variant="flat"
                radius="full"
                classNames={{
                  base: 'bg-white h-[72px] rounded-[2rem] px-4',
                  inputWrapper: 'bg-transparent shadow-none',
                }}
              />
            </div>

            <div ref={roomsRef} className="relative flex-1">
              <button
                className="flex h-[72px] w-full items-center justify-between rounded-[2rem] bg-white px-6 font-bold text-slate-700 transition-colors hover:bg-slate-50"
                onClick={() => setIsOpenedRooms(!isOpenedRooms)}
              >
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-blue-600" />
                  <span className="text-sm">
                    {adults} Ad, {children} Ch, {rooms} Rm
                  </span>
                </div>
                <ChevronDown size={18} className="text-slate-400" />
              </button>

              {isOpenedRooms && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 space-y-6 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-2xl">
                  {[
                    { label: 'Adults', val: adults, inc: () => setAdults(adults + 1), dec: decreaseAdults },
                    { label: 'Children', val: children, inc: () => setChildren(children + 1), dec: decreaseChildren },
                    { label: 'Rooms', val: rooms, inc: () => setRooms(rooms + 1), dec: decreaseRooms },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">{item.label}</h4>
                      <div className="flex items-center gap-4 rounded-xl border border-slate-100 p-1">
                        <button
                          onClick={item.dec}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 font-bold text-blue-600 hover:bg-blue-50"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-black text-slate-900">{item.val}</span>
                        <button
                          onClick={item.inc}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 font-bold text-white shadow-sm hover:bg-blue-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => searchForProperty()}
              className="flex h-[72px] flex-1 items-center justify-center rounded-[2rem] bg-blue-600 px-8 text-lg font-black text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-95"
            >
              Search
            </button>
          </div>
        </div>

        {/* 100% Original Table Structure Maintained, but heavily styled via Tailwind */}
        <div className="mb-10">
          <h3 className="mb-6 text-2xl font-black text-slate-900">Select your room</h3>
          <div className="w-full overflow-scroll rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="p-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Apartment type
                  </th>
                  <th className="p-6 text-center text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Guests
                  </th>
                  <th className="p-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">Price Details</th>
                  <th className="p-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">Your choices</th>
                  <th className="p-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">Select</th>
                  <th className="p-6 text-[10px] font-black tracking-widest text-slate-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {saveProperty?.available_rooms.map((room: AvailableRoom2, index) => (
                  <tr key={room.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="p-6 align-top">
                      <p className="mb-2 text-lg font-black text-blue-600">{room.name}</p>
                      <p className="mb-4 inline-block rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-black tracking-widest text-emerald-700 uppercase">
                        Recommended for {adults} {adults > 1 ? 'adults' : 'adult'}, {children}{' '}
                        {children > 1 ? 'children' : 'child'}
                      </p>
                      <div className="mb-4 flex items-center gap-4 text-xs font-bold text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-slate-300" /> {room.bedrooms} Bedrooms
                        </span>
                        <span className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-slate-300" /> {room.bathrooms} Bathrooms
                        </span>
                      </div>
                      {room.rateOptions.map((option: RateOption2) => (
                        <div key={option.rateId} className="grid gap-2 sm:grid-cols-2">
                          {option.features.map((facilty: string) => (
                            <div
                              key={facilty}
                              className="flex items-start gap-2 rounded-xl border border-slate-100 bg-white p-3 text-xs font-medium text-slate-600 shadow-sm"
                            >
                              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                              <p className="break-words">{facilty}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </td>

                    <td className="p-6 text-center align-top">
                      <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
                        <Users size={16} /> × {room.maxAdults}
                      </div>
                    </td>

                    <td className="space-y-4 p-6 align-top">
                      {room.rateOptions.map((option: RateOption2, idx) => (
                        <div
                          className={`rounded-2xl border p-4 transition-all ${selectedOne == option.rateId ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-slate-100 bg-white'}`}
                          key={option.rateId}
                        >
                          <p className="text-sm font-black text-slate-900">
                            <span className="mr-2 text-slate-400">#{idx + 1}</span> EGP {option.priceForStay}
                          </p>
                          <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                            +EGP {option.taxesAndFees} taxes & charges
                          </p>
                        </div>
                      ))}
                    </td>

                    <td className="space-y-4 p-6 align-top">
                      {room.rateOptions.map((option: RateOption2, idx) => (
                        <div
                          className={`rounded-2xl border p-4 transition-all ${selectedOne == option.rateId ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-slate-100 bg-white'}`}
                          key={option.rateId}
                        >
                          <p className="text-sm font-black text-slate-900">
                            <span className="mr-2 text-slate-400">#{idx + 1}</span> {option.name}
                          </p>
                        </div>
                      ))}
                    </td>

                    <td className={`relative p-6 align-top ${canReserve ? '' : 'bg-red-50/50'}`}>
                      <select
                        onChange={(e) => {
                          const selected = e.target.selectedOptions[0];
                          setSelectedOne(e.target.value);
                          setRoomId(room.id);
                          setRoomType(room.name);
                          setSubTotalPrice(Number(selected.dataset.price));
                          setTaxes(Number(selected.dataset.taxes));
                        }}
                        className={`w-full cursor-pointer appearance-none rounded-2xl border p-4 text-sm font-bold transition-all outline-none ${canReserve ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 focus:border-blue-600 focus:ring-1 focus:ring-blue-600' : 'border-red-300 bg-red-50 text-red-900'}`}
                      >
                        <option value="null">Select Rate...</option>
                        {room.rateOptions.map((option: RateOption2, idx) => (
                          <option
                            key={idx}
                            value={option.rateId}
                            data-price={option.priceForStay}
                            data-taxes={option.taxesAndFees}
                          >
                            #{idx + 1} - EGP {option.priceForStay}
                          </option>
                        ))}
                      </select>

                      {!canReserve && (
                        <div className="animate-in zoom-in-95 absolute top-24 left-1/2 z-10 w-48 -translate-x-1/2 rounded-2xl bg-red-600 p-4 text-center text-xs font-bold text-white shadow-xl duration-200">
                          <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-red-600"></div>
                          <span className="relative z-10">Please select a property rate first.</span>
                        </div>
                      )}
                    </td>

                    {index < 1 && (
                      <td className="p-6 text-right align-top">
                        <button
                          onClick={() => reserveNow()}
                          className="w-full rounded-full bg-blue-600 px-6 py-4 text-sm font-black whitespace-nowrap text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-95"
                        >
                          I&apos;ll Reserve
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {isOpenedImage && (
        <div className="animate-in fade-in fixed inset-0 z-2000 flex items-center justify-center bg-slate-950/80 backdrop-blur-md duration-300">
          <div className="relative flex h-[90vh] w-[90vw] max-w-6xl flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl">
            {isChosenImage ? (
              <div className="flex h-full w-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <button
                    className="flex items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200"
                    onClick={() => {
                      setIsOpenedImage(true);
                      setIsChosenImage(false);
                    }}
                  >
                    <ImageIcon size={18} /> View Grid
                  </button>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
                    onClick={() => {
                      setIsOpenedImage(false);
                      setIsChosenImage(false);
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="relative flex-1 bg-slate-100 p-4">
                  <Image fill className="object-contain" alt={saveImageAlt} src={saveImageUrl} />
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
                  <h3 className="text-xl font-black text-slate-900">Property Gallery</h3>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
                    onClick={() => {
                      setIsOpenedImage(false);
                      setIsChosenImage(false);
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {saveProperty?.images?.map((image: IImage) => (
                      <div
                        className={`relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl border-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${saveImageUrl === `${baseURL}${image?.url}` ? 'border-blue-600 shadow-lg shadow-blue-600/20' : 'border-transparent'}`}
                        key={image.id}
                        onClick={() => {
                          setSaveImageUrl(`${baseURL}${image?.url}`);
                          setSaveImageAlt(`${image.alternativeText}`);
                          setIsChosenImage(true);
                        }}
                      >
                        <Image
                          fill
                          className="object-cover"
                          alt={`${image.alternativeText}`}
                          src={`${baseURL}${image?.url}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Facilities Side Drawer */}
      {isFaciltiesOpened && (
        <div className="animate-in fade-in fixed inset-0 z-2000 flex duration-300">
          <div
            onClick={() => setIsFaciltiesOpened(false)}
            className="flex-1 cursor-pointer bg-slate-950/60 backdrop-blur-sm"
          ></div>
          <div className="animate-in slide-in-from-right flex h-full w-full max-w-md flex-col overflow-hidden rounded-l-[2.5rem] bg-white p-8 shadow-2xl duration-500">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-6">
              <div>
                <h4 className="text-2xl font-black text-slate-900">Facilities</h4>
                <p className="mt-1 text-sm font-medium text-slate-500">Everything {saveProperty?.name} offers.</p>
              </div>
              <button
                onClick={() => setIsFaciltiesOpened(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {saveProperty?.topFacilities.map((facilities: TopFacility) => (
                <div
                  key={facilities.name}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <CheckCircle2 className="shrink-0 text-blue-500" size={18} />
                  <p className="text-sm font-bold text-slate-700">{facilities.name}</p>
                </div>
              ))}
              {saveProperty?.facilitiesCategories.map((facilities: FacilitiesCategory) => (
                <div
                  key={facilities.category}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <CheckCircle2 className="shrink-0 text-blue-500" size={18} />
                  <p className="text-sm font-bold text-slate-700">{facilities.category}</p>
                </div>
              ))}
              {saveProperty?.amenities.map((facilities: string) => (
                <div
                  key={facilities}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <CheckCircle2 className="shrink-0 text-slate-400" size={18} />
                  <p className="text-sm font-bold text-slate-700">{facilities}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
