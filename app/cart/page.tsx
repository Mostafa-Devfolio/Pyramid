"use client"
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ICart } from '../interface/Cart/cart';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { Button } from '@/components/ui/button';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/redux/slices/cartSlice';
import Link from 'next/link';
import { getClass } from '@/services/ApiServices';
import { authContext } from '@/lib/ContextAPI/authContext';
import { getLoginTo } from '../login/login';

export default function CartPage() {
  const cartItems = useSelector((state: any) => state.cart);
  const [businessId, setBusinessId] = useState(cartItems.businessType);
  const { auth, token } = useContext(authContext);
  const [cartApi, setCartApi] = useState([]);
  const [subAndTotal, setSubAndTotal] = useState([]);
  const [couponCode, setCouponCode] = useState<string|null>(null);
  const [couponError, setCouponError] = useState<string|null>("");

  const dispatch = useDispatch();
  const subtotal = cartItems.reduce((total: number, item: ICart) => total + item.price * item.quantity, 0);

  async function removeItem(itemId: number){
    if(auth){
      const data = await getClass.removeItemFromCart(itemId, token);
      getCart();
    } else {
      dispatch(removeFromCart(itemId));
    }
  }

  async function changeCart(itemQuantity: number, itemId: number){
    if(!auth){return;}
    const cart = {
        cartItemId: itemId,
        quantity: itemQuantity,
    }
    const data = await getClass.updateItemsInCart(cart, token);
    const data2 = data.data;
    getCart();
  }

  async function applyCoupon(couponData){
    const coupon = {
      "businessTypeId": cartApi[0]?.product.businessType.id,
      "code" : couponData
    }
    const data = await getClass.applyCoupon(coupon, token);
    setCouponError(data);
    getCart();
  }

  async function clearCart(){
    const clear = {
      "businessTypeId": cartApi[0]?.product.businessType.id,
    }
    const data = await getClass.clearCart(clear, token);
    getCart();
  }

  function decrease(itemId: number){
    dispatch(decreaseQuantity(itemId));
  }
  async function decreaseQty(itemId: number){
    const data = await getClass.cartUpdate(itemId, token)
  }
  function increase(itemId: number){
    dispatch(increaseQuantity(itemId));
  }

  // setBusinessId(cartItems.businessType);
  
  async function getCart(){
    setBusinessId(cartItems.businessType);
    const getCart = await getClass.getCartItems(businessId, token); 
    const getItems = getCart.items;
    setCartApi(getItems);
    setSubAndTotal(getCart);
  }

  useEffect(() => {
    setBusinessId(cartItems.businessType);
    getCart();
    setTimeout(() => getCart(), 3000);
  },[cartItems.businessType]);
  
  return (
    <div className="container mx-auto p-4">
      {/* <h1 className='mb-4'>Cart ({cartItems[0].vendorName})</h1> */}
      {cartApi.length > 0 || cartItems.length > 0 ? <div className="">
      <Button variant={'outline'} className='mb-3' onClick={() => clearCart()}>Clear</Button>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
        {auth ? <div className=""> {cartApi.map((item: any) => {
        return <div key={item.id} className="border rounded-2xl mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              <div className='sm:col-span-1 rounded-2xl'>
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl">
    <Image
      src={item.image ?? IMAGE_PLACEHOLDER}
      alt={item.name}
      fill
      className="object-cover"
    />
  </div>
              </div>
              <div className="sm:col-span-2 p-3 flex flex-col justify-center gap-4">
                <div className='flex justify-between'>
                  <h2>{item.product.title}</h2>
                  <Button variant={'outline'} onClick={() => removeItem(item.id)}>Delete</Button>
                </div>
                <div className='flex items-center gap-5'>
                  <p>Quantity:</p>
                  <div className="flex items-center gap-3">
                    <Button onClick={() => changeCart(item.quantity-1, item.id)}>-</Button>
                    {<p>{item.quantity}</p>}
                    <Button onClick={() => {changeCart(item.quantity+1, item.id)}}>+</Button>
                  </div>
                </div>
                {item.variant != null && <h3>{item.variant.displayName}</h3>}
                {(item.variant == null && item.product.baseSalePrice == null) && <h3>Price: {item.product.basePrice * item.quantity}</h3>}
                {(item.variant == null && item.product.baseSalePrice != null) && <h3>Price: {item.product.baseSalePrice * item.quantity}</h3>}
                {(item.variant != null && item.variant.salePrice == null) && <h3>Price: {item.variant.price * item.quantity}</h3>}
                {(item.variant != null && item.variant.salePrice != null) && <h3>Price: {item.variant.salePrice * item.quantity}</h3>}
              </div>
            </div>
          </div>
      })} </div> : <div className=""> {cartItems.map((item: ICart) => {
          return <div key={item.id} className="border rounded-2xl mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              <div className='sm:col-span-1 rounded-2xl'>
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl">
    <Image
      src={item.image ?? IMAGE_PLACEHOLDER}
      alt={item.name}
      fill
      className="object-cover"
    />
  </div>
              </div>
              <div className="sm:col-span-2 p-3 flex flex-col justify-center gap-4">
                <div className='flex justify-between'>
                  <h2>{item.name}</h2>
                  <Button variant={'outline'} onClick={() => removeItem(item.id)}>Delete</Button>
                </div>
                <div className='flex items-center gap-5'>
                  <p>Quantity:</p>
                  <div className="flex items-center gap-3">
                    <Button onClick={() => decrease(item.id)}>-</Button>
                    {<p>{item.quantity}</p>}
                    <Button onClick={() => increase(item.id)}>+</Button>
                  </div>
                </div>
                <h3>{item.variantName}</h3>
                <h3>Price: {item.price * item.quantity}</h3>
              </div>
            </div>
          </div>
        })} </div> }
        </div>
        {auth ? <div className="col-span-1 p-3 flex flex-col">
          <h2>Summary</h2>
          <div className='p-3'>
            <div className="flex justify-between">
              <h3>Subtotal:</h3>
              <h3>{Math.round(subAndTotal.subtotal*100)/100}</h3>
            </div>
            <div className="flex justify-between">
              <h3>Discount:</h3>
              {subAndTotal.discount != null ? <h3>{Math.round(subAndTotal.discount*100)/100}</h3> : <h3>0</h3> }
            </div>
            <div className="flex justify-between">
              <h3>Delivery Fee:</h3>
              <h3>{Math.round(subAndTotal.deliveryFee*100)/100}</h3>
            </div>
            <div className="border-b-2 mt-3"></div>
            <div className="flex justify-between mt-5">
              <h3>Total:</h3>
              <h3>{Math.round(subAndTotal.total*100)/100}</h3>
            </div>
            <Button className='w-full mt-5'><Link href={'/checkout'}>Checkout</Link></Button>
            <div className='mt-10'>
              <h4 className='text-lg text-black cursor-default'>Coupon Code</h4>
              <div className="flex gap-2 items-center mt-1">
                <input type="text" onChange={(e) => setCouponCode(e.target.value)} name="coupon" id="coupon" className='border rounded-2xl p-4' placeholder='Enter Coupon Code'/>
                <Button className={`p-7 rounded-2xl`} onClick={() => applyCoupon(couponCode)}>APPLY</Button>
              </div>
              {(couponError?.data !== null && subAndTotal.discount !== 0) && <h4 className='text-green-600 mt-2'>* Coupon is already applied!</h4>}
              {couponError?.data == null && <h4 className='text-red-600 mt-2'>{couponError?.error?.message}</h4>}
              {couponError?.data != null && <h4 className='text-green-600 mt-2'>* Coupon Applied Successfully</h4>}
            </div>
          </div>
        </div> : <div className="col-span-1 p-3 flex flex-col">
          <h2>Summary</h2>
          <div className='p-3'>
            <div className="flex justify-between">
              <h3>Subtotal:</h3>
              <h3>{subtotal}</h3>
            </div>
            <div className="flex justify-between">
              <h3>Delivery Fee:</h3>
              <h3>{cartItems[0]?.deliveryFee}</h3>
            </div>
            <div className="border-b-2 mt-3"></div>
            <div className="flex justify-between mt-5">
              <h3>Total:</h3>
              <h3>{subtotal + cartItems[0]?.deliveryFee}</h3>
            </div>
            <Button className='w-full mt-5'><Link href={'/checkout'}>Checkout</Link></Button>
            {/* <div className='mt-10'>
              <h4 className='text-lg text-black cursor-default'>Coupon Code</h4>
              <div className="flex gap-2 items-center mt-1">
                <input type="text" onChange={(e) => setCouponCode(e.target.value)} name="coupon" id="coupon" className='border rounded-2xl p-4' placeholder='Enter Coupon Code'/>
                <Button className={`p-7 rounded-2xl`} onClick={() => applyCoupon(couponCode)}>APPLY</Button>
              </div>
              {(couponError?.data !== null && subAndTotal.discount !== null) && <h4 className='text-green-600 mt-2'>* Coupon is already applied!</h4>}
              {couponError?.data == null && <h4 className='text-red-600 mt-2'>{couponError?.error?.message}</h4>}
              {couponError?.data != null && <h4 className='text-green-600 mt-2'>* Coupon Applied Successfully</h4>}
            </div> */}
          </div>
        </div>}
      </div> </div> : <div className="flex flex-col justify-center items-center text-gray-950">
        <h1>No products in your cart</h1>
        <Button className='mt-5' variant={'outline'}><Link href={'//'}>SHOP NOW</Link></Button>
      </div> }
    </div>
  )
}
