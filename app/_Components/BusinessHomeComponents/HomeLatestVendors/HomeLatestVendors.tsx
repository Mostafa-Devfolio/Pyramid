"use client";
import { IHomeLatestVendors } from '@/app/interface/homeLatestVendors';
import { baseURL2 } from '@/app/page'
import React, { useEffect, useState } from 'react'
import HomeVendorsMainComponent from '../HomeVendorsMainComponent/HomeVendorsMainComponent';
import { Button } from '@/components/ui/button';
import VendorsSkeleton from '../VendorsSkeleton/VendorsSkeleton';

type mainType = {mainType: string}
export default function HomeLatestVendors({mainType}: mainType) {
    const [vendors, setVendors] = useState([]);
    const [isGrid, setIsGrid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        async function homeLatestVendors(){
            setIsLoading(true);
            const response = await fetch(`${baseURL2}vendors?filters[businessType][slug][$eq]=${mainType}&filters[isActive][$eq]=true&sort[0]=createdAt:desc&pagination[page]=1&pagination[pageSize]=8&populate=logo`,{
                method: 'get'
            }).then((res)=> res.json());
            setVendors(response.data);
            setIsLoading(false);
        };
        homeLatestVendors();
    },[mainType])
    
    return (<>
        <Button variant={'outline'} onClick={()=> setIsGrid(prev => !prev)}><i className="fa-solid fa-grip"></i></Button>
        <div className={`grid gap-4 ${isGrid ? "lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1" : "grid-cols-1"}`}>
            {isLoading ? <VendorsSkeleton /> : vendors.map((vendor: IHomeLatestVendors)=> {
                return <HomeVendorsMainComponent key={vendor.id} vendor={vendor} />
            })}
        </div>
    </> 
    )
}
