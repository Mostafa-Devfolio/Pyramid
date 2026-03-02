'use client';
import { IBusiness } from '@/app/interface/businessTypeInterface';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { baseURL } from '@/app/page';
import { useBusiness } from '@/lib/ContextAPI/businessTypeId';

export default function SetBusiness({ business }: { business: IBusiness }) {

  const { businessId, setBusinessId } = useBusiness();
  return (
    <div className="text-center">
      <Link className="group" href={`${business.slug}`} onClick={() => setBusinessId(business.id)}>
        <Image
          width={200}
          height={200}
          className="w-full duration-500 group-hover:rotate-y-180"
          src={`${baseURL}${business.icon.url}`}
          alt={business.icon.alternativeText}
        />
      </Link>

      <Link href={`${business.slug}`} onClick={() => setBusinessId(business.id)}>
        <h2 className="text-center">{business.name}</h2>
      </Link>
      <Link href={`${business.slug}`} onClick={() => setBusinessId(business.id)}>
        <p>{business.description}</p>
      </Link>
    </div>
  );
}
