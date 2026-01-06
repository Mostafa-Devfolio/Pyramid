'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCart, saveCart } from '@/lib/indexeddb';
import { setCart } from '@/redux/slices/cartSlice';

export default function CartSave() {
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart);

  // Load cart on first mount
  useEffect(() => {
    loadCart().then(cartFromDb => {
      dispatch(setCart(cartFromDb));
    });
  }, [dispatch]);

  // Save cart whenever it changes
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  return null;
}
