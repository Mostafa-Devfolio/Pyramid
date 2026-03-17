import React from 'react';
import { CarouselHome } from '../../Carsoul/Carsoul';
import HomeCategory from '../HomeCategory/HomeCategory';
import HomeVendorsFetching from '../HomeVendorsFetching/HomeVendorsFetching';
import { getClass } from '@/services/ApiServices';
import { getLoginTo } from '@/app/[locale]/login/login';
import HomeProductsFetching from '../HomeProductsFetching/HomeProductsFetching';

type types = {
  id: string;
  busType?: string;
  myE?: string;
};

export default async function ReuseBusinessTypes({ id, busType, myE }: types) {
  console.log(id);
  const token = await getLoginTo();

  if (id == 'restaurants' && token) {
    const data = await getClass.getCartItems(1, token);
  } else if (id == 'groceries' && token) {
    const data = await getClass.getCartItems(2, token);
  } else if (id == 'pharmacies' && token) {
    const data = await getClass.getCartItems(3, token);
  } else if (id == 'e-commerce' && token) {
    const data = await getClass.getCartItems(4, token);
  }

  return (
    <>
      {id == busType && (
        <div className="container mx-auto space-y-16 px-4 pt-6 pb-20">
          <div className="mx-auto w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/5">
            <CarouselHome mainType={id} typee="business_home" />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Explore Categories</h2>
            <HomeCategory mainType={id} />
          </div>

          {id != 'e-commerce' ? (
            <div className="space-y-16">
              <HomeVendorsFetching businessTypee={'discounted'} mainType={id} />
              <HomeVendorsFetching businessTypee="most" mainType={id} />
              <HomeVendorsFetching businessTypee="top" mainType={id} />
              <HomeVendorsFetching businessTypee="latest" mainType={id} />
              <HomeVendorsFetching businessTypee="all" mainType={id} />
            </div>
          ) : (
            <div className="space-y-16">
              <HomeProductsFetching mainType={id} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
