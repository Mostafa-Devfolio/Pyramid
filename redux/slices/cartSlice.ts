import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  variantName?: string[]|null;
  price: number;
  deliveryFee?: number;
  vendorName?: string;
  businesstype?: number;
  variantId?: number[]|null;
  selectedOptions?: any;
}

const initialState: CartItem[] = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (_, action: PayloadAction<CartItem[]>) => {
      return action.payload;
    },

    addToCart: (state, action: PayloadAction<CartItem>) => {
      const {
        id,
        name,
        quantity,
        variantName,
        price,
        deliveryFee,
        vendorName,
        businesstype,
        variantId,
        selectedOptions,
      } = action.payload;

      const existingItem = state.find((item: CartItem) => item.id === id);
      const sameVendor = state.find((item: CartItem) => item.vendorName !== vendorName);

      if (sameVendor) {
        console.log('They are from 2 different vendors please add products from the same vendor');
      } else if (existingItem) {
        existingItem.quantity++;
      } else {
        state.push({
          id,
          name,
          quantity,
          variantName,
          price,
          deliveryFee,
          vendorName,
          businesstype,
          variantId,
          selectedOptions,
        });
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      return state.filter((item: CartItem) => item.id !== itemId);
    },

    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      const item = state.find((item: CartItem) => item.id === itemId);
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },

    increaseQuantity: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      const item = state.find((item: CartItem) => item.id === itemId);
      if (item) {
        item.quantity++;
      }
    },
  },
});

export const { setCart, addToCart, removeFromCart, decreaseQuantity, increaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
