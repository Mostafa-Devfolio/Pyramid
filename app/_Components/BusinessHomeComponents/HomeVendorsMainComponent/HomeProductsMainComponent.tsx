import Icon from '@/components/Icon';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeProductsMainComponent({ product, businessTypee }: any) {
  return (
    <div className="">
      <div className="my-3 flex flex-col rounded-2xl border shadow-lg">
        <div className="relative aspect-square rounded-2xl">
          <Link href={`/vendors/${product.vendor.slug}/${product.slug}`}>
            <Image
              className="w-full rounded-2xl object-cover"
              width={500}
              height={500}
              src={product.logo == null || '' ? IMAGE_PLACEHOLDER : product.logo}
              alt={product.title}
            />
          </Link>
          {businessTypee == 'discounted' && (
            <div className="absolute top-2 left-2 flex h-10 w-15 items-center justify-center rounded-2xl bg-red-600 text-white">
              Sale
            </div>
          )}
          {businessTypee == 'top' && (
            <div className="absolute top-2 left-2 flex h-10 w-20 items-center justify-center rounded-2xl bg-yellow-600 text-white">
              {product.rating} <Icon className="text-xl text-yellow-400" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 p-5">
            <p className="text-yellow-500">
                {product.reviewCount ?? 0} <Icon className="text-xl text-yellow-400" />
            </p>
            {product.isFeatured && <p className="text-green-700">Featured</p>}
            <Link href={`/vendors/${product.vendor.slug}/${product.slug}`}>
                <h4 className="">{product.title}</h4>
            </Link>
            <Link href={`/vendors/${product.vendor.slug}`}>
                <p className="text-[10px]">{product.vendor.name}</p>
            </Link>
            <p className="text-[11px] text-red-600">{product.brand.name}</p>
            {product.baseSalePrice == null && <h5>{product.basePrice} EGP</h5>}
            {product.baseSalePrice != null && <h5>{product.baseSalePrice} EGP</h5>}
        </div>
      </div>
    </div>
  );
}
