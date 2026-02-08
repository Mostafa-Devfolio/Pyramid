import { ITopRatedVendors } from '@/app/interface/homeTopRatedVendors';
import { baseURL2 } from '@/app/page';
import React from 'react';
import HomeVendorsMainComponent from '../HomeVendorsMainComponent/HomeVendorsMainComponent';

type mainType = { mainType: string };

export default async function HomeTopRatedVendors({ mainType }: mainType) {
  async function topRatedVendors() {
    const response = await fetch(
      `${baseURL2}vendors?filters[businessType][slug][$eq]=${mainType}&filters[isActive][$eq]=true&sort[0]=rating:desc&pagination[page]=1&pagination[pageSize]=8&populate=logo`,
      {
        method: 'get',
      }
    ).then((res) => res.json());
    return response.data;
  }

  const vendors: ITopRatedVendors[] = await topRatedVendors();

  return (
    <div className="grid grid-cols-4 gap-4">
      {vendors.map((vendor: ITopRatedVendors) => {
        return <HomeVendorsMainComponent key={vendor.id} vendor={vendor} />;
      })}
    </div>
  );
}
