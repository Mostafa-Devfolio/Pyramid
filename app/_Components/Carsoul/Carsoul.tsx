import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { baseURL2 } from '@/app/page';
import { IBanner } from '@/app/interface/bannerBusinessTypeInterface';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { getClass } from '@/services/ApiServices';

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
  query.push(`populate=image`);
  query.push(`populate=businessType`);
  const url = `${baseURL2}banners?${query.join('&')}`;

  const bannerData: IBanner[] = await getClass.getBanner(url);
  const bannerFiltered = bannerData.filter((banner) => banner.image?.url);

  return (
    <>
      {bannerData.length > 0 && (
        <Carousel className="w-full">
          <CarouselContent>
            {bannerFiltered.map((banner: IBanner) => {
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
                            banner.image.url == null ? IMAGE_PLACEHOLDER : `http://localhost:1337${banner.image.url}`
                          }
                          alt={banner.image?.alternativeText}
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
      )}
    </>
  );
}
