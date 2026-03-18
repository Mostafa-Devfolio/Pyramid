'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { getClass } from '@/services/ApiServices';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IBannerBooking } from '@/app/[locale]/interface/bannerBooking';
import { baseURL } from '../../page';

export function CarouselCSR() {
  const [bannerData, setBannerData] = useState<IBannerBooking[]>([]);

  useEffect(() => {
    async function getBanners() {
      const data = await getClass.getModulesBanner();
      setBannerData(data.data);
    }
    getBanners();
  }, []);

  return (
    <div className="w-full px-1">
      {bannerData?.length > 0 && (
        <Carousel className="group w-full">
          <CarouselContent className="-ml-1">
            {bannerData.map((banner: IBannerBooking) => {
              if (!banner.image?.url) return null;
              return (
                <CarouselItem className="relative pl-1" key={banner.id}>
                  <Card className="overflow-hidden rounded-[2.5rem] border-0 bg-transparent">
                    <CardContent className="relative flex aspect-21/9 min-h-112.5 w-full items-center justify-center p-0">
                      <Image
                        fill
                        priority
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        src={
                          banner.image.url == null
                            ? IMAGE_PLACEHOLDER
                            : `${baseURL}${banner.image.url}`
                        }
                        alt={banner.image?.alternativeText ?? 'Banner'}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    </CardContent>
                  </Card>

                  <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end p-12 pb-16">
                    <h2 className="mb-6 text-center text-4xl font-black tracking-tight text-white drop-shadow-2xl sm:text-6xl">
                      {banner.title}
                    </h2>
                    <Link
                      href={`bookings/${banner.slug}?id=${banner.targetProperty.id}&checkin=2026-03-10&checkout=2026-03-17&adults=4&children=2`}
                      className="rounded-full bg-white px-12 py-5 text-sm font-black tracking-widest text-black uppercase shadow-2xl transition-all hover:scale-105 hover:bg-gray-100 active:scale-95"
                    >
                      Explore Now
                    </Link>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}
