import { CarouselHome } from '@/app/[locale]/_Components/Carsoul/Carsoul';
import BusinessHomeComponent from '@/app/[locale]/_Components/BusinessHomeComponents/HomeBusiness/BusinessHomeComponent';
import HomeCategory from '@/app/[locale]/_Components/BusinessHomeComponents/HomeCategory/HomeCategory';
import React from 'react';

export default async function BusinessHome({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <BusinessHomeComponent id={id} />;
}
