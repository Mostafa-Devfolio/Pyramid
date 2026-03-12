import * as React from 'react';
import { baseURL2 } from '@/app/page';
import { IBanner } from '@/app/interface/bannerBusinessTypeInterface';
import { getClass } from '@/services/ApiServices';
import CarsoulClient from './CarsoulClient';

type Type = {
  typee?: string;
  mainType?: string;
};

export async function CarouselHome({ typee, mainType }: Type) {
  const query: string[] = [];

  if (typee) {
    query.push(`filters[placement][$eq]=${typee}`);
  }
  if (mainType) {
    query.push(`filters[businessType][slug][$eq]=${mainType}`);
  }

  query.push(`populate[0]=image`);
  query.push(`populate[1]=businessType`);
  query.push(`populate[2]=targetVendor`);
  query.push(`populate[3]=targetProduct.vendor`);
  query.push(`populate[4]=targetCategory`);
  query.push(`populate[5]=targetProperty`);

  const url = `${baseURL2}banners?${query.join('&')}`;

  const bannerData: IBanner[] = await getClass.getBanner(url);

  if (!bannerData || !Array.isArray(bannerData)) {
    console.error('Failed to load banners or invalid data:', bannerData);
    return null;
  }

  const bannerFiltered = bannerData.filter((banner) => banner.image?.url);

  return <>{bannerFiltered.length > 0 && <CarsoulClient bannerFiltered={bannerFiltered} />}</>;
}
