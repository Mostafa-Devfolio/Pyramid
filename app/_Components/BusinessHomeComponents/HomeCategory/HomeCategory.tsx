import { baseURL2 } from '@/app/page'
import React from 'react'
import Image from "next/image";
import { ICategoryHome } from '@/app/interface/categoryHomeInterface';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Link from 'next/link';
import { getClass } from '@/services/ApiServices';

type id = {mainType: string}

export default async function HomeCategory({mainType}: id) {


    const categories: ICategoryHome[] = await getClass.getHomeCategories(mainType);
    console.log(categories);
    
  return (<>
        <div className='overflow-x-auto w-full no-scrollbar'>
            <div className='flex scroll-smooth gap-4'>
                {categories.map((category: ICategoryHome) => {
                    return <div key={category.id}>
                        <Link href={`${mainType}/${category.slug}`}>
                            <div className='w-24 h-24 border rounded-2xl' key={category.id}>
                                <Image width={500} height={500} className='w-full object-cover rounded-2xl' src={category.homeImage == null||"" ? IMAGE_PLACEHOLDER : category.homeImage} alt={category.name} />
                            </div>
                            <p className='text-center'>{category.name}</p>
                        </Link>
                    </div>
                })}
            </div>
        </div>
  </>
  )
}
