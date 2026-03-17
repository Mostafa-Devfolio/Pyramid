'use client';
import { baseURL2 } from '@/app/[locale]/page';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/ContextAPI/authContext';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export interface IUserData {
  username: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
}
export interface IUserData2 {
  username: string;
  email: string;
  phone: string;
}

export default function UserEdit() {
  const { userData, setUserData } = useAuth();
  const { handleSubmit, reset, register } = useForm({
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
    },
  });

  async function sendData(data: IUserData) {
    const raw = localStorage.getItem('user');
    let token: string | null = raw;
    if (token && token.trim().startsWith('"')) {
      token = JSON.parse(token);
    }

    const updatePath = `${baseURL2}me`;
    const headers = {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let finalData;
    if (data.currentPassword && data.newPassword) {
      const response = await fetch(updatePath, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      finalData = await response.json();
    } else {
      const reData: IUserData2 = { username: data.username, email: data.email, phone: data.phone };
      const response = await fetch(updatePath, {
        method: 'PUT',
        headers,
        body: JSON.stringify(reData),
      });
      finalData = await response.json();
    }
    setUserData(finalData);
  }

  useEffect(() => {
    if (userData) {
      reset({
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
      });
    }
  }, [userData, reset]);

  return (
    <div className="animate-in fade-in space-y-8 p-6 duration-500 sm:p-10">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Edit Information</h2>
        <p className="text-sm font-medium text-gray-500">Update your profile credentials and security.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(sendData)}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="px-1 text-[10px] font-black text-gray-400 uppercase">User Name</label>
            <input
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
              placeholder="Username"
              {...register('username')}
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label className="px-1 text-[10px] font-black text-gray-400 uppercase">Phone Number</label>
            <input
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
              placeholder="Phone number"
              {...register('phone')}
              type="tel"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="px-1 text-[10px] font-black text-gray-400 uppercase">Email Address</label>
            <input
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
              placeholder="Email"
              {...register('email')}
              type="email"
            />
          </div>

          <div className="space-y-2">
            <label className="px-1 text-[10px] font-black text-gray-400 uppercase">Current Password</label>
            <input
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
              placeholder="••••••••"
              type="password"
              {...register('currentPassword')}
            />
          </div>
          <div className="space-y-2">
            <label className="px-1 text-[10px] font-black text-gray-400 uppercase">New Password</label>
            <input
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
              placeholder="••••••••"
              type="password"
              {...register('newPassword')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6">
          <div className="space-y-2">
            <label className="px-1 text-[10px] font-black text-gray-400 uppercase">Account Visibility</label>
            <select className="w-full cursor-pointer appearance-none rounded-2xl border border-gray-100 bg-gray-50 p-4 font-bold transition-colors outline-none hover:bg-gray-100">
              <option value="">Public / Confirmed</option>
              <option value="">Private / Hidden</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-black py-5 text-lg font-bold text-white shadow-xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
