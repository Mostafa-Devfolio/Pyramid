'use client';
import { IProductDetailsPage } from '@/app/[locale]/interface/ProductDetailsPage/productDetailsPageInterface';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Image from 'next/image';
import React, { useState } from 'react';

type Product = {
  products: IProductDetailsPage;
};

export default function ProductDetailsImagesComponent({ products }: Product) {
  console.log(products)
  const [selectedImage, setSelectedImage] = useState<string | null>(products.images?.[0]?.url ?? null);

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Main Feature Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-sm sm:aspect-[4/3] lg:aspect-square">
        <Image
          fill
          className="object-cover"
          src={
            products.images == null || products.images.length === 0
              ? IMAGE_PLACEHOLDER
              : `***REMOVED***${selectedImage}`
          }
          alt={products.title}
          priority
        />
      </div>

      {/* Thumbnails */}
      {products.images?.length > 0 && (
        <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-2 pt-4 pl-2">
          {products.images.map((image) => {
            const isActive = selectedImage === image.url;
            return (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.url)}
                className={`relative h-20 w-20 shrink-0 snap-start overflow-hidden rounded-2xl transition-all duration-300 ease-out focus:outline-none ${
                  isActive ? 'ring-2 ring-black ring-offset-2' : 'opacity-60 hover:scale-105 hover:opacity-100'
                }`}
              >
                <Image
                  fill
                  className="object-cover"
                  src={`***REMOVED***${image.url}`}
                  alt={image.name}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
