'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { addressSchema } from '@/lib/Schema/schema';
import { getClass } from '@/services/ApiServices';
import { getLoginTo } from '@/app/[locale]/login/login';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { MapPin, Globe, Home, Building2, Layers, DoorOpen, Info, CheckCircle2 } from 'lucide-react';

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="flex h-100 w-full animate-pulse items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-100 font-bold text-slate-400">
      Initializing Maps...
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
    setValue,
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
    const finalData = {
      ...myData,
      lat: coordinates.lat,
      lng: coordinates.lng,
    };
    await getClass.addAddress(finalData, token);
    router.push('/address');
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-10 px-4 py-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Add New Address</h1>
        <p className="font-medium text-slate-500">Pin your location and provide delivery details.</p>
      </div>

      {/* 1. Map Section - Full Width Card */}
      <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-2 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <MapPin size={18} />
          </div>
          <span className="font-bold text-slate-700">Drop a pin at your delivery location</span>
          {isMapLoading && (
            <span className="ml-auto flex animate-pulse items-center gap-2 text-xs font-black text-blue-600 uppercase">
              Detecting...
            </span>
          )}
        </div>
        <div className="h-[400px] w-full overflow-hidden rounded-[2rem]">
          <MapPicker onLocationSelect={handleMapSelect} />
        </div>
      </div>

      {/* 2. Form Section */}
      <form onSubmit={handleSubmit(addAddress)} className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        {/* Basic Details Card */}
        <div className="space-y-6 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-black text-slate-900">
            <Home size={20} className="text-blue-500" /> Location Info
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Label (e.g. Home, Work) *
              </label>
              <input
                {...register('label')}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                placeholder="Give it a name..."
              />
              {errors.label && <p className="px-1 text-xs font-bold text-red-500">{errors.label.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Street Address *
              </label>
              <div className="relative">
                <input
                  {...register('street')}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-100/50 p-4 font-bold text-slate-600 outline-none"
                  placeholder="Will be auto-filled..."
                  readOnly
                />
                <Globe className="absolute top-4 right-4 text-slate-300" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">City *</label>
              <input
                {...register('city')}
                className="w-full rounded-2xl border border-slate-100 bg-slate-100/50 p-4 font-bold text-slate-600 outline-none"
                placeholder="City"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Building Details Card */}
        <div className="space-y-6 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-black text-slate-900">
            <Building2 size={20} className="text-blue-500" /> Building Details
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">Building *</label>
              <input
                {...register('building')}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                placeholder="Bldg #"
              />
            </div>
            <div className="space-y-2">
              <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">Floor *</label>
              <input
                {...register('floor')}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                placeholder="Floor #"
              />
            </div>
            <div className="space-y-2">
              <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Apartment *
              </label>
              <input
                {...register('apartment')}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                placeholder="Apt #"
              />
            </div>
            <div className="space-y-2">
              <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">Default</label>
              <div className="flex h-[58px] items-center rounded-2xl border border-slate-100 bg-slate-50 px-4">
                <input
                  type="checkbox"
                  {...register('isDefault')}
                  className="h-6 w-6 cursor-pointer rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-xs font-bold tracking-widest text-slate-500 uppercase">Set as Main</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Other Details (Optional)
            </label>
            <textarea
              {...register('other')}
              rows={2}
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 font-medium transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
              placeholder="Landmarks, security codes..."
            />
          </div>
        </div>

        {/* Submit Button Area */}
        <div className="pt-4 lg:col-span-2">
          <button
            type="submit"
            disabled={!coordinates}
            className="w-full rounded-full bg-slate-900 py-6 text-xl font-black text-white shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {coordinates ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 size={24} /> Save Address
              </span>
            ) : (
              'Pin Location on Map First'
            )}
          </button>
          {!coordinates && (
            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs font-bold tracking-widest text-red-500 uppercase">
              <Info size={14} /> Maps selection is required to calculate delivery fees
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
