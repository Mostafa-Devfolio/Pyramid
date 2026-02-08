'use client';
import { IProductDetailsPage } from '@/app/interface/ProductDetailsPage/productDetailsPageInterface';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Image from 'next/image';
import React, { useState } from 'react';

type Product = {
  products: IProductDetailsPage;
};
export default function ProductDetailsImagesComponent({ products }: Product) {
  const [selectedImage, setSelectedImage] = useState<string | null>(products.images?.[0]?.url ?? null);
  return (
    <>
      <Image
        width={1000}
        height={1000}
        className="h-[500px] w-full rounded-2xl object-cover"
        src={products.images == null ? IMAGE_PLACEHOLDER : `http://localhost:1337${selectedImage}`}
        alt={products.title}
      />
      {products.images?.length > 0 && (
        <div className="mt-3 flex gap-2">
          {products.images.map((image) => {
            return (
              <div key={image.id} className="">
                <Image
                  width={300}
                  height={300}
                  className="h-full w-full rounded-2xl object-cover"
                  onClick={() => setSelectedImage(image.url)}
                  src={`http://localhost:1337${image.url}`}
                  alt={image.name}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
