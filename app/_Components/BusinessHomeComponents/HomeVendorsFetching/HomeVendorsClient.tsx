"use client";
import React, { useState } from 'react'
import { IDiscountedVendorsHome } from '@/app/interface/homePageDiscountedVendors';
import HomeVendorsMainComponent from '../HomeVendorsMainComponent/HomeVendorsMainComponent';

type mainType = {
    mainType: string,
    businessTypee: string,
    vendors: IDiscountedVendorsHome[]
}

export default function HomeVendorsClient({mainType, businessTypee, vendors}: mainType) {
    const [isGrid, setIsGrid] = useState(true)
  return (
        <div>
            <div className='flex justify-between items-center'>
                {businessTypee == `discounted` && <h2 className='my-4'>Shops with sales</h2>}
                {businessTypee == `most` && <h2 className='my-4'>Best Sellers</h2>}
                {businessTypee == `top` && <h2 className='my-4'>Top Rated Vendors</h2>}
                {businessTypee == `latest` && <h2 className='my-4'>Latest Vendors</h2>}
                {businessTypee == `all` && <h2 className='my-4'>All Vendors</h2>}
            </div>
            <div className={`grid gap-4 md:grid-cols-4 grid-cols-2`}>
                {vendors.map((vendor: IDiscountedVendorsHome) => {
                    return <HomeVendorsMainComponent key={vendor.id} businessTypee={businessTypee} vendor={vendor}/>
                    })
                }
            </div>
        </div>
    )
}
