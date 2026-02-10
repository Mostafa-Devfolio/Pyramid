'use client';

import FavoriteButton from '@/app/_Components/Icons/FavouriteIcon';
import { getClass } from '@/services/ApiServices';
import { useContext } from 'react';
import { authContext } from '@/lib/ContextAPI/authContext';

type Props = {
  productId: number;
  isWishlist: boolean;
  wishlistItem: any[];
};

export default function ProductWishlistClient({
  productId,
  isWishlist,
  wishlistItem,
}: Props) {
  const { token } = useContext(authContext);

  async function addToWishList() {
    if (!token) return;

    await getClass.addWishList(token, { productId });
  }

  return (
    <FavoriteButton
      onAdd={addToWishList}
      saveWishList={isWishlist}
      saveWishList2={wishlistItem}
      productId={productId}
    />
  );
}
