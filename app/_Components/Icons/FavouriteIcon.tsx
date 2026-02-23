'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { getClass } from '@/services/ApiServices';
import { authContext } from '@/lib/ContextAPI/authContext';
import { getLoginTo } from '@/app/login/login';
import { IWishList } from '@/app/interface/wishlist';

interface FavoriteButtonProps {
  productId: string | number;
  saveWishList: IWishList[];
  saveWishList2: IWishList[];
  onAdd: () => void;
  initialIsFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  onAdd,
  productId,
  saveWishList,
  saveWishList2,
  initialIsFavorite = false,
  onToggle,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isAvailablee, setIsAvailablee] = useState(false);
  const [isAvailablee2, setIsAvailablee2] = useState(saveWishList2);
  const handleToggle = (e: React.MouseEvent) => {
    // Prevent clicking the heart from also clicking a "Product Card" link
    e.preventDefault();
    // e.stopPropagation();

    const newState = !isFavorite;
    setIsFavorite(newState);

    if (onToggle) {
      onToggle(newState);
    }
  };

  async function removeWish(){
    const token = await getLoginTo();
    setIsAvailablee2(saveWishList2);
    const data = await getClass.removeWishList(token, isAvailablee2[0].id);
    setIsAvailablee(false);
  }

  useEffect(() => {
    async function isAvailable() {
      if (saveWishList) {
        setIsAvailablee(true);
      }
    }
    isAvailable();
  }, [saveWishList]);

  return (
    <>
      {isAvailablee ? (
        <div className="group relative p-2 transition-transform active:scale-90">
          <Heart
            onClick={() => removeWish()}
            size={24}
            className={`transition-colors duration-300 ${isAvailablee ? 'fill-red-500 stroke-red-500' : ''}`}
          />
        </div>
      ) : (
        <button
          onClick={(e) => {handleToggle(e); onAdd()}}
          className="group relative p-2 transition-transform active:scale-90"
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={24}
            className={`transition-colors duration-300 ${
              isFavorite
                ? 'fill-red-500 stroke-red-500'
                : 'fill-transparent stroke-gray-500 group-hover:stroke-gray-700'
            }`}
          />
        </button>
      )}
    </>
  );
};

export default FavoriteButton;
