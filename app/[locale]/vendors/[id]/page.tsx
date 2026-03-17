import CategoriesPageComponent from '@/app/[locale]/_Components/VendorsPageComponents/CategoriesPageComponent';
import Icon from '@/components/Icon';
import { IVendorPageBanner } from '@/app/[locale]/interface/VendorPage/vendorPageBanners';
import { IVendorPageCategory } from '@/app/[locale]/interface/VendorPage/vendorPageCategory';
import { IVendorPageCoupon } from '@/app/[locale]/interface/VendorPage/vendorPageCoupon';
import { IVendorInfo } from '@/app/[locale]/interface/VendorPage/vendorPageInfo';
import { IVendorPageProduct } from '@/app/[locale]/interface/VendorPage/vendorPageProduct';
import { IVendorPageProductDiscounted } from '@/app/[locale]/interface/VendorPage/vendorPageProductsDiscounted';
import { getClass } from '@/services/ApiServices';
import React from 'react';
import { getLoginTo } from '@/app/[locale]/login/login';
import FinalCartBusinessSolution from '@/app/[locale]/_Components/BusinessHomeComponents/HomeBusiness/FinalCartBusinessSolution';

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
      <FinalCartBusinessSolution businessIdd={business} />

      <div className="container mx-auto px-4 pt-6 pb-10">
        {/* Modern Vendor Hero Header */}
        <div className="mb-8 flex flex-col gap-6 overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-2xl sm:p-10 md:flex-row md:items-center md:justify-between">
          <h1 className="bg-linear-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-center text-3xl font-extrabold tracking-tight whitespace-nowrap text-transparent sm:text-4xl md:text-left">
            {vendor.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium md:justify-end">
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-md">
              <Icon className="text-yellow-400" />
              <span>{vendor.rating}</span>
            </div>
            <div className="rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-md">
              Time: {vendor.deliveryTime}
            </div>
            <div className="rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-md">
              Fee: {vendor.deliveryFee} EGP
            </div>
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-white backdrop-blur-md ${vendor.isOpen ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${vendor.isOpen ? 'bg-green-400' : 'bg-red-400'}`}
                ></span>
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${vendor.isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                ></span>
              </span>
              {vendor.isOpen ? 'Open Now' : 'Closed'}
            </div>
          </div>
        </div>

        {/* Categories & Products Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <CategoriesPageComponent
            categories={categories}
            banners={banners}
            coupons={coupons}
            discountedProduct={discountedProduct}
            id={id}
          />
        </div>
      </div>
    </>
  );
}
