'use client';

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { getClass } from '@/services/ApiServices';
import { getLoginTo } from '@/app/[locale]/login/login';
import { IWishList } from '@/app/[locale]/interface/wishlist';

interface FavoriteButtonProps {
  productId: string | number;
  isWishlisted: boolean;
  wishlistItems: IWishList[];
  onAdd: () => void;
  initialIsFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  onAdd,
  productId,
  isWishlisted,
  wishlistItems,
  initialIsFavorite = false,
  onToggle,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isAvailablee, setIsAvailablee] = useState(false);
  const [isAvailablee2, setIsAvailablee2] = useState(wishlistItems);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (onToggle) onToggle(newState);
  };

  async function removeWish() {
    const token = await getLoginTo();
    setIsAvailablee2(wishlistItems);
    await getClass.removeWishList(token, isAvailablee2[0].id);
    setIsAvailablee(false);
  }

  useEffect(() => {
    function getReady() {
      if (isWishlisted) setIsAvailablee(true);
    }
    getReady();
  }, [isWishlisted]);

  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-90">
      {isAvailablee ? (
        <button onClick={removeWish} className="outline-none">
          <Heart size={22} className="fill-red-500 stroke-red-500 transition-colors" />
        </button>
      ) : (
        <button
          onClick={(e) => {
            handleToggle(e);
            onAdd();
          }}
          aria-label={isFavorite ? 'Remove' : 'Add'}
          className="group outline-none"
        >
          <Heart
            size={22}
            className={`transition-colors duration-300 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'fill-transparent stroke-gray-400 group-hover:stroke-gray-800'}`}
          />
        </button>
      )}
    </div>
  );
};

export default FavoriteButton;
