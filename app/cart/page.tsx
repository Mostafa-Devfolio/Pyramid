'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ICart } from '../interface/Cart/cart';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { Button } from '@/components/ui/button';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/redux/slices/cartSlice';
import Link from 'next/link';
import { getClass } from '@/services/ApiServices';
import { authContext, useAuth } from '@/lib/ContextAPI/authContext';
import { getLoginTo } from '../login/login';
import { cartCount } from '@/lib/ContextAPI/cartCount';
import { ICartItems, Item } from '../interface/Cart/cartItems';
import { ICoupon } from '../interface/coupon';

export default function CartPage() {
  const cartItems = useSelector((state: any) => state.cart);
  const [businessId, setBusinessId] = useState(cartItems.businessType);
  const { auth, token } = useAuth();
  const [cartApi, setCartApi] = useState<Item[]>([]);
  const [subAndTotal, setSubAndTotal] = useState<ICartItems | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<ICoupon | null>(null);
  const { countt, setCountt } = useContext(cartCount);

  const dispatch = useDispatch();
  const subtotal = cartItems.reduce((total: number, item: ICart) => total + item.price * item.quantity, 0);

  async function getCart() {
      setBusinessId(cartItems.businessType);
      const getCart = await getClass.getCartItems(businessId, token);
      const getItems = getCart.items;
      setCartApi(getItems);
      setSubAndTotal(getCart);
    }

  async function removeItem(itemId: number) {
    if (token) {
      const data = await getClass.removeItemFromCart(itemId, token);
      getCart();
    } else {
      dispatch(removeFromCart(itemId));
    }
  }

  async function changeCart(itemQuantity: number, itemId: number) {
    if (!token) return;

    const cart = {
      cartItemId: itemId,
      quantity: itemQuantity,
    };
    const data = await getClass.updateItemsInCart(cart, token);
    const data2 = data.data;
    getCart();
  }

  async function applyCoupon(couponData: string) {
    if(!token) return;
    const coupon = {
      businessTypeId: cartApi[0].product.businessType.id,
      code: couponData,
    };
    const data = await getClass.applyCoupon(coupon, token);
    setCouponError(data.data);
    getCart();
  }

  async function clearCart() {
    if(!token) return;
    const clear = {
      businessTypeId: cartApi[0].product.businessType.id,
    };
    const data = await getClass.clearCart(clear, token);
    setCountt(0);
    getCart();
  }

  function decrease(itemId: number) {
    dispatch(decreaseQuantity(itemId));
  }
  async function decreaseQty(itemId: number) {
    if(!token) return;
    const data = await getClass.cartUpdate(itemId, token);
  }
  function increase(itemId: number) {
    dispatch(increaseQuantity(itemId));
  }

  // setBusinessId(cartItems.businessType);

  
  useEffect(() => {
    async function getCarts() {
      setBusinessId(cartItems.businessType);
      const getCart = await getClass.getCartItems(businessId, token);
      const getItems = getCart.items;
      setCartApi(getItems);
      setSubAndTotal(getCart);
    }
    setBusinessId(cartItems.businessType);
    getCarts();
    // setTimeout(() => {getCart()}, 7000);
    // getCart();
  }, [cartItems.businessType, getCart]);

  return (
    <div className="container mx-auto p-4">
      {auth ? (
        <div>
          {cartApi.length > 0 ? (
            <div className="">
              <Button variant={'outline'} className="mb-3" onClick={() => clearCart()}>
                Clear
              </Button>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  {' '}
                  {cartApi.map((item: Item) => {
                    return (
                      <div key={item.id} className="mb-5 rounded-2xl border">
                        <div className="grid grid-cols-1 sm:grid-cols-3">
                          <div className="rounded-2xl sm:col-span-1">
                            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                              <Image
                                src={item.product.images ?? IMAGE_PLACEHOLDER}
                                alt={item.product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col justify-center gap-4 p-3 sm:col-span-2">
                            <div className="flex justify-between">
                              <h2>{item.product.title}</h2>
                              <Button variant={'outline'} onClick={() => removeItem(item.id)}>
                                Delete
                              </Button>
                            </div>
                            <div className="flex items-center gap-5">
                              <p>Quantity:</p>
                              <div className="flex items-center gap-3">
                                <Button onClick={() => changeCart(item.quantity - 1, item.id)}>-</Button>
                                {<p>{item.quantity}</p>}
                                <Button
                                  onClick={() => {
                                    changeCart(item.quantity + 1, item.id);
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                            {item.variant != null && <h3>{item.variant.displayName}</h3>}
                            {item.variant == null && item.product.baseSalePrice == null && (
                              <h3>Price: {item.product.basePrice * item.quantity}</h3>
                            )}
                            {item.variant == null && item.product.baseSalePrice != null && (
                              <h3>Price: {item.product.baseSalePrice * item.quantity}</h3>
                            )}
                            {item.variant != null && item.variant.salePrice == null && (
                              <h3>Price: {item.variant.price * item.quantity}</h3>
                            )}
                            {item.variant != null && item.variant.salePrice != null && (
                              <h3>Price: {item.variant.salePrice * item.quantity}</h3>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}{' '}
                </div>
                <div className="col-span-1 flex flex-col p-3">
                  <h2>Summary</h2>
                  <div className="p-3">
                    <div className="flex justify-between">
                      <h3>Subtotal:</h3>
                      <h3>{Math.round((subAndTotal?.subtotal ?? 0) * 100) / 100}</h3>
                    </div>
                    <div className="flex justify-between">
                      <h3>Discount:</h3>
                      {subAndTotal?.discount != null ? (
                        <h3>{Math.round((subAndTotal?.discount ?? 0) * 100) / 100}</h3>
                      ) : (
                        <h3>0</h3>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <h3>Delivery Fee:</h3>
                      <h3>{Math.round((subAndTotal?.deliveryFee ?? 0) * 100) / 100}</h3>
                    </div>
                    <div className="mt-3 border-b-2"></div>
                    <div className="mt-5 flex justify-between">
                      <h3>Total:</h3>
                      <h3>{Math.round((subAndTotal?.total ?? 0) * 100) / 100}</h3>
                    </div>
                    <Link className="cursor-pointer" href={'/checkout'}>
                      <Button className="mt-5 w-full cursor-pointer">Checkout</Button>
                    </Link>
                    <div className="mt-10">
                      <h4 className="cursor-default text-lg text-black">Coupon Code</h4>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="text"
                          onChange={(e) => setCouponCode(e.target.value)}
                          name="coupon"
                          id="coupon"
                          className="rounded-2xl border p-4"
                          placeholder="Enter Coupon Code"
                        />
                        <Button className={`cursor-pointer rounded-2xl p-7`} onClick={() => {if(!couponCode) return; applyCoupon(couponCode)}}>
                          APPLY
                        </Button>
                      </div>
                      {couponError?.coupon !== null && subAndTotal?.discount !== 0 && (
                        <h4 className="mt-2 text-green-600">* Coupon is already applied!</h4>
                      )}
                      {couponError?.coupon == null && (
                        <h4 className="mt-2 text-red-600">{couponError?.error?.message}</h4>
                      )}
                      {couponError?.coupon != null && (
                        <h4 className="mt-2 text-green-600">* Coupon Applied Successfully</h4>
                      )}
                    </div>
                  </div>
                </div>
              </div>{' '}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-950">
              <h1>No products in your cart</h1>
              <Button className="mt-5" variant={'outline'}>
                <Link href={'//'}>SHOP NOW</Link>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {cartItems.length > 0 ? (
            <div className="">
              <Button variant={'outline'} className="mb-3" onClick={() => clearCart()}>
                Clear
              </Button>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  {' '}
                  {cartItems.map((item: ICart) => {
                    return (
                      <div key={item.id} className="mb-5 rounded-2xl border">
                        <div className="grid grid-cols-1 sm:grid-cols-3">
                          <div className="rounded-2xl sm:col-span-1">
                            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                              <Image
                                src={item.image ?? IMAGE_PLACEHOLDER}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col justify-center gap-4 p-3 sm:col-span-2">
                            <div className="flex justify-between">
                              <h2>{item.name}</h2>
                              <Button variant={'outline'} onClick={() => removeItem(item.id)}>
                                Delete
                              </Button>
                            </div>
                            <div className="flex items-center gap-5">
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
                    );
                  })}{' '}
                </div>
                <div className="col-span-1 flex flex-col p-3">
                  <h2>Summary</h2>
                  <div className="p-3">
                    <div className="flex justify-between">
                      <h3>Subtotal:</h3>
                      <h3>{subtotal}</h3>
                    </div>
                    <div className="flex justify-between">
                      <h3>Delivery Fee:</h3>
                      <h3>{cartItems[0]?.deliveryFee}</h3>
                    </div>
                    <div className="mt-3 border-b-2"></div>
                    <div className="mt-5 flex justify-between">
                      <h3>Total:</h3>
                      <h3>{subtotal + cartItems[0]?.deliveryFee}</h3>
                    </div>
                    <Button className="mt-5 w-full">
                      <Link href={'/checkout'}>Checkout</Link>
                    </Button>
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
                </div>
              </div>{' '}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-950">
              <h1>No products in your cart</h1>
              <Button className="mt-5" variant={'outline'}>
                <Link href={'//'}>SHOP NOW</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
