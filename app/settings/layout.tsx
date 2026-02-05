"use client"
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation';
import { authContext } from '@/lib/ContextAPI/authContext';
import { Button } from '@/components/ui/button';

export default function SettingsLayout({children}: {children: React.ReactNode}) {

  const [isSelected, setIsSelected] = useState(-1);
  const pathName = usePathname();
  const {auth} = useContext(authContext);
  const router = useRouter();
  
  useEffect(() => {
  if(pathName == '/settings'){
    setIsSelected(0);
  } else if(pathName == '/settings/user-edit'){
    setIsSelected(1);
  }
}, []);

  return (
    <div>
      {auth ? <div className="container mx-auto my-5">
          <h2>Settings</h2>
          <div className="my-5 border rounded-2xl">
              <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="col-span-1 border rounded-2xl flex flex-col gap-3 py-4">
                    <Link href={'/settings'} className={`cursor-pointer ${isSelected == 0 ? 'bg-gray-400 p-2 rounded text-white' : ''}`} onClick={() => {setIsSelected(0)}}><h3 className='pl-5'>User Information</h3></Link>
                    <Link href={'/settings/user-edit'} className={`cursor-pointer ${isSelected == 1 ? 'bg-gray-400 p-2 rounded text-white' : ''}`} onClick={() => {setIsSelected(1)}}><h3 className='pl-5'>Information edit</h3></Link>
                  </div>
                  <div className="col-span-2 border rounded-2xl">
                      {children}
                    {/* User Info here if clicked on user information */}
                  </div>
              </div>
          </div>
      </div> : <div className='text-center'>
            <h1 className='my-5'>Please login to access the settings</h1>
            <Button className='cursor-pointer' onClick={() => router.push('/login')}>Login</Button>
        </div> }
    </div>
  )
}
