"use client"
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import React from "react";
import Link from 'next/link';

export default function Statusbar() {
    const pathName = usePathname();
    const [isSelected, setIsSelected] = useState(-1);

    useEffect(() => {
        if(pathName == '/'){
            setIsSelected(0);
        } else if(pathName == '/cart'){
            setIsSelected(1);
        } else if(pathName == '/orders'){
            setIsSelected(2);
        } else if(pathName == '/settings'){
            setIsSelected(3);
        }
    },[]);

  return (
    <div className="grid grid-cols-4 gap-4 fixed bottom-0 left-0 w-full text-gray-400 rounded-tl-xl rounded-tr-xl bg-gray-200 block sm:hidden">
        <Link href={'/'} onClick={() => setIsSelected(0)} className={`${isSelected == 0 ? 'text-black rounded' : ''}`}><h2 className='p-2 text-center'>Home</h2></Link>
        <Link href={'/cart'} onClick={() => setIsSelected(1)} className={`${isSelected == 1 ? 'text-black rounded' : ''}`}><h2 className='p-2 text-center'>Cart</h2></Link>
        <Link href={'/orders'} onClick={() => setIsSelected(2)} className={`${isSelected == 2 ? 'text-black rounded' : ''}`}><h2 className='p-2 text-center'>Orders</h2></Link>
        <Link href={'/settings'} onClick={() => setIsSelected(3)} className={`${isSelected == 3 ? 'text-black rounded' : ''}`}><h2 className='p-2 text-center'>Setting</h2></Link>
    </div>
  );
}
