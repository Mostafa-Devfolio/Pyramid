import Image from 'next/image';
import Icon from '@/components/Icon';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Link from 'next/link';
import { baseURL } from '@/app/[locale]/page';

export default function HomeVendorsMainComponent({ vendor, businessTypee }: any) {
  console.log(vendor)
  return (
    <div className="group flex flex-col rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-3xl">
        <Link href={`/vendors/${vendor.slug}`}>
          <Image
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            width={500}
            height={500}
            src={vendor.logo != null ? `${baseURL}${vendor.logo.url}` : IMAGE_PLACEHOLDER}
            alt={vendor.name}
          />
        </Link>

        <div className="absolute top-3 left-3 flex gap-2">
          {businessTypee == 'discounted' && (
            <div className="flex items-center rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md">
              Sale
            </div>
          )}
          {businessTypee == 'top' && (
            <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-black shadow-sm backdrop-blur-md">
              <Icon className="text-sm text-yellow-500" />
              <span>{vendor.rating}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between">
          <Link href={`/vendors/${vendor.slug}`} className="truncate">
            <h4 className="truncate text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
              {vendor.name}
            </h4>
          </Link>
          <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-gray-600">
            <Icon className="text-yellow-500" /> {vendor.rating}
          </div>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${vendor.isOpen ? 'bg-green-400' : 'bg-red-400'}`}
            ></span>
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${vendor.isOpen ? 'bg-green-500' : 'bg-red-500'}`}
            ></span>
          </span>
          <p
            className={`text-xs font-semibold tracking-wider uppercase ${vendor.isOpen ? 'text-green-600' : 'text-red-500'}`}
          >
            {vendor.isOpen ? 'Open Now' : 'Closed'}
          </p>
        </div>
      </div>
    </div>
  );
}
