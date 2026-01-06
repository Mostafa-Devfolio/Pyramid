import React from 'react'
import { CarouselHome } from '../../Carsoul/Carsoul';
import HomeCategory from '../HomeCategory/HomeCategory';
import { Button } from '@/components/ui/button';
import HomeVendorsFetching from '../HomeVendorsFetching/HomeVendorsFetching';


type types={
    id:string,
    busType?: string,
};
export default function ReuseBusinessTypes({id, busType}: types) {
  return (<>
    {id == busType && <div className="container mx-auto">
        <div>
          <CarouselHome mainType={id} typee='business_home'/>
        </div>
        <div className="">
          <h2 className='my-4'>Category</h2>
          <div className="">
            <HomeCategory mainType={id} />
          </div>
        </div>
        <div className="">
            <HomeVendorsFetching businessTypee={'discounted'} mainType={id} />
        </div>
        <div className="">
            <HomeVendorsFetching businessTypee='most' mainType={id}/>
        </div>
        <div className="">
            <HomeVendorsFetching businessTypee='top' mainType={id}/>
        </div>
        <div className="">
            <HomeVendorsFetching businessTypee='latest' mainType={id}/>
        </div>
        <div className="">
            <HomeVendorsFetching businessTypee='all' mainType={id}/>
        </div>
      </div>}
      {id == 'e-commerce' && <div className="container mx-auto">
        <div>
          <CarouselHome mainType={id} typee='business_home'/>
        </div>
        <div className="">
          <h2 className='my-4'>Category</h2>
          <div className="">
            <HomeCategory mainType={id} />
          </div>
        </div>
        <div className="">
          <div className='flex justify-between items-center'>
            <h2 className='my-4'>Shops with sales</h2>
          </div>
          <div>
            <HomeVendorsFetching businessTypee={'discounted'} mainType={id} />
          </div>
        </div>
        <div className="">
          <div className='flex justify-between items-center'>
            <h2 className='my-4'>Best Sellers</h2>
          </div>
          <div>
            <HomeVendorsFetching businessTypee='most' mainType={id}/>
          </div>
        </div>
        <div className="">
          <div className='flex justify-between items-center'>
            <h2 className='my-4'>Top Rated Vendors</h2>
          </div>
          <div>
            <HomeVendorsFetching businessTypee='top' mainType={id}/>
          </div>
        </div>
        <div className="">
          <div className='flex justify-between items-center'>
            <h2 className='my-4'>Latest Vendors</h2>
          </div>
          <div>
            <HomeVendorsFetching businessTypee='latest' mainType={id}/>
          </div>
        </div>
        <div className="">
          <div className='flex justify-between items-center'>
            <h2 className='my-4'>All Vendors</h2>
          </div>
          <div>
            <HomeVendorsFetching businessTypee='all' mainType={id}/>
          </div>
        </div>
      </div>}
      </>
  )
}
