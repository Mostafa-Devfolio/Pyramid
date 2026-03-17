import ProductDescription from '@/app/[locale]/_Components/BusinessHomeComponents/ProductDetailsComponents/ProductDescription';
import ProductDetailsImagesComponent from '@/app/[locale]/_Components/BusinessHomeComponents/ProductDetailsComponents/ProductDetailsImagesComponent';
import ProductOptionComponent from '@/app/[locale]/_Components/BusinessHomeComponents/ProductDetailsComponents/ProductOptionComponent';
import FavoriteButton from '@/app/[locale]/_Components/Icons/FavouriteIcon';
import { ICurrency } from '@/app/[locale]/interface/currency';
import { IProductDetailsPage } from '@/app/[locale]/interface/ProductDetailsPage/productDetailsPageInterface';
import { getLoginTo } from '@/app/[locale]/login/login';
import { baseURL, baseURL2 } from '@/app/[locale]/page';
import { authContext } from '@/lib/ContextAPI/authContext';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import ProductWishlistClient from './ProductWishlistClient';
import { IWishList } from '@/app/[locale]/interface/wishlist';

export default async function ProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = await params;

  const products: IProductDetailsPage = await getClass.productPage(product);
  const currency: ICurrency = await getClass.currency();
  const token = await getLoginTo();
  const getWish = await getClass.getWishList(token);
  const getWishArr = getWish.data;
  const data = getWishArr?.some((wish: IWishList) => wish.product.id === products.id);
  const data2 = getWishArr?.filter((wish: IWishList) => wish.product.id === products.id);

  return (
    <div className="container mx-auto max-w-7xl space-y-12 px-4 py-8">
      <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-500">
        <Link href={'/'} className="rounded-full px-3 py-1.5 transition-colors hover:bg-gray-100 hover:text-black">
          Home
        </Link>
        <i className="fa-solid fa-angle-right text-xs"></i>
        <Link
          href={`/vendors/${products.vendor.slug}`}
          className="rounded-full px-3 py-1.5 transition-colors hover:bg-gray-100 hover:text-black"
        >
          {products.vendor.name}
        </Link>
        <i className="fa-solid fa-angle-right text-xs"></i>
        <span className="cursor-default rounded-full bg-gray-50 px-3 py-1.5 text-gray-700">
          {products.category.name}
        </span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Sticky Image Column */}
        <div className="flex items-start lg:col-span-1">
          <div className="sticky top-24 w-full">
            <ProductDetailsImagesComponent products={products} />
          </div>
        </div>

        {/* Product Info Column */}
        <div className="flex flex-col pt-2 lg:col-span-1">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {products.title}
            </h1>
            <div className="shrink-0 pt-2">
              <ProductWishlistClient productId={products.id} isWishlist={data} wishlistItem={data2} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-6">
            <div className="flex items-center text-lg text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => {
                if (products.ratingAverage >= star) return <FaStar key={star} />;
                if (products.ratingAverage >= star - 0.5) return <FaStarHalfAlt key={star} />;
                return <FaRegStar key={star} />;
              })}
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-900">
              <span className="rounded-md bg-yellow-100 px-2 py-0.5 text-yellow-800">{products.ratingAverage}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500 underline decoration-gray-300 underline-offset-4">
                {products.ratingCount} Reviews
              </span>
            </div>
          </div>

          <div className="my-8">
            {products.optionGroups[0] != undefined && (
              <h3 className="mb-4 text-lg font-bold text-gray-900">{products.optionGroups[0].name}</h3>
            )}
            <ProductOptionComponent products={products} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-12">
        <ProductDescription products={products} />
      </div>
    </div>
  );
}
