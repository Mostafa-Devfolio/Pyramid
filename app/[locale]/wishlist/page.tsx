'use client';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { getClass } from '@/services/ApiServices';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import FavoriteButton from '../_Components/Icons/FavouriteIcon';
import { useRouter } from 'next/navigation';
import { IWishList } from '../interface/wishlist';
import { ChevronLeft, Heart } from 'lucide-react';

export default function Wishlist() {
  const { token } = useAuth();
  const [saveWishList, setSaveWishList] = useState<IWishList[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function getWishList() {
      if (!token) return;
      const data = await getClass.getWishList(token);
      setSaveWishList(data.data);
    }
    getWishList();
  }, [token]);

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-10">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/profile')}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:scale-105 hover:bg-gray-50 active:scale-95"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Your Wishlist</h1>
          <p className="text-sm font-medium text-gray-500">Items you&apos;ve saved for later.</p>
        </div>
      </div>

      {saveWishList && saveWishList.length > 0 ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-6 duration-500 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {saveWishList.map((myWishlist: IWishList) => {
            const isWishlisted = saveWishList?.some((wish: IWishList) => wish.product.id === myWishlist.product.id);
            const wishlistItems = saveWishList?.filter((wish: IWishList) => wish.product.id === myWishlist.product.id);

            return (
              <div
                key={myWishlist.id}
                className="group relative flex flex-col rounded-[2.5rem] border border-gray-100 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/5"
              >
                {/* Product Image Section */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-gray-50">
                  <Link href={`/vendors/${myWishlist.product.vendor.id}/${myWishlist.product.slug}`}>
                    <Image
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      src={IMAGE_PLACEHOLDER} // Original placeholder logic preserved
                      alt={myWishlist.product.title}
                    />
                  </Link>

                  {/* Floating Heart Icon Container */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="rounded-full bg-white/80 shadow-sm backdrop-blur-md">
                      <FavoriteButton
                        onAdd={() => ''}
                        isWishlisted={isWishlisted ?? false}
                        wishlistItems={wishlistItems ?? []}
                        productId={myWishlist.product.id}
                      />
                    </div>
                  </div>

                  {/* Sale Badge */}
                  {myWishlist.product.baseSalePrice && (
                    <div className="absolute top-3 left-3 rounded-full bg-red-500 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-sm">
                      Sale
                    </div>
                  )}
                </div>

                {/* Product Text Details */}
                <div className="flex flex-1 flex-col p-4 text-center">
                  <Link href={`/vendors/${myWishlist.product.vendor.id}/${myWishlist.product.slug}`}>
                    <h4 className="line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                      {myWishlist.product.title}
                    </h4>
                  </Link>
                  <p className="mt-1 mb-3 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                    {myWishlist.product.vendor.name}
                  </p>

                  <div className="mt-auto flex items-center justify-center gap-2 border-t border-gray-50 pt-2">
                    {myWishlist.product.baseSalePrice ? (
                      <>
                        <span className="text-xs font-bold text-gray-400 line-through">
                          {myWishlist.product.basePrice} EGP
                        </span>
                        <span className="text-lg font-black text-red-600">{myWishlist.product.baseSalePrice} EGP</span>
                      </>
                    ) : (
                      <span className="text-lg font-black text-gray-900">{myWishlist.product.basePrice} EGP</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-gray-200 bg-gray-50/50 py-32 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white text-gray-300 shadow-lg">
            <Heart size={40} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900">Your Wishlist is Empty</h2>
          <p className="mx-auto mt-2 mb-8 max-w-xs font-medium text-gray-500">
            Save the items you love to find them easily here later.
          </p>
          <button
            onClick={() => router.push('/')}
            className="rounded-full bg-black px-10 py-4 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Explore Products
          </button>
        </div>
      )}
    </div>
  );
}
