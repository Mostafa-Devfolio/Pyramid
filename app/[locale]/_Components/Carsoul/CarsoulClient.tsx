'use client';
import React from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { IBanner } from '@/app/[locale]/interface/bannerBusinessTypeInterface';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { baseURL } from '../../page';

export default function CarsoulClient({ bannerFiltered }: { bannerFiltered: IBanner[] }) {
  const t = useTranslations('PRISM');
  const router = useRouter();

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
    <Carousel className="group w-full">
      <CarouselContent>
        {bannerFiltered.map((banner: IBanner) => {
          if (!banner.image?.url) return null;
          return (
            <CarouselItem className="relative" key={banner.id}>
              <Card className="overflow-hidden rounded-3xl border-0 bg-transparent">
                <CardContent className="relative flex aspect-21/9 min-h-75 w-full items-center justify-center p-0">
                  <Image
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={
                      banner.image.url == null ? IMAGE_PLACEHOLDER : `${baseURL}${banner.image.url}`
                    }
                    alt={banner.image?.alternativeText ?? 'Banner'}
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                </CardContent>
              </Card>

              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end p-8 pb-10 sm:p-12">
                <h2 className="mb-6 text-center text-2xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-4xl">
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
                  className="rounded-full bg-white/90 px-8 py-3 text-sm cursor-pointer font-semibold text-black shadow-lg backdrop-blur-md transition-all duration-300 ease-out hover:scale-105 hover:bg-white active:scale-95"
                >
                  {t('explore_now')}
                </button>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
