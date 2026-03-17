'use client';
import { IBusiness } from '@/app/[locale]/interface/businessTypeInterface';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { baseURL } from '@/app/[locale]/page';
import { useBusiness } from '@/lib/ContextAPI/businessTypeId';

export default function SetBusiness({ business }: { business: IBusiness }) {
  const { setBusinessId } = useBusiness();

  return (
    <Link
      href={`${business.slug}`}
      onClick={() => setBusinessId(business.id)}
      className="group dark:bg-black/60 dark:border-slate-600 flex h-full flex-col items-center rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-100 hover:shadow-2xl hover:shadow-slate-200/50"
    >
      <div className="relative mb-6 flex h-32 w-32 items-center justify-center transition-transform duration-700 group-hover:scale-110">
        <Image
          width={200}
          height={200}
          className="h-full w-full object-contain drop-shadow-md"
          src={`${baseURL}${business.icon.url}`}
          alt={business.icon.alternativeText ?? business.name}
        />
      </div>

      <h3 className="mb-2 dark:text-white text-xl font-black text-slate-900 transition-colors group-hover:text-blue-600">
        {business.name}
      </h3>

      <p className="mt-auto dark:text-slate-200 line-clamp-2 text-sm font-medium text-slate-500">{business.description}</p>
    </Link>
  );
}
