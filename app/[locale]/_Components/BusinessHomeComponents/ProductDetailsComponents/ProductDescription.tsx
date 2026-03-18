'use client';
import {
  IProductDetailsPage,
  RelatedProduct,
  VendorRandomProduct,
} from '@/app/[locale]/interface/ProductDetailsPage/productDetailsPageInterface';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuLayoutGrid } from 'react-icons/lu';
import { BsList } from 'react-icons/bs';
import { baseURL } from '@/app/[locale]/page';

type products = { products: IProductDetailsPage };

export default function ProductDescription({ products }: products) {
  console.log(products)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'related'>('details');
  const [isGrid, setIsGrid] = useState(true);

  return (
    <div className="space-y-8">
      {/* Modern Segmented Control Tabs */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('details')}
          className={`rounded-full px-6 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 ${
            activeTab === 'details' ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Product Details
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`rounded-full px-6 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 ${
            activeTab === 'reviews' ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Customer Reviews ({products.reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('related')}
          className={`rounded-full px-6 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 ${
            activeTab === 'related' ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Related Products
        </button>
      </div>

      {/* Tab Contents */}
      <div className="animate-in fade-in min-h-[200px] duration-500">
        {activeTab === 'details' && (
          <div className="prose max-w-none text-gray-600">
            <p className="text-base leading-relaxed">{products.description}</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {products.reviews.length !== 0 ? (
              products.reviews.map((review) => (
                <div key={review.id} className="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-bold text-gray-900">{review.user?.username || 'Anonymous User'}</p>
                    <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-bold shadow-sm">
                      ⭐ <span className="text-gray-900">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <i className="fa-regular fa-comment-dots mb-3 text-4xl"></i>
                <h4 className="text-lg font-medium">No reviews yet. Be the first!</h4>
              </div>
            )}
          </div>
        )}

        {activeTab === 'related' && (
          <>
            <div className="mb-3 flex justify-end">
              <button onClick={() => setIsGrid(!isGrid)}>
                {isGrid ? <BsList size={24} color="blue" /> : <LuLayoutGrid size={24} color="blue" />}
              </button>
            </div>
            <div className={`${isGrid ? 'grid-cols-2' : 'grid-cols-1'} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
              {products.relatedProducts.map((related: RelatedProduct) => (
                <div
                  key={related.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-4/5 w-full overflow-hidden bg-gray-50">
                    <Link href={`/vendors/${related.vendor.slug}/${related.slug}`}>
                      <Image
                        width={500}
                        height={500}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={related.images == null ? IMAGE_PLACEHOLDER : `${baseURL}${related.images.url}`}
                        alt={related.title}
                      />
                    </Link>
                  </div>
                  <div className="flex flex-1 flex-col p-5 text-center">
                    <Link href={`/vendors/${related.vendor.slug}/${related.slug}`}>
                      <h4 className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                        {related.title}
                      </h4>
                    </Link>
                    <div className="mt-auto flex flex-wrap items-end justify-center gap-2 pt-3">
                      {related.baseSalePrice ? (
                        <>
                          <span className="text-xs text-gray-400 line-through">{related.basePrice} EGP</span>
                          <span className="text-lg font-extrabold text-red-600">{related.baseSalePrice} EGP</span>
                        </>
                      ) : (
                        <span className="text-lg font-extrabold text-gray-900">{related.basePrice} EGP</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* You Might Also Like Section */}
      <div className="mt-16 border-t border-gray-100 pt-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">You Might Also Like</h2>
          <button onClick={() => setIsGrid(!isGrid)}>
            {isGrid ? <BsList size={24} color="blue" /> : <LuLayoutGrid size={24} color="blue" />}
          </button>
        </div>
        <div className={`${isGrid ? 'grid-cols-2' : 'grid-cols-1'} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
          {products.vendorRandomProducts.map((random: VendorRandomProduct) => (
            <div
              key={random.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-4/5 w-full overflow-hidden bg-gray-50">
                <Link href={`/vendors/${random.vendor.slug}/${random.slug}`}>
                  <Image
                    width={500}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={random.images == null ? IMAGE_PLACEHOLDER : `${baseURL}${random.images.url}`}
                    alt={random.title}
                  />
                </Link>
              </div>
              <div className="flex flex-1 flex-col p-5 text-center">
                <Link href={`/vendors/${random.vendor.slug}/${random.slug}`}>
                  <h4 className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {random.title}
                  </h4>
                </Link>
                <div className="mt-auto flex flex-wrap items-end justify-center gap-2 pt-3">
                  {random.baseSalePrice ? (
                    <>
                      <span className="text-xs text-gray-400 line-through">{random.basePrice} EGP</span>
                      <span className="text-lg font-extrabold text-red-600">{random.baseSalePrice} EGP</span>
                    </>
                  ) : (
                    <span className="text-lg font-extrabold text-gray-900">{random.basePrice} EGP</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
