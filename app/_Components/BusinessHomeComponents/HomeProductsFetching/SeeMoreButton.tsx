'use client';

import { ICategoriesOfProducts, IProduct } from '@/app/interface/categoriesOfProducts';
import Icon from '@/components/Icon';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function SeeMoreButton({ categoriesOfProducts }: { categoriesOfProducts: ICategoriesOfProducts[] }) {
  const [visibleProducts, setVisibleProducts] = useState<Record<number, number>>({});

  function showMore(categoryId: number) {
    setVisibleProducts((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] ?? 4) + 4,
    }));
  }

  return (
    <div>
      {categoriesOfProducts.map((categories) => {
        const visibleCount = visibleProducts[categories.id] ?? 4;

        return (
          <div key={categories.id}>
            <h3>{categories.name}</h3>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {categories.products.slice(0, visibleCount).map((product: IProduct) => (
                <div key={product.id} className="my-3 flex flex-col rounded-2xl border shadow-lg">
                  <div className="relative aspect-square rounded-2xl">
                    <Link href={`/vendors/${product.vendor.slug}/${product.slug}`}>
                      <Image
                        className="w-full rounded-2xl object-cover"
                        width={500}
                        height={500}
                        src={product.images?.[0]?.url || IMAGE_PLACEHOLDER}
                        alt={product.title}
                      />
                    </Link>

                    {product.isFlashSale && (
                      <div className="absolute top-2 left-2 flex h-10 w-15 items-center justify-center rounded-2xl bg-red-600 text-white">
                        Sale
                      </div>
                    )}

                    {product.isFeatured && (
                      <div className="absolute top-2 left-2 flex h-10 w-20 items-center justify-center rounded-2xl bg-yellow-600 text-white">
                        {product.averageRating} <Icon className="text-xl text-yellow-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 p-5">
                    <p className="text-yellow-500">
                      {product.reviewCount ?? 0} <Icon className="text-xl text-yellow-400" />
                    </p>

                    {product.isFeatured && <p className="text-green-700">Featured</p>}

                    <Link href={`/vendors/${product.vendor.slug}/${product.slug}`}>
                      <h4>{product.title}</h4>
                    </Link>

                    <Link href={`/vendors/${product.vendor.slug}`}>
                      <p className="text-[10px]">{product.vendor.name}</p>
                    </Link>

                    <p className="text-[11px] text-red-600">{product.brand.name}</p>

                    {product.baseSalePrice == null ? (
                      <h5>{product.basePrice} EGP</h5>
                    ) : (
                      <h5>{product.baseSalePrice} EGP</h5>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < categories.products.length && (
              <div className="flex justify-center">
                <button
                  className="rounded-lg bg-gray-400 p-2 text-white hover:bg-black"
                  onClick={() => showMore(categories.id)}
                >
                  See more
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
