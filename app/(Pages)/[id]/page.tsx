import { CarouselHome } from '@/app/_Components/Carsoul/Carsoul';
import BusinessHomeComponent from '@/app/_Components/BusinessHomeComponents/HomeBusiness/BusinessHomeComponent';
import HomeCategory from '@/app/_Components/BusinessHomeComponents/HomeCategory/HomeCategory';
import React from 'react'

export default async function BusinessHome({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;

  return (
    <BusinessHomeComponent id={id} />
  )
}
