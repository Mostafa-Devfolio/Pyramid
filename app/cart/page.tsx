"use client"
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ICart } from '../interface/Cart/cart';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { Button } from '@/components/ui/button';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/redux/slices/cartSlice';
import Link from 'next/link';

export default function CartPage() {
  const cartItems = useSelector((state: any) => state.cart);
  console.log(cartItems);
  
  const dispatch = useDispatch();
  const subtotal = cartItems.reduce((total: number, item: ICart) => total + item.price * item.quantity, 0);
  
  

  function removeItem(itemId: number){
    dispatch(removeFromCart(itemId));
  }

  function decrease(itemId: number){
    dispatch(decreaseQuantity(itemId))
  }
  function increase(itemId: number){
    dispatch(increaseQuantity(itemId));
  }
  
  return (
    <div className="container mx-auto p-4">
      {/* <h1 className='mb-4'>Cart ({cartItems[0].vendorName})</h1> */}
      {cartItems.length > 0 ? <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
        {cartItems.map((item: ICart) => {
          return <div key={item.id} className="border rounded-2xl mb-5">
            <div className="grid grid-cols-3">
              <div className='col-span-1 rounded-2xl'>
                <Image width={300} height={300} className='rounded-2xl' src={item.image == null ? IMAGE_PLACEHOLDER : IMAGE_PLACEHOLDER} alt={item.name} />
              </div>
              <div className="col-span-2 p-3 flex flex-col justify-center gap-4">
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
        })}
        </div>
        <div className="col-span-1 p-3 flex flex-col">
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
          </div>
        </div>
      </div> : <div className="flex flex-col justify-center items-center text-gray-950">
        <h1>No products in your cart</h1>
        <Button className='mt-5' variant={'outline'}><Link href={'//'}>SHOP NOW</Link></Button>
      </div> }
    </div>
  )
}
