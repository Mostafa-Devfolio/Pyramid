import { baseURL2 } from '@/app/page';
import React from 'react';
import Image from 'next/image';
import { ICategoryHome } from '@/app/interface/categoryHomeInterface';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Link from 'next/link';
import { getClass } from '@/services/ApiServices';

type id = { mainType: string };

export default async function HomeCategory({ mainType }: id) {
  const categories: ICategoryHome[] = await getClass.getHomeCategories(mainType);
  console.log(categories);

  return (
    <>
      <div className="no-scrollbar w-full overflow-x-auto">
        <div className="flex gap-4 scroll-smooth">
          {categories.map((category: ICategoryHome) => {
            return (
              <div key={category.id}>
                <Link href={`${mainType}/${category.slug}`}>
                  <div className="h-24 w-24 rounded-2xl border" key={category.id}>
                    <Image
                      width={500}
                      height={500}
                      className="w-full rounded-2xl object-cover"
                      src={category.homeImage == null || '' ? IMAGE_PLACEHOLDER : category.homeImage}
                      alt={category.name}
                    />
                  </div>
                  <p className="text-center">{category.name}</p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
