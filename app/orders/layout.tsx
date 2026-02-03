"use client";
import { Button } from '@/components/ui/button';
import { authContext } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

export default function OrderLayout({children}: {children: React.ReactNode}) {
    const pathname = usePathname();
    const {auth, setAuth} = useContext(authContext);
    const [isSelected, setIsSelected] = useState(-1);
    const router = useRouter();
    
    useEffect(() => {
        if(!auth){
            router.push('/login')
        }
        if(pathname == '/orders'){
            setIsSelected(0);
        } else if(pathname == '/orders/completed'){
            setIsSelected(1);
        } else if(pathname == '/orders/cancelled'){
            setIsSelected(2);
        }
    },[])
  return (
    <div>
        {auth ? <div>
            <h1>Orders</h1>
            <div className="grid grid-cols-3 mx-auto mt-3">
                <Link onClick={() => setIsSelected(0)} className={`hover:bg-gray-300 text-center p-2 rounded-xl ${isSelected == 0 ? 'bg-gray-300' : ''}`} href={'/orders/'}><h3>Processing</h3></Link>
                <Link onClick={() => setIsSelected(1)} className={`hover:bg-gray-300 text-center p-2 rounded-xl ${isSelected == 1 ? 'bg-gray-300' : ''}`} href={'/orders/completed'}><h3>Completed</h3></Link>
                <Link onClick={() => setIsSelected(2)} className={`hover:bg-gray-300 text-center p-2 rounded-xl ${isSelected == 2 ? 'bg-gray-300' : ''}`} href={'/orders/cancelled'}><h3>Cancelled</h3></Link>
            </div>
            <div className="mt-5">
                {children}
            </div>
        </div> : <div className='text-center'>
            <h1 className='my-5'>Please login to see your orders!</h1>
            <Button className='cursor-pointer' onClick={() => router.push('/login')}>Login</Button>
        </div>}
    </div>
  )
}
