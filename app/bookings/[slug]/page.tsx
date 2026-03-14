'use client';
import {
  AvailableRoom2,
  FacilitiesCategory,
  IImage,
  IProperty,
  RateOption2,
  TopFacility,
} from '@/app/interface/property';
import { getClass } from '@/services/ApiServices';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { baseURL } from '@/app/page';
import { Slider, CheckboxGroup, Checkbox, Input } from '@heroui/react';
import { ArrowDown } from 'lucide-react';
import { showToast } from 'nextjs-toast-notify';
import { useAuth } from '@/lib/ContextAPI/authContext';
import dynamic from 'next/dynamic';

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

const DateRangePicker = dynamic(() => import("@heroui/react").then((mod) => mod.DateRangePicker), {ssr: false})

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
    const data = await getClass.getProperty(propertyId, checkIn, checkOut);
    console.log(data);
    setSaveProperty(data.data);
  }

  async function reserveNow() {
    if (selectedOne == 'null') {
      setCanReserve(false);
      setTimeout(() => {
        setCanReserve(true);
      }, 5000);
    } else {
      if (!token) return;
      setCanReserve(true);

      const user = await getClass.userProfile(token);
      const days = getDaysBetween(checkIn!, checkOut!);
      const total = (subTotalPrice + taxes) * days;
      const checkoutUrl = `/checkout/book?property=${saveProperty?.documentId}&user=${user.documentId}&checkInDate=${checkIn}&checkOutDate=${checkOut}&totalAmount=${total}&status=pending&roomTypeId=${roomId}&rateId=${selectedOne}&quantity=1&price=${total}&mealPlan=BreakfastIncluded&propertyId=${saveProperty?.id}&days=${days}&adults=${adults}&childern=${children}&roomType=${roomType}`;
      window.location.href = checkoutUrl;
      // const data = await getClass.bookProperty(token, body);
    }
  }

  useEffect(() => {
    async function getPropertyDetails() {
      if (propertyId == null) return;
      const data = await getClass.getProperty(propertyId, checkIn, checkOut);
      setSaveProperty(data.data);
    }
    getPropertyDetails();

    if (adult == null) return;
    if (child == null) return;
    setAdults(Number(adult));
    setChildren(Number(child));
  }, [propertyId, adult, child]);

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

  return (
    <>
      <div className={`my-7 ${isOpenedImage ? 'bg-gray-300' : ''}`}>
        <div className="">
          <span className="flex">
            {Array.from({ length: saveProperty?.starRating || 0 }).map((_, index) => (
              <Star key={index} className="h-3 w-3 fill-amber-500 text-yellow-400" />
            ))}
          </span>
          <h2>{saveProperty?.name}</h2>
          <p className="text-sm">{saveProperty?.address}</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="h-full max-h-full sm:col-span-3">
            <div className="my-4 grid h-75 grid-cols-2 gap-1 sm:grid-cols-3 md:h-fit">
              <div className="h-full w-full cursor-pointer sm:col-span-2">
                {saveProperty?.images?.[0]?.url && (
                  <div className="h-full w-full rounded-sm">
                    <Image
                      width={1200}
                      height={1200}
                      className="h-full w-full rounded-sm object-cover"
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
              <div className="col-span-1 flex h-full flex-col gap-1">
                {saveProperty?.images?.[1]?.url && (
                  <div className="h-1/2 w-full cursor-pointer rounded-sm">
                    <Image
                      width={300}
                      height={300}
                      className="h-full w-full rounded-sm"
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
                  <div className="h-1/2 w-full cursor-pointer rounded-sm">
                    <Image
                      width={300}
                      height={300}
                      className="h-full w-full rounded-sm"
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
            <div className="mt-1 grid grid-cols-4 gap-1 sm:grid-cols-5">
              {saveProperty?.images?.map((image: IImage, index) => {
                if (index > 4) return;
                return (
                  <div className="h-full w-full cursor-pointer" key={image.id}>
                    {image?.url && index == 4 ? (
                      <div
                        className="relative"
                        onClick={() => {
                          setSaveImageUrl(`${baseURL}${image?.url}`);
                          setSaveImageAlt(`${image.alternativeText}`);
                          setIsOpenedImage(true);
                        }}
                      >
                        <Image
                          width={400}
                          height={400}
                          className="h-full w-full rounded-sm object-cover"
                          alt={`${image.alternativeText}`}
                          src={`${baseURL}${image?.url}`}
                        />
                        <div className="absolute inset-0 h-full w-full rounded-sm bg-gray-400 opacity-50"></div>
                        <h5 className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center text-white">
                          + {saveProperty?.images?.length} photos
                        </h5>
                      </div>
                    ) : (
                      <Image
                        width={400}
                        height={400}
                        className="h-full w-full rounded-sm object-cover"
                        alt={`${image.alternativeText}`}
                        src={`${baseURL}${image?.url}`}
                        onClick={() => {
                          setSaveImageUrl(`${baseURL}${image?.url}`);
                          setSaveImageAlt(`${image.alternativeText}`);
                          setIsOpenedImage(true);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-span-1 my-4">
            <div className="rounded-sm border stroke-1 p-2">
              <div className="grid grid-cols-3 gap-5">
                <div className=""></div>
                <div className="col-span-1">
                  <h5>{saveProperty?.reviewWord}</h5>
                  <p className="text-sm">
                    {saveProperty?.totalReviews} {(saveProperty?.totalReviews ?? 0) > 1 ? 'reviews' : 'review'}
                  </p>
                </div>
                <div className="col-span-1 flex items-center justify-center rounded-tl-md rounded-tr-md rounded-br-md bg-blue-800 p-2 font-bold text-white">
                  {saveProperty?.userReviewScore}
                </div>
              </div>
              <div className="border-b py-1"></div>
              <div className="">
                <p className="font-semibold">Guests who stayed here loved</p>
                <p className="pl-10">&quot;{saveProperty?.reviews?.[0]?.comment}&quot;</p>
              </div>
            </div>
          </div>
        </div>
        <div className="my-4">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {saveProperty?.topFacilities.map((facilities: TopFacility, index) => {
              if (index > 3) return;
              return (
                <div key={facilities.name} className="rounded-md border stroke-1 p-2">
                  <p>{facilities.name}</p>
                </div>
              );
            })}
            {saveProperty?.facilitiesCategories.map((facilities: FacilitiesCategory, index) => {
              if (index > 2) return;
              return (
                <div key={facilities.category} className="flex-wrap rounded-md border stroke-1 p-2">
                  <p>{facilities.category}</p>
                </div>
              );
            })}
            {saveProperty?.amenities.map((facilities: string, index) => {
              if (index > 3) return;
              return (
                <div key={facilities} className="flex-wrap rounded-md border stroke-1 p-2">
                  <p>{facilities}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="">
          <h5>About this property</h5>
          <p>{saveProperty?.description}</p>
        </div>
        <div className="my-2 flex flex-col gap-3">
          <h5>Most popular facilities</h5>

          <div className="flex items-center gap-10">
            <p className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px">
                <path d="M14.25 18.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0m1.5 0a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0m2.08-5.833a8.25 8.25 0 0 0-11.666 0 .75.75 0 0 0 1.06 1.06 6.75 6.75 0 0 1 9.546 0 .75.75 0 0 0 1.06-1.06m3.185-3.182c-4.979-4.98-13.051-4.98-18.03 0a.75.75 0 1 0 1.06 1.06c4.394-4.393 11.516-4.393 15.91 0a.75.75 0 1 0 1.06-1.06m2.746-3.603C17.136-.043 6.864-.043.24 6.132A.75.75 0 1 0 1.26 7.23c6.05-5.638 15.429-5.638 21.478 0a.75.75 0 0 0 1.022-1.098z"></path>
              </svg>{' '}
              Wifi
            </p>
            <p className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px">
                <path d="M19.5 9h2.25a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 0 0 1.5h7.5A2.25 2.25 0 0 0 24 12.75v-3a2.25 2.25 0 0 0-2.25-2.25H19.5a.75.75 0 0 0 0 1.5M5.25 13.5h-1.5l.75.75v-6L3.75 9h7.5a.75.75 0 0 0 0-1.5h-7.5a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75h1.5a.75.75 0 0 0 0-1.5M15 12v2.25a.75.75 0 0 0 1.5 0V12a.75.75 0 0 0-1.5 0M0 8.25v6a.75.75 0 0 0 1.5 0v-6a.75.75 0 0 0-1.5 0m1.28 15.53 22.5-22.5A.75.75 0 0 0 22.72.22L.22 22.72a.75.75 0 1 0 1.06 1.06M4.5.75A2.25 2.25 0 0 1 2.25 3 2.25 2.25 0 0 0 0 5.25a.75.75 0 0 0 1.5 0 .75.75 0 0 1 .75-.75A3.75 3.75 0 0 0 6 .75a.75.75 0 0 0-1.5 0"></path>
              </svg>{' '}
              Non-smoking rooms
            </p>
            <p
              onClick={() => setIsFaciltiesOpened(true)}
              className="flex cursor-pointer items-center justify-center gap-2 text-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px">
                <path
                  fill="#2563EB"
                  d="M20.25 11.25h-7.5v-7.5a.75.75 0 0 0-1.5 0v7.5h-7.5a.75.75 0 0 0 0 1.5h7.5v7.5a.75.75 0 0 0 1.5 0v-7.5h7.5a.75.75 0 0 0 0-1.5"
                ></path>
              </svg>{' '}
              See all 14 facilities
            </p>
          </div>
          <div className="border-t-1 w-full pt-2">
            <h4>Availability</h4>
            <div className="grid gap-3 rounded-lg bg-yellow-400 p-2 w-full sm:grid-cols-5">
              <div className="h-full sm:col-span-2">
                <DateRangePicker
                  onChange={(newDate) => setDates(newDate)}
                  className="h-full w-full p-3"
                  aria-label="Check-in and check-out date"
                  label="Check-in Date - Check-out date"
                />
              </div>
              <div ref={roomsRef} className="relative h-full w-full rounded-xl bg-white p-3 sm:col-span-2">
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
              <div className="sm:col-span-1 w-full">
                <button
                  onClick={() => searchForProperty()}
                  className="h-full w-full cursor-pointer rounded-xl bg-blue-600 p-2 font-bold text-white hover:bg-blue-800"
                >
                  Search
                </button>
              </div>
            </div>
            <h5 className="my-3">Book this property</h5>
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse rounded-md border">
                <thead className="rounded-md border">
                  <tr className="rounded-md border">
                    <th className="border p-2">Apartment type</th>
                    <th className="border p-2">Number of guests</th>
                    <th className="border p-2">Price</th>
                    <th className="border p-2">Your choices</th>
                    <th className="border">Select a property</th>
                    <th className="border"></th>
                  </tr>
                </thead>
                <tbody>
                  {saveProperty?.available_rooms.map((room: AvailableRoom2, index) => {
                    return (
                      <tr key={room.id}>
                        <td className="rounded-md border p-2 text-center">
                          <>
                            <p className="text-blue-600">{room.name}</p>
                            <p className="rounded-sm bg-green-200 p-2 font-semibold text-green-800">
                              Recommended for {adults} {adults > 1 ? 'adults' : 'adult'}, {children}{' '}
                              {children > 1 ? 'children' : 'child'}
                            </p>
                            <h6 className="my-2">Bedroom: {room.bedrooms}</h6>
                            <h6 className="mb-2">Bathroom: {room.bathrooms}</h6>
                            {room.rateOptions.map((option: RateOption2) => {
                              return (
                                <div key={option.rateId} className="grid gap-2 sm:grid-cols-2">
                                  {option.features.map((facilty: string) => {
                                    return (
                                      <div key={facilty} className="mb-2 w-full rounded-md border p-2">
                                        <p className="wrap-break-word">{facilty}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </>
                        </td>
                        <td className="border p-2 align-top">
                          <div className="flex items-center gap-1">
                            <svg
                              width="20px"
                              height="20px"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
                                fill="#000000"
                              />
                              <path
                                d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
                                fill="#000000"
                              />
                            </svg>{' '}
                            <span>x</span> <span>{room.maxAdults}</span>
                          </div>
                        </td>
                        <td className="border p-2 align-top">
                          {room.rateOptions.map((option: RateOption2, index) => {
                            return (
                              <div
                                className={`my-1 p-2 ${selectedOne == option.rateId ? 'rounded-md bg-black/5' : ''}`}
                                key={option.rateId}
                              >
                                <p>
                                  {index + 1}- EGP {option.priceForStay}
                                </p>
                                <p className="text-[8px]">+EGP {option.taxesAndFees} taxes and charges</p>
                              </div>
                            );
                          })}
                        </td>
                        <td className={`border p-2 align-top`}>
                          {room.rateOptions.map((option: RateOption2, index) => {
                            return (
                              <div
                                className={`my-1 p-2 ${selectedOne == option.rateId ? 'rounded-md bg-black/5' : ''}`}
                                key={option.rateId}
                              >
                                <p>
                                  {index + 1}- {option.name}
                                </p>
                              </div>
                            );
                          })}
                        </td>
                        <td
                          className={`relative border p-2 text-center align-top ${canReserve ? 'bg-white' : 'bg-red-200'}`}
                        >
                          <select
                            onChange={(e) => {
                              const selected = e.target.selectedOptions[0];

                              setSelectedOne(e.target.value);
                              setRoomId(room.id);
                              setRoomType(room.name);
                              setSubTotalPrice(Number(selected.dataset.price));
                              setTaxes(Number(selected.dataset.taxes));
                            }}
                            className="rounded-sm border border-black"
                          >
                            <option value="null">0</option>
                            {room.rateOptions.map((option: RateOption2, index) => {
                              return (
                                <option
                                  key={index}
                                  value={option.rateId}
                                  data-price={option.priceForStay}
                                  data-taxes={option.taxesAndFees}
                                  className="flex gap-1 p-2"
                                >
                                  {index + 1}- EGP {option.priceForStay}
                                </option>
                              );
                            })}
                          </select>
                          {!canReserve && (
                            <div className="bg-danger absolute top-20 left-[110%] rounded-md p-2 text-white">
                              <p>Please select one or more properties you want to book</p>
                              <div className="border-r-danger absolute top-1/2 right-full -translate-y-1/2 border-8 border-transparent"></div>
                            </div>
                          )}
                        </td>
                        {index < 1 && (
                          <td className="border p-2 align-top">
                            <button
                              onClick={() => reserveNow()}
                              className="rounded-md bg-blue-600 px-5 py-1 text-white hover:bg-blue-800"
                            >
                              I&apos;ll Reserve
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isOpenedImage && (
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/60">
          <div className="relative flex h-[80%] w-[80%] items-center justify-center border bg-white stroke-1">
            {isChosenImage ? (
              <div className="flex h-full w-full flex-col">
                <div className="border-b-1 p-2">
                  <button
                    className="absolute top-2.5 right-5 flex cursor-pointer gap-2 rounded-sm p-2 hover:bg-black/8"
                    onClick={() => {
                      setIsOpenedImage(false);
                      setIsChosenImage(false);
                    }}
                  >
                    <span className="font-bold text-black">Close ✕</span>
                  </button>
                  <button
                    className="flex cursor-pointer gap-2 rounded-sm p-2 hover:bg-black/8"
                    onClick={() => {
                      setIsOpenedImage(true);
                      setIsChosenImage(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15px" data-rtl-flip="true">
                      <path d="M23.25 11.25H.75a.75.75 0 0 0 0 1.5h22.5a.75.75 0 0 0 0-1.5M10.72.97.22 11.47a.75.75 0 0 0 0 1.06l10.5 10.5a.75.75 0 1 0 1.06-1.06l-10.5-10.5v1.06l10.5-10.5A.75.75 0 0 0 10.72.97"></path>
                    </svg>{' '}
                    Gallery
                  </button>
                </div>
                <div className="flex items-center justify-center overflow-auto">
                  <Image
                    width={700}
                    height={700}
                    className="max-h-full max-w-full object-contain p-2"
                    alt={saveImageAlt}
                    src={saveImageUrl}
                  />
                </div>
              </div>
            ) : (
              <div className="mx-4 mt-1 grid h-full max-h-full grid-cols-3 gap-1 overflow-auto sm:grid-cols-5">
                {saveProperty?.images?.map((image: IImage) => {
                  return (
                    <div
                      className={`h-full w-full cursor-pointer overflow-auto ${saveImageUrl == `${baseURL}${image?.url}` ? 'rounded-sm border-2 border-blue-500' : ''}`}
                      key={image.id}
                    >
                      <Image
                        width={400}
                        height={400}
                        className="h-full w-full rounded-sm object-contain"
                        alt={`${image.alternativeText}`}
                        src={`${baseURL}${image?.url}`}
                        onClick={() => {
                          setSaveImageUrl(`${baseURL}${image?.url}`);
                          setSaveImageAlt(`${image.alternativeText}`);
                          setIsChosenImage(true);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            <button
              className="absolute top-2.5 right-5 flex cursor-pointer gap-2 rounded-sm p-2 hover:bg-black/8"
              onClick={() => {
                setIsOpenedImage(false);
                setIsChosenImage(false);
              }}
            >
              <span className="font-bold text-black">Close ✕</span>
            </button>
          </div>
        </div>
      )}
      {isFaciltiesOpened ? (
        <div className="fixed inset-0 z-[2000] flex">
          <div onClick={() => setIsFaciltiesOpened(false)} className="w-[10%] bg-black/40"></div>
          <div
            className={`w-[90%] transform rounded-tl-md rounded-bl-md bg-white p-5 transition-transform duration-300 ease-in-out ${isFaciltiesOpened ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <h4>Facilities of {saveProperty?.name}</h4>
            <p>Great facilities!</p>
            <div className="my-5 grid grid-cols-2 gap-2">
              {saveProperty?.topFacilities.map((facilities: TopFacility, index) => {
                return (
                  <div key={facilities.name} className="rounded-md border stroke-1 p-2">
                    <p>{facilities.name}</p>
                  </div>
                );
              })}
              {saveProperty?.facilitiesCategories.map((facilities: FacilitiesCategory, index) => {
                return (
                  <div key={facilities.category} className="flex-wrap rounded-md border stroke-1 p-2">
                    <p>{facilities.category}</p>
                  </div>
                );
              })}
              {saveProperty?.amenities.map((facilities: string, index) => {
                return (
                  <div key={facilities} className="flex-wrap rounded-md border stroke-1 p-2">
                    <p>{facilities}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
