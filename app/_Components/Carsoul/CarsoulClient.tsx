'use client';
import React from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { IBanner } from '@/app/interface/bannerBusinessTypeInterface';
import { useRouter } from 'next/navigation';

export default function CarsoulClient({ bannerFiltered }: { bannerFiltered: IBanner[] }) {
  const router = useRouter();
  console.log(bannerFiltered);

  async function goToSection(
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
    <Carousel className="w-full cursor-pointer">
      <CarouselContent>
        {bannerFiltered.map((banner: IBanner) => {
          if (!banner.image?.url) return null;
          return (
            <CarouselItem
              key={banner.id}
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
            >
              {/* <CarouselNext /> */}
              <div className="p-1">
                <Card className="overflow-hidden">
                  <CardContent className="flex aspect-3/2 h-64 items-center justify-center">
                    <Image
                      width={1000}
                      height={1000}
                      className="w-full object-cover"
                      src={
                        banner.image.url == null ? IMAGE_PLACEHOLDER : `https://pyramid.devfolio.net${banner.image.url}`
                      }
                      alt={banner.image?.alternativeText ?? 'Banner'}
                    />
                  </CardContent>
                </Card>
                {/* <CarouselPrevious /> */}
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
