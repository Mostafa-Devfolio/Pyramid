'use client';
import { IVendorPageBanner } from '@/app/interface/VendorPage/vendorPageBanners';
import { IVendorPageCategory } from '@/app/interface/VendorPage/vendorPageCategory';
import { IVendorPageCoupon } from '@/app/interface/VendorPage/vendorPageCoupon';
import { IVendorPageProduct } from '@/app/interface/VendorPage/vendorPageProduct';
import { Button } from '@/components/ui/button';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { IVendorPageProductDiscounted } from '@/app/interface/VendorPage/vendorPageProductsDiscounted';
import Link from 'next/link';
import FavoriteButton from '../Icons/FavouriteIcon';
import { getClass } from '@/services/ApiServices';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { IWishList } from '@/app/interface/wishlist';

type Categories = {
  categories: IVendorPageCategory[];
  coupons: IVendorPageCoupon[];
  banners: IVendorPageBanner[];
  discountedProduct: IVendorPageProductDiscounted[];
  id: string;
};
export default function CategoriesPageComponent({ categories, coupons, banners, discountedProduct, id }: Categories) {
  const [isSelectedCat, setIsSelectedCat] = useState(categories[0].id);
  const [isSelectSub, setIsSelectSub] = useState(categories[0].children[0].id);
  const [whichSubCat, setWhichSubCat] = useState(categories[0].children[0].slug);
  const [index, setIndex] = useState(0);
  const [products, setProducts] = useState<IVendorPageProduct[]>([]);
  const [copy, setCopy] = useState('');
  const [isCouponId, setIsCouponId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { token } = useAuth();
  const [saveWishList, setSaveWishList] = useState([]);
  const goToSection = () => {
    if (window.matchMedia('(max-width: 640px)').matches) {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleCopy = async function (id: number) {
    navigator.clipboard.writeText(copy);
    setIsCouponId(id);
    setTimeout(() => setIsCouponId(null), 3000);
  };

  async function addToWishList(productId: number) {
    if (!token) return;
    const body = {
      productId: productId,
    };
    const data = await getClass.addWishList(token, body);
    vendorPageProducts();
  }

  async function deleteWishList() {
    if (!token) return;
    const data = await getClass.removeWishList(token, 121);
    vendorPageProducts();
  }

  async function vendorPageProducts() {
    const data = await getClass.getVendorProduct(id, whichSubCat);
    setProducts(data.data.products);
  }

  useEffect(() => {
    async function getWishList() {
      if (!token) return;
      const data = await getClass.getWishList(token);
      setSaveWishList(data.data);
      vendorPageProducts();
    }
    getWishList();
    vendorPageProducts();
  }, [whichSubCat, id, token]);

  return (
    <>
      <div className="rounded-2xl border p-4 sm:col-span-1">
        <h3 className="mb-2">Categories</h3>
        {/* <h4 className='text-lg cursor-pointer p-2 hover:bg-gray-200 mb-1 rounded-2xl'>All</h4> */}
        {categories.map((category: IVendorPageCategory, index) => {
          return (
            <div
              key={category.id}
              onClick={() => {
                setIsSelectedCat(category.id);
                goToSection();
                setIndex(index);
                const firstSub = category.children[0];
                setIsSelectSub(firstSub.id);
                setWhichSubCat(firstSub.slug);
              }}
              className={`mb-1 rounded-2xl p-2 hover:bg-gray-200 ${isSelectedCat === category.id ? 'bg-gray-200' : ''}`}
            >
              <h4 className="cursor-pointer text-lg">{category.name}</h4>
            </div>
          );
        })}
      </div>
      <div className="px-3 sm:col-span-3">
        <div className="mx-10 mb-3">
          <Carousel className="w-full">
            <CarouselContent>
              {banners.map((banner: IVendorPageBanner) => {
                if (!banner.image?.url) return null;
                return (
                  <CarouselItem key={banner.id}>
                    <div className="">
                      <Card className="overflow-hidden">
                        <CardContent className="flex aspect-[3/2] h-64 items-center justify-center">
                          <Image
                            width={1000}
                            height={1000}
                            className="w-full object-cover"
                            src={IMAGE_PLACEHOLDER}
                            alt={banner.image?.alternativeText}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
              <CarouselPrevious />
              <CarouselNext />
            </CarouselContent>
          </Carousel>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:flex">
          {coupons.map((coupon: IVendorPageCoupon) => {
            return (
              <div key={coupon.id}>
                <div className="rounded-2xl bg-linear-to-r from-purple-500 to-pink-900 p-5">
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={() => {
                        setCopy(coupon.code);
                        handleCopy(coupon.id);
                      }}
                    >
                      <h2>{coupon.code}</h2>
                      <i className="fa-regular fa-copy"></i>
                    </Button>
                    {isCouponId == coupon.id && <p className="ml-3 text-white">Copied</p>}
                  </div>
                  <div className="flex justify-end text-white">
                    <p className="mt-2 flex cursor-default gap-1">
                      <p>*</p>Maximium discount: {coupon.maxDiscount}
                    </p>
                  </div>
                  <div className="flex items-end justify-end text-white">
                    <p className="flex cursor-default gap-1">
                      <p>*</p>Minimuim order amount: {coupon.minSubtotal}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <h3 ref={sectionRef} className="mt-2">
          Sub-Categories
        </h3>
        <div className="my-4 flex gap-5">
          {categories[index].children.map((subcategory) => {
            return (
              <div
                key={subcategory.id}
                onClick={() => {
                  setIsSelectSub(subcategory.id);
                  setWhichSubCat(subcategory.slug);
                }}
                className={`rounded-2xl p-3 hover:bg-gray-200 ${isSelectSub === subcategory.id ? 'bg-gray-200' : ''}`}
              >
                <p className="cursor-pointer">{subcategory.name}</p>
              </div>
            );
          })}
        </div>
        <div className="">
          <h3>Products</h3>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {products.map((product: IVendorPageProduct) => {
              const data = saveWishList?.some((wish: IWishList) => wish.product.id == product.id);
              const data2 = saveWishList?.filter((wish: IWishList) => wish.product.id == product.id);
              return (
                <div key={product.id} className="relative text-center">
                  <Link href={`/vendors/${id}/${product.slug}`}>
                    <Image
                      width={500}
                      height={500}
                      className="w-full rounded-2xl object-cover"
                      src={IMAGE_PLACEHOLDER}
                      alt={product.title}
                    />
                  </Link>
                  <div className="absolute top-2 right-2">
                    <FavoriteButton
                      onAdd={() => addToWishList(product.id)}
                      saveWishList={data}
                      saveWishList2={data2}
                      productId={product.id}
                    />
                  </div>
                  <Link href={`/vendors/${id}/${product.slug}`}>
                    <h4 className="cursor-pointer">{product.title}</h4>
                  </Link>
                  <div className="mt-1 flex cursor-default justify-center gap-2">
                    {product.baseSalePrice ? (
                      <p className="text-red-500 line-through">{product.basePrice} EGP</p>
                    ) : (
                      <p className="text-green-900">{product.basePrice} EGP</p>
                    )}
                    {product.baseSalePrice && <p className="text-green-900">{product.baseSalePrice} EGP</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <h3 className="my-3">Discounted Products</h3>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {discountedProduct.map((discountedProduct: IVendorPageProductDiscounted) => {
            const data = saveWishList?.some((wish: IWishList) => wish.product.id == discountedProduct.id);
            const data2 = saveWishList?.filter((wish: IWishList) => wish.product.id == discountedProduct.id);
            return (
              <div key={discountedProduct.id} className="relative text-center">
                <Link href={`/vendors/${id}/${discountedProduct.slug}`}>
                  <Image
                    width={500}
                    height={500}
                    className="w-full rounded-2xl object-cover"
                    src={IMAGE_PLACEHOLDER}
                    alt={discountedProduct.title}
                  />
                </Link>
                <div className="absolute top-2 right-2">
                  <button onClick={() => addToWishList(discountedProduct.id)}>
                    <FavoriteButton saveWishList={data} saveWishList2={data2} productId={discountedProduct.id} />
                  </button>
                </div>
                <Link href={`/vendors/${id}/${discountedProduct.slug}`}>
                  <h4 className="cursor-pointer">{discountedProduct.title}</h4>
                </Link>
                <div className="mt-1 flex cursor-default justify-center gap-2">
                  {discountedProduct.baseSalePrice ? (
                    <p className="text-red-500 line-through">{discountedProduct.basePrice} EGP</p>
                  ) : (
                    <p className="text-green-900">{discountedProduct.basePrice} EGP</p>
                  )}
                  {discountedProduct.baseSalePrice && (
                    <p className="text-green-900">{discountedProduct.baseSalePrice} EGP</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
