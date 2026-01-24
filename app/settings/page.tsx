"use client"
import { Button } from '@/components/ui/button';
import { authContext } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices'
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { baseURL2 } from '../page';

export default function Settings() {

  const [userInfo, setUserInfo] = useState(true);
  const [userEdit, setUserEdit] = useState(false);
  const {userData, setAuth, setUserData} = useContext(authContext)
  const { handleSubmit, reset, formState: {errors}, register} = useForm({
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
    },
    // resolver: zodResolver(updateSchema),
  })
  
  useEffect(() => {
  if (userEdit && userData) {
    reset({
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
    });
  }
}, [userEdit, userData, reset]);

  async function sendData(data: any) {
  console.log("Updated user data:", data);
  const raw = localStorage.getItem("user");
      let token: string|null = raw;
      if(token && token.trim().startsWith('"')){
          token = JSON.parse(token)
      }

  if(data.currentPassword && data.newPassword){
    const reData: any = {
      "username": data.username,
      "email": data.email,
      "phone": data.phone,
      "currentPassword": data.currentPassword,
      "newPassword": data.newPassword,
    }
    const response = await fetch(`${baseURL2}me`,{
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        ...(token ? {Authorization: `Bearer ${token}`} : {})
      },
      body: JSON.stringify(reData)
    });
    const dataa = await response.json();
    setUserData(dataa);
  }

  const reData: any = {
    "username": data.username,
    "email": data.email,
    "phone": data.phone,
  }
  const response = await fetch(`${baseURL2}me`,{
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {})
    },
    body: JSON.stringify(reData)
  });
  const dataa = await response.json();
  setUserData(dataa);
  setUserEdit(false);
  setUserInfo(true);
};

  return (
    <div className="container mx-auto my-5">
        <h2>Settings</h2>
        <div className="my-5 border rounded-2xl">
            <div className="p-5 grid grid-cols-3 gap-4">
                <div className="col-span-1 border rounded-2xl flex flex-col gap-3 py-4">
                  <button className={`cursor-pointer ${userInfo ? 'text-gray-500' : ''}`} onClick={() => {setUserInfo(true); setUserEdit(false)}}><h3 className='pl-5'>User Information</h3></button>
                  <button className={`cursor-pointer ${userEdit ? 'text-gray-500' : ''}`} onClick={() => {setUserEdit(true); setUserInfo(false)}}><h3 className='pl-5'>Information edit</h3></button>
                </div>
                <div className="col-span-2 border rounded-2xl">
                  {/* User Info here if clicked on user information */}
                  {userInfo && userData && <div className="p-5 flex flex-col gap-3">
                    <h3>Name: {userData?.username}</h3>
                    <h3>Phone: {userData?.phone}</h3>
                    <h3>Email: {userData?.email}</h3>
                    <h3>Account Confirmed: {userData?.confirmed+''}</h3>
                  </div>}
                  {/* User Info here if clicked on information edit */}
                  {userEdit && <div className="p-5">
                    <h3>User Edit Information</h3>
                    <div className="pt-5">
                      <form className='grid grid-cols-2 gap-3' onSubmit={handleSubmit(sendData)} action="">
                        <input className='border rounded-2xl p-5' placeholder='User Name' {...register("username")} type="text" />
                        <input className='border rounded-2xl p-5' placeholder='Phone number' {...register("phone")} type="tel" />
                        <input className='border rounded-2xl p-5' placeholder='Email' {...register("email")} type="email" />
                        <input className='border rounded-2xl p-5' placeholder='Old Password' type="password" {...register("currentPassword")} />
                        <input className='border rounded-2xl p-4' placeholder='New Password' type="password" {...register("newPassword")} />
                        <div className='flex flex-col gap-3'>
                          <select className='border rounded-2xl p-3' name="" id="">
                            <option value="">Confirmed</option>
                            <option value="">Disabled</option>
                          </select>
                          <Button type='submit'>Save</Button>
                        </div>
                      </form>
                    </div>
                  </div> }
                </div>
            </div>
        </div>
    </div>
  )
}
