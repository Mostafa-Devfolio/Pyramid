import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

        setCart: (_,action) => {
            return action.payload;
        },

        addToCart: (state, action) => {
            const { id, name, quantity, variantName, price, deliveryFee, vendorName } = action.payload;
            const existingItem = state.find((item) => item.id === id);
            const sameVendor = state.find((item) => item.vendorName != vendorName);
            if(sameVendor){
                console.log('They are from 2 different vendors please add products from the same vendor');
            } else if(existingItem){
                existingItem.quantity++;
            } else{
                state.push({id, name, quantity, variantName, price, deliveryFee, vendorName});
            }
        },

        removeFromCart: (state, action) => {
            const itemId = action.payload;
            return state.filter((item) => item.id != itemId);
        },

        decreaseQuantity: (state, action) => {
            const itemId = action.payload;
            const items = state.find((item) => item.id === itemId);
            if(items.quantity && items.quantity > 1) {
                items.quantity--;
            }
        },

        increaseQuantity: (state, action) => {
            const itemId = action.payload;
            const items = state.find((item) => item.id === itemId);
            if(items.quantity){
                items.quantity++;
            }
        }
    }
})

export const { setCart, addToCart, removeFromCart, decreaseQuantity, increaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;






// import { createSlice } from "@reduxjs/toolkit"

// const initialState = [];

// const cartSlice = createSlice({
//     name: 'cart',
//     initialState,
//     reducers: {
//         setCart: (_,action) => {
//             return action.payload;
//         },

//         addToCart: (state, action) => {
//             const {id, name, price, image, quantity, variantName, deliveryFee, deliveryTime} = action.payload;
//             const existingItem = state.find((item) => item.id === id);
//             if(existingItem){
//                 existingItem.quantity++;
//             } else {
//                 state.push({id, name, price, image, quantity, variantName, deliveryFee, deliveryTime});
//             }
//         },

//         removeFromCart: (state, action) => {
//             const itemId = action.payload;
//             return state.filter((item) => item.id !== itemId);
//         },

//         increaseQuantity: (state, action) => {
//             const itemId = action.payload;
//             const existingItem = state.find((item) => item.id === itemId);
//             if(existingItem){
//                 existingItem.quantity++;
//             }
//         },

//         decreaseQuantity: (state, action) => {
//             const itemId = action.payload;
//             const existingItem = state.find((item) => item.id === itemId);
//             if(existingItem && existingItem.quantity>1){
//                 existingItem.quantity--;
//             }
//         }
//     }
// })

// export const {setCart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity} = cartSlice.actions;
// export default cartSlice.reducer;