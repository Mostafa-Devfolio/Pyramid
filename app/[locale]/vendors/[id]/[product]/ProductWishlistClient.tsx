'use client';

import FavoriteButton from '@/app/[locale]/_Components/Icons/FavouriteIcon';
import { getClass } from '@/services/ApiServices';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { IWishList } from '@/app/[locale]/interface/wishlist';

type Props = {
  productId: number;
  isWishlist: boolean;
  wishlistItem: IWishList;
};

export default function ProductWishlistClient({ productId, isWishlist, wishlistItem }: Props) {
  const { token } = useAuth();

  async function addToWishList() {
    if (!token) return;

    await getClass.addWishList(token, { productId });
  }

  return (
    <FavoriteButton
      onAdd={addToWishList}
      isWishlisted={isWishlist}
      wishlistItems={wishlistItem ? [wishlistItem] : []}
      productId={productId}
    />
  );
}
