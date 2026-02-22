'use client';
import { authContext, useAuth } from '@/lib/ContextAPI/authContext';
import { Button } from '@headlessui/react';
import React, { useContext, useState } from 'react';

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState(true);
  const { userData, setAuth, setUserData } = useAuth();
  return (
    <div className="container mx-auto my-5">
      <div className="my-5">
        <div className="grid grid-cols-1 gap-4 p-5">
          <div className="">
            {/* User Info here if clicked on user information */}
            {userInfo && userData && (
              <div className="flex flex-col gap-3 p-5">
                <h2>User Information</h2>
                <h3 className="mt-3">Name: {userData?.username}</h3>
                <h3>Phone: {userData?.phone}</h3>
                <h3>Email: {userData?.email}</h3>
                <h3>Account Confirmed: {userData?.confirmed + ''}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
