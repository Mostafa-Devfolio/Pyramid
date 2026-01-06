import CategoriesPageComponent from '@/app/_Components/VendorsPageComponents/CategoriesPageComponent';
import Icon from '@/app/icon';
import { IVendorPageBanner } from '@/app/interface/VendorPage/vendorPageBanners';
import { IVendorPageCategory } from '@/app/interface/VendorPage/vendorPageCategory';
import { IVendorPageCoupon } from '@/app/interface/VendorPage/vendorPageCoupon';
import { IVendorInfo } from '@/app/interface/VendorPage/vendorPageInfo';
import { IVendorPageProduct } from '@/app/interface/VendorPage/vendorPageProduct';
import { IVendorPageProductDiscounted } from '@/app/interface/VendorPage/vendorPageProductsDiscounted';
import { getClass } from '@/services/ApiServices';
import React from 'react'

export default async function VendorsPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;

    const vendor: IVendorInfo = await getClass.vendorPageInfo(id);
    const categories: IVendorPageCategory[] = await getClass.vendorPageCategory(id);
    const coupons: IVendorPageCoupon[] = await getClass.vendorPageCoupon(id);
    const banners: IVendorPageBanner[] = await getClass.vendorPageBanners(id);
    const discountedProduct: IVendorPageProductDiscounted[] = await getClass.vendorPageDiscounted(id);

  return (<>
    <div className='mb-3 cursor-default container bg-gray-800 text-white mx-auto flex items-center justify-between border-b p-3 rounded-br-2xl rounded-bl-2xl'>
      <h1 className="text-center bg-linear-to-r from-purple-300 to-red-400 bg-clip-text text-transparent">{vendor.name}</h1>
      <p className='text-white'><Icon className="text-yellow-400 text-xl" /> {vendor.rating} ({vendor.reviews.length} K)</p>
      <p>Delivery Time: {vendor.deliveryTime}</p>
      <p>Delivery Fee: {vendor.deliveryFee} EGP</p>
      <p className='flex gap-1'><p className='text-white'>Status:</p> {vendor.isOpen ? <p className='text-green-400'>Opened</p> : <p className='text-red-800'>Closed</p>}</p>
    </div>
    <div className='container mx-auto grid grid-cols-4 gap-3'>
      <CategoriesPageComponent categories={categories} banners={banners} coupons={coupons} discountedProduct={discountedProduct} id={id}/>
    </div>
  </>)
}
