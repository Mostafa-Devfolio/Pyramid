import ProductDescription from '@/app/_Components/BusinessHomeComponents/ProductDetailsComponents/ProductDescription';
import ProductDetailsImagesComponent from '@/app/_Components/BusinessHomeComponents/ProductDetailsComponents/ProductDetailsImagesComponent';
import ProductOptionComponent from '@/app/_Components/BusinessHomeComponents/ProductDetailsComponents/ProductOptionComponent';
import FavoriteButton from '@/app/_Components/Icons/FavouriteIcon';
import { ICurrency } from '@/app/interface/currency';
import { IProductDetailsPage } from '@/app/interface/ProductDetailsPage/productDetailsPageInterface';
import { getLoginTo } from '@/app/login/login';
import { baseURL, baseURL2 } from '@/app/page';
import { authContext } from '@/lib/ContextAPI/authContext';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import ProductWishlistClient from './ProductWishlistClient';

type RatingStarsProps = {
  rating: number; // 0 - 5
};
export default async function ProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = await params;

  const products: IProductDetailsPage = await getClass.productPage(product);
  const currency: ICurrency = await getClass.currency();
  const token = await getLoginTo();
  const getWish = await getClass.getWishList(token);
  const getWishArr = getWish.data;
  const data = getWishArr?.some((wish: any) => wish.product.id === products.id);
  const data2 = getWishArr?.filter((wish: any) => wish.product.id === products.id);

  return (
    <div className="container mx-auto my-4">
      <div className="flex items-center gap-4">
        <Link href={'/'}>
          <p>Home</p>
        </Link>
        <i className="fa-solid fa-angle-right"></i>
        <Link href={`/vendors/${products.vendor.slug}`}>
          <p>{products.vendor.name}</p>
        </Link>
        <i className="fa-solid fa-angle-right"></i>
        <p className="cursor-default">{products.category.name}</p>
        <i className="fa-solid fa-angle-right"></i>
        <Link href={''}>
          <p>{products.title}</p>
        </Link>
      </div>
      <div className="my-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <ProductDetailsImagesComponent products={products} />
        </div>
        <div className="sm:col-span-1">
          <div className='flex items-center justify-between'>
            <h2 className="cursor-default">{products.title}</h2>
            <div className="">
              <ProductWishlistClient productId={products.id} isWishlist={data} wishlistItem={data2} />
            </div>
          </div>
          <div className="my-3 flex items-center gap-1 border-b pb-5 text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => {
              if (products.ratingAverage >= star) {
                return <FaStar key={star} />;
              }

              if (products.ratingAverage >= star - 0.5) {
                return <FaStarHalfAlt key={star} />;
              }

              return <FaRegStar key={star} />;
            })}
            <p className="pr-1 text-xl text-black">{products.ratingAverage}</p>
            <p className="border-l pl-2 text-xl text-black">{products.ratingCount} Reviews</p>
          </div>
          {/* <div className='flex gap-2'>
                    <h4>Price:</h4>{products.baseSalePrice && <div className='flex gap-1'>
                        <h4 className='text-green-800'>{products.baseSalePrice}</h4><h4>{currency.symbol}</h4>
                    </div>}
                    <div className='flex gap-1'>
                        {products.baseSalePrice ? <h4 className='line-through text-red-500'>{products.basePrice}</h4> : <div className='flex gap-1'>
                            <h4 className='text-green-800'>{products.basePrice}</h4><h4>{currency.symbol}</h4>
                        </div>}
                    </div>
                </div> */}
          <div className="my-4">
            {products.optionGroups[0] != undefined && <h3>{products.optionGroups[0].name}</h3>}
            <ProductOptionComponent products={products} />
            {/* {products.optionGroups.map(optiongroup => {
                        return <div key={optiongroup.id} className="">
                            <h3>{optiongroup.name}</h3>
                            <ProductOptionComponent products={products} optiongroup={optiongroup}/>
                        </div>
                    })} */}
          </div>
        </div>
      </div>
      <div className="border-b-2"></div>
      <div className="my-5">
        <ProductDescription products={products} />
      </div>
    </div>
  );
}
