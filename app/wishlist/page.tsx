'use client';
import { authContext, useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import React, { useEffect, useState } from 'react';
import { IVendorPageProduct } from '../interface/VendorPage/vendorPageProduct';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import FavoriteButton from '../_Components/Icons/FavouriteIcon';
import { useRouter } from 'next/navigation';
import { IWishList } from '../interface/wishlist';

export default function Wishlist() {
  const { token } = useAuth();
  const [saveWishList, setSaveWishList] = useState<IWishList[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function getWishList() {
      if (!token) return; // 👈 guard
      const data = await getClass.getWishList(token);
      setSaveWishList(data.data);
      // vendorPageProducts();
    }
    getWishList();
  }, [token]);
  return (
    <div className="container mx-auto my-5">
      <div className="flex items-center gap-1">
        <h2 onClick={() => router.push('/profile')} className="counter cursor-pointer">
          <svg width="2em" height="2em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 12H8M8 12L12 8M8 12L12 16"
              stroke="black"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </h2>
        <h1>Wishlist</h1>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {saveWishList?.map((myWishlist: IWishList) => {
          const isWishlisted = saveWishList?.some((wish: IWishList) => wish.product.id === myWishlist.product.id);
          const wishlistItems = saveWishList?.filter((wish: IWishList) => wish.product.id === myWishlist.product.id);
          return (
            <div key={myWishlist.id} className="relative text-center">
              <Link href={`/vendors/${myWishlist.product.vendor.id}/${myWishlist.product.slug}`}>
                <Image
                  width={500}
                  height={500}
                  className="w-full rounded-2xl object-cover"
                  src={IMAGE_PLACEHOLDER}
                  alt={myWishlist.product.title}
                />
              </Link>
              <div className="absolute top-2 right-2">
                <FavoriteButton
                  onAdd={() => ''}
                  isWishlisted={isWishlisted ?? false}
                  wishlistItems={wishlistItems ?? []}
                  productId={myWishlist.product.id}
                />
              </div>
              <Link href={`/vendors/${myWishlist.product.vendor.id}/${myWishlist.product.slug}`}>
                <h4 className="cursor-pointer">{myWishlist.product.title}</h4>
              </Link>
              <div className="mt-1 flex cursor-default justify-center gap-2">
                {myWishlist.product.baseSalePrice ? (
                  <p className="text-red-500 line-through">{myWishlist.product.basePrice} EGP</p>
                ) : (
                  <p className="text-green-900">{myWishlist.product.basePrice} EGP</p>
                )}
                {myWishlist.product.baseSalePrice && (
                  <p className="text-green-900">{myWishlist.product.baseSalePrice} EGP</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
