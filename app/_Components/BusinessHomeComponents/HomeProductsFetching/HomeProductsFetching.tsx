import { ICategoriesOfProducts, IProduct } from '@/app/interface/categoriesOfProducts';
import Icon from '@/components/Icon';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SeeMoreButton from './SeeMoreButton';

export default async function HomeProductsFetching({ mainType }: { mainType: string }) {
    const categoriesOfProducts: ICategoriesOfProducts[] = await getClass.categoriesOfProducts();

  return <SeeMoreButton categoriesOfProducts={categoriesOfProducts} />;
}
