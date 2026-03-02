import CategoriesPageComponent from '@/app/_Components/VendorsPageComponents/CategoriesPageComponent';
import Icon from '@/components/Icon';
import { IVendorPageBanner } from '@/app/interface/VendorPage/vendorPageBanners';
import { IVendorPageCategory } from '@/app/interface/VendorPage/vendorPageCategory';
import { IVendorPageCoupon } from '@/app/interface/VendorPage/vendorPageCoupon';
import { IVendorInfo } from '@/app/interface/VendorPage/vendorPageInfo';
import { IVendorPageProduct } from '@/app/interface/VendorPage/vendorPageProduct';
import { IVendorPageProductDiscounted } from '@/app/interface/VendorPage/vendorPageProductsDiscounted';
import { getClass } from '@/services/ApiServices';
import React from 'react';
import { getLoginTo } from '@/app/login/login';
import FinalCartBusinessSolution from '@/app/_Components/BusinessHomeComponents/HomeBusiness/FinalCartBusinessSolution';

export default async function VendorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getLoginTo();
  const vendor: IVendorInfo = await getClass.vendorPageInfo(id);
  const business = vendor.businessType.id;
  await getClass.getCartItems(business, token);

  const categories: IVendorPageCategory[] = await getClass.vendorPageCategory(id);
  const coupons: IVendorPageCoupon[] = await getClass.vendorPageCoupon(id);
  const banners: IVendorPageBanner[] = await getClass.vendorPageBanners(id);
  const discountedProduct: IVendorPageProductDiscounted[] = await getClass.vendorPageDiscounted(id);

  return (
    <>
      <FinalCartBusinessSolution businessIdd = {business}/>
      <div className="container mx-auto mb-3 grid cursor-default grid-cols-1 rounded-br-2xl rounded-bl-2xl border-b bg-gray-800 p-3 text-white md:flex md:items-center md:gap-4">
        <h1 className="bg-linear-to-r from-purple-300 to-red-400 bg-clip-text text-center whitespace-nowrap text-transparent md:w-fit">
          {vendor.name}
        </h1>
        <div className="grid grid-cols-2 md:flex md:w-full md:justify-between">
          <p className="text-white">
            <Icon className="text-xl text-yellow-400" /> {vendor.rating}
          </p>
          <p>Delivery Time: {vendor.deliveryTime}</p>
          <p>Delivery Fee: {vendor.deliveryFee} EGP</p>
          <p className="flex gap-1">
            <p className="text-white">Status:</p>{' '}
            {vendor.isOpen ? <p className="text-green-400">Opened</p> : <p className="text-red-800">Closed</p>}
          </p>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-3 sm:grid-cols-4">
        <CategoriesPageComponent
          categories={categories}
          banners={banners}
          coupons={coupons}
          discountedProduct={discountedProduct}
          id={id}
        />
      </div>
    </>
  );
}
