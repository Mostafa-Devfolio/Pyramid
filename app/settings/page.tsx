"use client"
import { authContext } from '@/lib/ContextAPI/authContext';
import { Button } from '@headlessui/react';
import React, { useContext, useState } from 'react'

export default function UserInfo() {
    const [userInfo, setUserInfo] = useState(true);
    const {userData, setAuth, setUserData} = useContext(authContext)
  return (
    <div className="container mx-auto my-5">
        <div className="my-5">
            <div className="p-5 grid grid-cols-1 gap-4">
                <div className="">
                  {/* User Info here if clicked on user information */}
                  {userInfo && userData && <div className="p-5 flex flex-col gap-3">
                    <h2>User Information</h2>
                    <h3 className='mt-3'>Name: {userData?.username}</h3>
                    <h3>Phone: {userData?.phone}</h3>
                    <h3>Email: {userData?.email}</h3>
                    <h3>Account Confirmed: {userData?.confirmed+''}</h3>
                  </div>}
                </div>
            </div>
        </div>
    </div>
  )
}
