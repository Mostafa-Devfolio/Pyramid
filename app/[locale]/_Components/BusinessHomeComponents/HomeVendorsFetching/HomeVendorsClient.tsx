'use client';
import React, { useState } from 'react';
import { IDiscountedVendorsHome } from '@/app/[locale]/interface/homePageDiscountedVendors';
import HomeVendorsMainComponent from '../HomeVendorsMainComponent/HomeVendorsMainComponent';

type mainType = {
  mainType: string;
  businessTypee: string;
  vendors: IDiscountedVendorsHome[];
};

export default function HomeVendorsClient({ mainType, businessTypee, vendors }: mainType) {
  const titles: Record<string, string> = {
    discounted: 'Sales & Offers',
    most: 'Best Vendors',
    top: 'Top Rated',
    latest: 'New Arrivals',
    all: 'All Vendors',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{titles[businessTypee]}</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {vendors.map((vendor: IDiscountedVendorsHome) => (
          <HomeVendorsMainComponent key={vendor.id} businessTypee={businessTypee} vendor={vendor} />
        ))}
      </div>
    </div>
  );
}
