import React from 'react';
import { CarouselHome } from '../../Carsoul/Carsoul';
import HomeCategory from '../HomeCategory/HomeCategory';
import HomeVendorsFetching from '../HomeVendorsFetching/HomeVendorsFetching';
import { getClass } from '@/services/ApiServices';
import { getLoginTo } from '@/app/login/login';

type types = {
  id: string;
  busType?: string;
};
export default async function ReuseBusinessTypes({ id, busType }: types) {
  const token = await getLoginTo();
  if (id == 'restaurants' && token){
    const data = await getClass.getCartItems(1, token);
  } else if (id == 'groceries' && token){
    const data = await getClass.getCartItems(2, token);
  } else if (id == 'pharmacies' && token){
    const data = await getClass.getCartItems(3, token);
  } else if (id == 'e-commerce' && token){
    const data = await getClass.getCartItems(4, token);
  }
  return (
    <>
      {id == busType && (
        <div className="container mx-auto pt-3">
          <div className="mx-3 mx-auto w-[80%] md:w-full">
            <CarouselHome mainType={id} typee="business_home" />
          </div>
          <div className="">
            <h2 className="my-4">Category</h2>
            <div className="">
              <HomeCategory mainType={id} />
            </div>
          </div>
          <div className="">
            <HomeVendorsFetching businessTypee={'discounted'} mainType={id} />
          </div>
          <div className="">
            <HomeVendorsFetching businessTypee="most" mainType={id} />
          </div>
          <div className="">
            <HomeVendorsFetching businessTypee="top" mainType={id} />
          </div>
          <div className="">
            <HomeVendorsFetching businessTypee="latest" mainType={id} />
          </div>
          <div className="">
            <HomeVendorsFetching businessTypee="all" mainType={id} />
          </div>
        </div>
      )}
      {id == 'e-commerce' && (
        <div className="container mx-auto">
          <div>
            <CarouselHome mainType={id} typee="business_home" />
          </div>
          <div className="">
            <h2 className="my-4">Category</h2>
            <div className="">
              <HomeCategory mainType={id} />
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-between">
              <h2 className="my-4">Shops with sales</h2>
            </div>
            <div>
              <HomeVendorsFetching businessTypee={'discounted'} mainType={id} />
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-between">
              <h2 className="my-4">Best Sellers</h2>
            </div>
            <div>
              <HomeVendorsFetching businessTypee="most" mainType={id} />
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-between">
              <h2 className="my-4">Top Rated Vendors</h2>
            </div>
            <div>
              <HomeVendorsFetching businessTypee="top" mainType={id} />
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-between">
              <h2 className="my-4">Latest Vendors</h2>
            </div>
            <div>
              <HomeVendorsFetching businessTypee="latest" mainType={id} />
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-between">
              <h2 className="my-4">All Vendors</h2>
            </div>
            <div>
              <HomeVendorsFetching businessTypee="all" mainType={id} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
