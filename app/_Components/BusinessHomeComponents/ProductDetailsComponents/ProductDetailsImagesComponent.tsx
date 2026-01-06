"use client"
import { IProductDetailsPage } from '@/app/interface/ProductDetailsPage/productDetailsPageInterface'
import { IMAGE_PLACEHOLDER } from '@/lib/image'
import Image from 'next/image'
import React, { useState } from 'react'

type Product = {
    products: IProductDetailsPage
}
export default function ProductDetailsImagesComponent({products}: Product) {
    const [selectedImage, setSelectedImage] = useState<string|null>(products.images?.[0]?.url ?? null)
  return (<>
    <Image width={1000} height={1000} className='w-full h-[500px] object-cover rounded-2xl' src={products.images == null ? IMAGE_PLACEHOLDER : `http://localhost:1337${selectedImage}`} alt={products.title} />
    {products.images?.length >0 && <div className="flex gap-2 mt-3">
        {products.images.map(image => {
            return <div key={image.id} className=''>
                <Image width={300} height={300} className='w-full h-full object-cover rounded-2xl' onClick={() => setSelectedImage(image.url)} src={`http://localhost:1337${image.url}`} alt={image.name} />
            </div>
        })}
    </div>}</>
  )
}
