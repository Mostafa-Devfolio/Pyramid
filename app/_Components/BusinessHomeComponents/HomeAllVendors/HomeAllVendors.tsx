import { IHomeAllVendors } from '@/app/interface/homeAllVendors';
import { baseURL2 } from '@/app/page';
import React from 'react';
import HomeVendorsMainComponent from '../HomeVendorsMainComponent/HomeVendorsMainComponent';

type mainType = { mainType: string };

export default async function HomeAllVendors({ mainType }: mainType) {
  async function homeAllVendors() {
    const response = await fetch(
      `${baseURL2}vendors?filters[businessType][slug][$eq]=${mainType}&filters[isActive][$eq]=true&pagination[page]=1&pagination[pageSize]=20&populate=logo`,
      {
        method: 'get',
      }
    ).then((res) => res.json());
    return response.data;
  }

  const vendors: IHomeAllVendors[] = await homeAllVendors();

  return (
    <div className="grid grid-cols-4 gap-4">
      {vendors.map((vendor: IHomeAllVendors) => {
        return <HomeVendorsMainComponent key={vendor.id} vendor={vendor} />;
      })}
    </div>
  );
}
