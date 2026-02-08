import Image from 'next/image';
import Icon from '@/app/icon';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Link from 'next/link';

export default function HomeVendorsMainComponent({ vendor, businessTypee }: any) {
  return (
    <>
      <div className="my-3 flex flex-col rounded-2xl border shadow-lg">
        <div className="relative aspect-square rounded-2xl">
          <Link href={`/vendors/${vendor.slug}`}>
            <Image
              className="w-full rounded-2xl object-cover"
              width={500}
              height={500}
              src={vendor.logo == null || '' ? IMAGE_PLACEHOLDER : vendor.logo}
              alt={vendor.name}
            />
          </Link>
          {businessTypee == 'discounted' && (
            <div className="absolute top-2 left-2 flex h-10 w-15 items-center justify-center rounded-2xl bg-red-600 text-white">
              Sale
            </div>
          )}
          {businessTypee == 'top' && (
            <div className="absolute top-2 left-2 flex h-10 w-20 items-center justify-center rounded-2xl bg-yellow-600 text-white">
              {vendor.rating} <Icon className="text-xl text-yellow-400" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 p-5">
          {vendor.isOpen ? <p className="text-green-700">Opened</p> : <p className="text-red-700">Closed</p>}
          <Link href={`/vendors/${vendor.slug}`}>
            <h4 className="">{vendor.name}</h4>
          </Link>
          <p className="text-yellow-500">
            {vendor.rating} <Icon className="text-xl text-yellow-400" />
          </p>
        </div>
      </div>
    </>
  );
}
