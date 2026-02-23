'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { addressSchema } from '@/lib/Schema/schema';
import { getClass } from '@/services/ApiServices';
import { getLoginTo } from '@/app/login/login';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamically import map to avoid SSR errors
const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full animate-pulse items-center justify-center rounded-xl bg-gray-100">
      Loading Map...
    </div>
  ),
});

interface IAddressSubmit {
  label: string;
    street: string;
    building: string;
    floor: string;
    apartment: string;
    city: string;
    other: string;
    isDefault: boolean;
}

export default function AddAddress() {
  const router = useRouter();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(false);

  const {
    handleSubmit,
    register,
    setValue, // Used to auto-fill the form from the map
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      label: '',
      street: '',
      building: '',
      floor: '',
      apartment: '',
      city: '',
      isDefault: false,
      other: '',
    },
    mode: 'onChange',
    resolver: zodResolver(addressSchema),
  });

  const handleMapSelect = async (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    setIsMapLoading(true);

    try {
      const data = await getClass.getMaps(lat, lng);
      if (data?.street) {
        setValue('street', data.street, { shouldValidate: true });
      } else if (data?.formattedAddress) {
        setValue('street', data.formattedAddress, { shouldValidate: true });
      }
      if (data?.city) {
        setValue('city', data.city, { shouldValidate: true });
      }
    } catch (error) {
      console.error('Failed to reverse geocode:', error);
    } finally {
      setIsMapLoading(false);
    }
  };

  async function addAddress(myData: IAddressSubmit) {
    if (!coordinates) {
      alert('Please select a location on the map first.');
      return;
    }

    const token = await getLoginTo();

    // Combine manual form data with map coordinates
    const finalData = {
      ...myData,
      lat: coordinates.lat,
      lng: coordinates.lng,
    };

    // Make sure getClass.addAddress points to /api/addresses/from-coordinates in your ApiServices!
    const data = await getClass.addAddress(finalData, token);
    router.push('/address');
  }

  return (
    <div className="mx-auto mt-3 max-w-4xl">
      <h1 className="mb-4 text-xl font-bold">Add New Address</h1>

      {/* 1. Map Section */}
      <div className="mb-6">
        <label className="mb-2 flex gap-1 font-medium">
          <p className="text-red-600">*</p> Pin Location on Map
        </label>
        <MapPicker onLocationSelect={handleMapSelect} />
        {isMapLoading && <p className="mt-2 text-sm text-blue-500">Auto-detecting street name...</p>}
      </div>

      {/* 2. Manual Form Section */}
      <form onSubmit={handleSubmit(addAddress)} className="mt-3 grid grid-cols-2 gap-4">
        {/* ... KEEP YOUR EXISTING FORM FIELDS EXACTLY AS THEY WERE ... */}
        <div className="flex flex-col gap-2">
          <label className="flex gap-1" htmlFor="label">
            <p className="text-red-600">*</p> Label
          </label>
          <input
            required
            className="rounded-xl border p-2"
            type="text"
            id="label"
            placeholder="Home, Work..."
            {...register('label')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex gap-1" htmlFor="street">
            <p className="text-red-600">*</p> Street
          </label>
          <input
            required
            className="rounded-xl border bg-gray-50 p-2"
            type="text"
            id="street"
            placeholder="Auto-filled from map"
            {...register('street')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex gap-1" htmlFor="building">
            <p className="text-red-600">*</p> Building
          </label>
          <input
            required
            className="rounded-xl border p-2"
            type="text"
            id="building"
            placeholder="Building"
            {...register('building')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex gap-1" htmlFor="floor">
            <p className="text-red-600">*</p> Floor
          </label>
          <input
            required
            className="rounded-xl border p-2"
            type="text"
            id="floor"
            placeholder="Floor"
            {...register('floor')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex gap-1" htmlFor="apartment">
            <p className="text-red-600">*</p> Apartment
          </label>
          <input
            required
            className="rounded-xl border p-2"
            type="text"
            id="apartment"
            placeholder="Apartment"
            {...register('apartment')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex gap-1" htmlFor="city">
            <p className="text-red-600">*</p> City
          </label>
          <input
            required
            className="rounded-xl border bg-gray-50 p-2"
            type="text"
            id="city"
            placeholder="Auto-filled from map"
            {...register('city')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex gap-1" htmlFor="other">
            Other Details
          </label>
          <input
            className="rounded-xl border p-2"
            type="text"
            id="other"
            placeholder="Other Details"
            {...register('other')}
          />
        </div>

        <div className="flex flex-col justify-center gap-2">
          <label className="flex gap-1" htmlFor="isDefault">
            Is Default
          </label>
          <input className="h-6 w-6 rounded-xl border p-2" type="checkbox" id="isDefault" {...register('isDefault')} />
        </div>

        <div className="col-span-2">
          <Button type="submit" className="mt-4 w-full" disabled={!coordinates}>
            {coordinates ? 'Save Address' : 'Please Drop a Pin on the Map First'}
          </Button>
        </div>
      </form>
    </div>
  );
}
