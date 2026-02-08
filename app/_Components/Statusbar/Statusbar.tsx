'use client';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import React from 'react';
import Link from 'next/link';
import { cartCount } from '@/lib/ContextAPI/cartCount';

export default function Statusbar() {
  const pathName = usePathname();
  const [isSelected, setIsSelected] = useState(-1);
  const { countt, setCountt } = useContext(cartCount);

  useEffect(() => {
    if (pathName == '/') {
      setIsSelected(0);
    } else if (pathName == '/cart') {
      setIsSelected(1);
    } else if (pathName == '/orders') {
      setIsSelected(2);
    } else if (pathName == '/settings') {
      setIsSelected(3);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 block grid w-full grid-cols-4 gap-4 rounded-tl-xl rounded-tr-xl bg-gray-200 text-gray-400 sm:hidden">
      <Link href={'/'} onClick={() => setIsSelected(0)} className={`${isSelected == 0 ? 'rounded text-black' : ''}`}>
        <h2 className="p-2 text-center">Home</h2>
      </Link>
      <Link
        href={'/cart'}
        onClick={() => setIsSelected(1)}
        className={`${isSelected == 1 ? 'rounded text-black' : ''} relative`}
      >
        <h2 className="p-2 text-center">Cart</h2>{' '}
        <div className="absolute flex h-[18px] w-[18px] items-center justify-center rounded-4xl bg-gray-200">
          {countt}
        </div>{' '}
      </Link>
      <Link
        href={'/orders'}
        onClick={() => setIsSelected(2)}
        className={`${isSelected == 2 ? 'rounded text-black' : ''}`}
      >
        <h2 className="p-2 text-center">Orders</h2>
      </Link>
      <Link
        href={'/settings'}
        onClick={() => setIsSelected(3)}
        className={`${isSelected == 3 ? 'rounded text-black' : ''}`}
      >
        <h2 className="p-2 text-center">Setting</h2>
      </Link>
    </div>
  );
}
