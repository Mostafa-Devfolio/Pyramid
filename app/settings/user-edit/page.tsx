'use client';
import { baseURL2 } from '@/app/page';
import { Button } from '@/components/ui/button';
import { authContext } from '@/lib/ContextAPI/authContext';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function UserEdit() {
  const [userEdit, setUserEdit] = useState(true);
  const [userInfo, setUserInfo] = useState(true);
  const { userData, setAuth, setUserData } = useContext(authContext);
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
    },
    // resolver: zodResolver(updateSchema),
  });

  async function sendData(data: any) {
    console.log('Updated user data:', data);
    const raw = localStorage.getItem('user');
    let token: string | null = raw;
    if (token && token.trim().startsWith('"')) {
      token = JSON.parse(token);
    }
    if (data.currentPassword && data.newPassword) {
      const reData: any = {
        username: data.username,
        email: data.email,
        phone: data.phone,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };
      const response = await fetch(`${baseURL2}me`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(reData),
      });
      const dataa = await response.json();
      setUserData(dataa);
    }

    const reData: any = {
      username: data.username,
      email: data.email,
      phone: data.phone,
    };
    const response = await fetch(`${baseURL2}me`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(reData),
    });
    const dataa = await response.json();
    setUserData(dataa);
    setUserEdit(false);
    setUserInfo(true);
  }

  useEffect(() => {
    if (userEdit && userData) {
      reset({
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
      });
    }
  }, [userEdit, userData, reset]);
  return (
    <div className="container mx-auto my-5">
      <div className="my-5">
        <div className="grid grid-cols-1 gap-4 p-5">
          <div className="">
            {/* User Info here if clicked on information edit */}
            {userEdit && (
              <div className="p-5">
                <h3>User Edit Information</h3>
                <div className="pt-5">
                  <form className="grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={handleSubmit(sendData)} action="">
                    <input
                      className="rounded-2xl border p-5"
                      placeholder="User Name"
                      {...register('username')}
                      type="text"
                    />
                    <input
                      className="rounded-2xl border p-5"
                      placeholder="Phone number"
                      {...register('phone')}
                      type="tel"
                    />
                    <input className="rounded-2xl border p-5" placeholder="Email" {...register('email')} type="email" />
                    <input
                      className="rounded-2xl border p-5"
                      placeholder="Old Password"
                      type="password"
                      {...register('currentPassword')}
                    />
                    <input
                      className="rounded-2xl border p-4"
                      placeholder="New Password"
                      type="password"
                      {...register('newPassword')}
                    />
                    <div className="flex flex-col gap-3">
                      <select className="rounded-2xl border p-3" name="" id="">
                        <option value="">Confirmed</option>
                        <option value="">Disabled</option>
                      </select>
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
