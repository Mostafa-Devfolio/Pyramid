'use client';
import React from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { IBanner } from '@/app/interface/bannerBusinessTypeInterface';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CarsoulClient({ bannerFiltered }: { bannerFiltered: IBanner[] }) {
  const router = useRouter();
  console.log(bannerFiltered);

  function goToSection(
    target: string,
    vSlug?: string,
    pSlug?: string,
    pVSlug?: string,
    pId?: string,
    pPSlug?: string,
    adults?: number,
    children?: number,
    checkin?: string,
    checkout?: string
  ) {
    if (target == 'vendor') {
      router.push(`/vendors/${vSlug}`);
    } else if (target == 'product') {
      router.push(`/vendors/${pVSlug}/${pSlug}`);
    } else if (target == 'property') {
      router.push(
        `/bookings/${pPSlug}?id=${pId}&checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=${children}`
      );
    }
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {bannerFiltered.map((banner: IBanner) => {
          if (!banner.image?.url) return null;
          return (
            <CarouselItem className="relative" key={banner.id}>
              {/* <CarouselNext /> */}
              <div className="p-1">
                <Card className="overflow-hidden">
                  <CardContent className="flex aspect-3/2 h-47 sm:h-64 items-center justify-center">
                    <Image
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover rounded-md"
                      src={
                        banner.image.url == null ? IMAGE_PLACEHOLDER : `https://pyramid.devfolio.net${banner.image.url}`
                      }
                      alt={banner.image?.alternativeText ?? 'Banner'}
                    />
                  </CardContent>
                </Card>
                {/* <CarouselPrevious /> */}
              </div>
              <div className="">
                <h2 className="absolute text-center bg-amber-100 rounded-lg top-20 left-[50%] translate-x-[-50%] cursor-default p-2 text-sm text-nowrap sm:text-xl font-bold text-black shadow-lg">
                  {banner.title}
                </h2>

                <button
                  onClick={() =>
                    goToSection(
                      banner.targetType,
                      banner.targetVendor?.slug,
                      banner.targetProduct?.slug,
                      banner.targetProduct?.vendor?.slug,
                      banner.targetProperty?.documentId,
                      banner.targetProperty?.slug,
                      banner.adults,
                      banner.children,
                      banner.checkin,
                      banner.checkout
                    )
                  }
                  className="absolute bottom-10 left-[50%] z-1000 translate-x-[-50%] cursor-pointer rounded-md shadow-lg bg-black p-2 text-white hover:bg-blue-800 transition duration-300 ease-in-out"
                >
                  View here
                </button>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
