'use client';
import { baseURL2 } from '@/app/page';
import React, { useEffect, useState } from 'react';
import { IDiscountedVendorsHome } from '@/app/interface/homePageDiscountedVendors';
import HomeVendorsMainComponent from '../HomeVendorsMainComponent/HomeVendorsMainComponent';
import VendorsSkeleton from '../VendorsSkeleton/VendorsSkeleton';
import { Button } from '@/components/ui/button';

export default function HomeDiscountedVendors({ mainType }: { mainType: string }) {
  const [vendors, setVendors] = useState<IDiscountedVendorsHome[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGrid, setIsGrid] = useState(true);

  useEffect(() => {
    async function getDiscountedVendorsProducts() {
      setIsLoading(true);
      const response = await fetch(
        `${baseURL2}business-types/${mainType}/vendors/discounted?minDiscountedProducts=20&pagination[page]=1&pagination[pageSize]=8&populate=*`,
        {
          method: 'get',
        }
      ).then((res) => res.json());
      setIsLoading(false);
      setVendors(response.data.vendors);
    }

    getDiscountedVendorsProducts();
  }, [mainType]);

  return (
    <div>
      <Button onClick={() => setIsGrid((prev) => !prev)}>
        <i className="fa-solid fa-grip"></i>
      </Button>
      <div className={`grid gap-4 ${isGrid ? 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
        {isLoading ? (
          <VendorsSkeleton />
        ) : (
          vendors.map((vendor: IDiscountedVendorsHome) => {
            return <HomeVendorsMainComponent key={vendor.id} vendor={vendor} />;
          })
        )}
      </div>
    </div>
  );
}
