import { IHomeBestSellers } from '@/app/interface/homePageBestSellers';
import { baseURL2 } from '@/app/page'
import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import Icon from '@/app/icon';
import placeholderImg from "@/public/placeholder.png";
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import HomeVendorsMainComponent from '../HomeVendorsMainComponent/HomeVendorsMainComponent';

type mainType = {mainType: string}

export default async function MostSoldVendors({mainType}: mainType) {

    async function mostSoldVendors() {
        const response = await fetch(`${baseURL2}business-types/${mainType}/vendors/most-ordered?days=30&pagination[page]=1&pagination[pageSize]=8&populate=*`,{
            method: 'get',
        }).then((res)=> res.json());
        return response.data.vendors;
    }
    const vendors: IHomeBestSellers[] = await mostSoldVendors();
    
  return (
    <div className='grid grid-cols-4'>
        {vendors.map((vendor: IHomeBestSellers)=> {
            return <HomeVendorsMainComponent key={vendor.id} vendor={vendor} />
        })}
    </div>
  )
}
