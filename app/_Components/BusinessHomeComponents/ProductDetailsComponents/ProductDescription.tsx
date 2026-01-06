"use client"
import { IProductDetailsPage } from '@/app/interface/ProductDetailsPage/productDetailsPageInterface'
import { Button } from '@/components/ui/button'
import { IMAGE_PLACEHOLDER } from '@/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

type products = {
    products: IProductDetailsPage,
}

export default function ProductDescription({products}: products) {
    const [selected, setSelected] = useState(true);
    const [selected1, setSelected1] = useState(false);
    const [selected2, setSelected2] = useState(false);
  return (<>
    <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
            <button onClick={() => {setSelected(true); setSelected1(false); setSelected2(false)}}>
                <h3 className={`${selected ? 'text-black' : 'text-gray-700'} cursor-pointer`}>Product Details</h3>
            </button>
        </div>
        <div className="col-span-1">
            <button onClick={() => {setSelected1(true); setSelected(false); setSelected2(false)}}>
                <h3 className={`${selected1 ? 'text-black' : 'text-gray-700'} cursor-pointer`}>Customer Reviews</h3>
            </button>
        </div>
        <div className="col-span-1">
            <button onClick={() => {setSelected2(true); setSelected(false); setSelected1(false)}}>
                <h3 className={`${selected2 ? 'text-black' : 'text-gray-700'} cursor-pointer`}>Related Products</h3>
            </button>
        </div>
    </div>
    {selected && <div className="my-5">
        <h4>{products.description}</h4>
    </div>}
    {selected1 && <div className="my-5">
        {products.reviews.length !== 0 ? <h4>{products.reviews}</h4> : <h4>No reviews yet.</h4>}
    </div> }
    {selected2 && <div className="my-5 grid grid-cols-4 gap-5">
        {products.relatedProducts.map((related) => {
            return <div key={related.id} className="text-center">
                <Link href={`/vendors/${related.vendor.slug}/${related.slug}`}>
                    <Image width={500} height={500} className='w-full object-cover rounded-2xl' src={IMAGE_PLACEHOLDER} alt={related.title} />
                </Link>
                <h4 className='cursor-pointer'>{related.title}</h4>
                <div className='flex gap-2 justify-center mt-1 cursor-default'>
                    {related.baseSalePrice ? <p className='line-through text-red-500'>{related.basePrice} EGP</p> : <p className='text-green-900'>{related.basePrice} EGP</p>}
                    {related.baseSalePrice && <p className='text-green-900'>{related.baseSalePrice} EGP</p>}
                </div>
            </div>
        })}
    </div>}
    <div className="mt-3">
        <h2 className='my-5'>You Might Also Like</h2>
        <div className="grid grid-cols-4 gap-5">
            {products.vendorRandomProducts.map((random: any) => {
                return <div key={random.id} className="">
                <Link href={`/vendors/${random.vendor.slug}/${random.slug}`}>
                    <Image width={500} height={500} className='w-full object-cover rounded-2xl' src={IMAGE_PLACEHOLDER} alt={random.title} />
                </Link>
                <h4 className='cursor-pointer'>{random.title}</h4>
                <div className='flex gap-2 justify-center mt-1 cursor-default'>
                    {random.baseSalePrice ? <p className='line-through text-red-500'>{random.basePrice} EGP</p> : <p className='text-green-900'>{random.basePrice} EGP</p>}
                    {random.baseSalePrice && <p className='text-green-900'>{random.baseSalePrice} EGP</p>}
                </div>
                </div>
            })}
        </div>
    </div>
  </>)
}
