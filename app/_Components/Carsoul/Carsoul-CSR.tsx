'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { baseURL2 } from '@/app/page';
import { IBanner } from '@/app/interface/bannerBusinessTypeInterface';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { getClass } from '@/services/ApiServices';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IBannerBooking } from '@/app/interface/bannerBooking';

type Type = {
  checkIn?: string;
  checkOut?: string;
};

export function CarouselCSR({ checkIn, checkOut }: Type) {
  const [bannerData, setBannerData] = useState<IBannerBooking[]>();

  useEffect(() => {
    async function getBanners() {
      const data = await getClass.getModulesBanner();
      setBannerData(data.data);
    }
    getBanners();
  }, []);

  return (
    <>
      {bannerData?.length > 0 && (
        <Carousel className="w-full relative">
          <CarouselContent>
            {bannerData?.map((banner: IBannerBooking) => {
              if (!banner.image?.url) return null;
              return (
                <CarouselItem key={banner.id}>
                  {/* <CarouselNext /> */}
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="flex aspect-[3/2] h-64 items-center justify-center">
                        <Image
                          width={500}
                          height={500}
                          className="w-full object-cover"
                          src={
                            banner.image.url == null
                              ? IMAGE_PLACEHOLDER
                              : `***REMOVED***${banner.image.url}`
                          }
                          alt={banner.image?.alternativeText}
                        />
                      </CardContent>
                    </Card>
                    {/* <CarouselPrevious /> */}
                  </div>
          <div className="">
            <h2 className='text-white p-2 absolute top-20 left-[50%] translate-x-[-50%] cursor-default text-3xl font-bold shadow-lg'>{banner.title}</h2>

            <Link href={`bookings/${banner.slug}?id=${banner.targetProperty.id}&checkin=2026-03-10&checkout=2026-03-17&adults=4&children=2`} className='bg-blue-600 hover:bg-blue-800 text-white p-2 absolute bottom-10 left-[50%] translate-x-[-50%] rounded-md'>View here</Link>
          </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      )}
    </>
  );
}
