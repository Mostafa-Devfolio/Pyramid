'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ICart } from '../interface/Cart/cart';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/redux/slices/cartSlice';
import Link from 'next/link';
import { getClass } from '@/services/ApiServices';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { useCartCount } from '@/lib/ContextAPI/cartCount';
import { ICartItems, Item } from '../interface/Cart/cartItems';
import { ICoupon } from '../interface/coupon';
import { useBusiness } from '@/lib/ContextAPI/businessTypeId';
import { Trash2, ShoppingBag, Tag, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CouponErrorResponse {
  error?: {
    message?: string;
  };
  coupon?: null;
}

type CouponResponse = ICoupon | CouponErrorResponse;

export default function CartPage() {
  const t = useTranslations('PRISM');
  const cartItems = useSelector((state: any) => state.cart);
  const [businessIdd, setBusinessId] = useState(cartItems.businessType);
  const { auth, token } = useAuth();
  const [cartApi, setCartApi] = useState<Item[]>([]);
  const [subAndTotal, setSubAndTotal] = useState<ICartItems | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<CouponResponse | null>(null);
  const { countt, setCountt } = useCartCount();
  const { businessId } = useBusiness();

  const dispatch = useDispatch();
  const subtotal = cartItems.reduce((total: number, item: ICart) => total + item.price * item.quantity, 0);

  async function getCart() {
    if (!token) return;
    if (businessId === null) return;
    setBusinessId(cartItems.businessType);
    const getCart = await getClass.getCartItems(businessId, token);
    const getItems = getCart.items;
    setCartApi(getItems);
    setSubAndTotal(getCart);
  }

  async function removeItem(itemId: number) {
    if (token) {
      await getClass.removeItemFromCart(itemId, token);
      getCart();
    } else {
      dispatch(removeFromCart(itemId));
    }
  }

  async function changeCart(itemQuantity: number, itemId: number) {
    if (!token) return;
    const cart = { cartItemId: itemId, quantity: itemQuantity };
    await getClass.updateItemsInCart(cart, token);
    getCart();
  }

  async function applyCoupon(couponData: string) {
    if (!token) return;
    const coupon = { businessTypeId: cartApi[0].product.businessType.id, code: couponData };
    const data = await getClass.applyCoupon(coupon, token);
    setCouponError(data.data);
    getCart();
  }

  async function clearCart() {
    if (!token) return;
    const clear = { businessTypeId: cartApi[0].product.businessType.id };
    await getClass.clearCart(clear, token);
    setCountt(0);
    getCart();
  }

  function decrease(itemId: number) {
    dispatch(decreaseQuantity(itemId));
  }

  async function decreaseQty(itemId: number) {
    if (!token) return;
    await getClass.cartUpdate(itemId, token);
  }

  function increase(itemId: number) {
    dispatch(increaseQuantity(itemId));
  }

  useEffect(() => {
    async function getCarts() {
      if (!token) return;
      if (businessId === null) return;
      setBusinessId(cartItems.businessType);
      const getCart = await getClass.getCartItems(businessId, token);
      const getItems = getCart.items;
      setCartApi(getItems);
      setSubAndTotal(getCart);
    }
    setBusinessId(cartItems.businessType);
    getCarts();
  }, [businessId, token, cartItems.businessType]);

  const EmptyCartView = () => (
    <div className="animate-in fade-in zoom-in-95 flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-gray-200 bg-gray-50/50 py-24 text-center duration-500">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white text-gray-300 shadow-lg">
        <ShoppingBag size={40} />
      </div>
      <h2 className="mb-3 text-3xl font-black tracking-tight text-gray-900">{t('cart_empty')}</h2>
      <p className="mb-8 max-w-sm font-medium text-gray-500">{t('add_something')}</p>
      <Link
        href={'/'}
        className="rounded-full bg-black px-10 py-4 font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        {t('start_shopping')}
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{t('your_cart')}</h1>
            <p className="mt-2 font-medium text-gray-500">{t('review_items')}</p>
          </div>
          {((auth && cartApi.length > 0) || (!auth && cartItems.length > 0)) && (
            <button
              onClick={clearCart}
              className="w-fit rounded-full bg-red-50 px-6 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-100 hover:text-red-700"
            >
              Clear Cart
            </button>
          )}
        </div>

        {auth ? (
          /* ==================== AUTHENTICATED CART ==================== */
          <div>
            {cartApi.length > 0 ? (
              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                {/* Items List */}
                <div className="space-y-4 lg:col-span-8">
                  {cartApi.map((item: Item) => (
                    <div
                      key={item.id}
                      className="group flex flex-col gap-6 rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-xl sm:flex-row"
                    >
                      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-gray-50 sm:w-36">
                        <Image
                          src={
                            item.product?.images?.[0]?.url
                              ? `https://pyramids.devfolio.net${item.product?.images?.[0]?.url}`
                              : IMAGE_PLACEHOLDER
                          }
                          alt={item.product.title ?? 'Product'}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg leading-tight font-black text-gray-900">{item.product.title}</h3>
                            {/* VENDOR NAME */}
                            {item.product.vendor?.name && (
                              <p className="mt-0.5 text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                                {item.product.vendor.name}
                              </p>
                            )}
                            {item.variant != null && (
                              <p className="mt-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                                {item.variant.displayName}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                          <div className="flex items-center gap-4 rounded-full border border-gray-200 bg-white px-1.5 py-1 shadow-sm">
                            <button
                              onClick={() => changeCart(item.quantity - 1, item.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 font-bold text-gray-600 transition-colors hover:bg-gray-200 active:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => changeCart(item.quantity + 1, item.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-black font-bold text-white transition-colors hover:bg-gray-800 active:bg-gray-900"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            {item.variant == null && item.product.baseSalePrice == null && (
                              <h4 className="text-xl font-black text-gray-900">
                                {item.product.basePrice * item.quantity} EGP
                              </h4>
                            )}
                            {item.variant == null && item.product.baseSalePrice != null && (
                              <h4 className="text-xl font-black text-red-600">
                                {item.product.baseSalePrice * item.quantity} EGP
                              </h4>
                            )}
                            {item.variant != null && item.variant.salePrice == null && (
                              <h4 className="text-xl font-black text-gray-900">
                                {item.variant.price * item.quantity} EGP
                              </h4>
                            )}
                            {item.variant != null && item.variant.salePrice != null && (
                              <h4 className="text-xl font-black text-red-600">
                                {item.variant.salePrice * item.quantity} EGP
                              </h4>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary (Sticky Sidebar) */}
                <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
                  <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50">
                    <h2 className="mb-6 border-b border-gray-100 pb-4 text-xl font-black tracking-tight text-gray-900">
                      Summary
                    </h2>

                    <div className="mb-6 space-y-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold text-gray-900">
                          {Math.round((subAndTotal?.subtotal ?? 0) * 100) / 100} EGP
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <span
                          className={subAndTotal?.discount ? 'font-bold text-green-600' : 'font-bold text-gray-900'}
                        >
                          {subAndTotal?.discount != null
                            ? `-${Math.round((subAndTotal?.discount ?? 0) * 100) / 100}`
                            : '0'}{' '}
                          EGP
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Delivery Fee</span>
                        <span className="font-bold text-gray-900">
                          {Math.round((subAndTotal?.deliveryFee ?? 0) * 100) / 100} EGP
                        </span>
                      </div>
                    </div>

                    <div className="mb-8 border-t border-gray-100 pt-6">
                      <div className="flex items-end justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-black text-blue-600">
                          {Math.round((subAndTotal?.total ?? 0) * 100) / 100} EGP
                        </span>
                      </div>
                    </div>

                    <Link href={'/checkout'} className="block w-full">
                      <button className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-5 text-lg font-black text-white shadow-xl shadow-black/20 transition-all hover:scale-[1.02] active:scale-95">
                        Checkout <ArrowRight size={20} />
                      </button>
                    </Link>

                    {/* Promo Code Section */}
                    <div className="mt-8 border-t border-gray-100 pt-6">
                      <h4 className="mb-3 text-xs font-black tracking-widest text-gray-400 uppercase">Promo Code</h4>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag size={16} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pr-4 pl-11 text-sm font-bold transition-all outline-none focus:border-black focus:ring-1 focus:ring-black"
                            placeholder="Enter code"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (couponCode) applyCoupon(couponCode);
                          }}
                          className="shrink-0 rounded-2xl bg-black px-6 py-3.5 text-sm font-bold text-white transition-transform active:scale-95"
                        >
                          Apply
                        </button>
                      </div>

                      <div className="mt-3 text-xs font-bold">
                        {couponError?.coupon !== null && subAndTotal?.discount !== 0 && (
                          <p className="flex items-center gap-1.5 text-green-600">
                            <CheckCircle2 size={14} /> Coupon is already applied!
                          </p>
                        )}
                        {couponError?.coupon == null && couponError?.error?.message && (
                          <p className="flex items-center gap-1.5 text-red-500">
                            <AlertCircle size={14} /> {couponError.error.message}
                          </p>
                        )}
                        {couponError?.coupon != null && subAndTotal?.discount === 0 && (
                          <p className="flex items-center gap-1.5 text-green-600">
                            <CheckCircle2 size={14} /> Coupon Applied Successfully
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            ) : (
              <EmptyCartView />
            )}
          </div>
        ) : (
          /* ==================== UNAUTHENTICATED CART (REDUX) ==================== */
          <div>
            {cartItems.length > 0 ? (
              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-8">
                  {cartItems.map((item: ICart) => (
                    <div
                      key={item.id}
                      className="group flex flex-col gap-6 rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-xl sm:flex-row"
                    >
                      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-gray-50 sm:w-36">
                        <Image
                          src={item.image ?? IMAGE_PLACEHOLDER}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg leading-tight font-black text-gray-900">{item.name}</h3>
                            {/* VENDOR NAME */}
                            {/* {item.vendorName && (
                              <p className="mt-0.5 text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                                {item.vendorName}
                              </p>
                            )} */}
                            {item.variantName && (
                              <p className="mt-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                                {item.variantName}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                          <div className="flex items-center gap-4 rounded-full border border-gray-200 bg-white px-1.5 py-1 shadow-sm">
                            <button
                              onClick={() => decrease(item.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 font-bold text-gray-600 transition-colors hover:bg-gray-200 active:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => increase(item.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-black font-bold text-white transition-colors hover:bg-gray-800 active:bg-gray-900"
                            >
                              +
                            </button>
                          </div>

                          <h4 className="text-xl font-black text-gray-900">{item.price * item.quantity} EGP</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Unauthenticated Summary */}
                <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
                  <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50">
                    <h2 className="mb-6 border-b border-gray-100 pb-4 text-xl font-black tracking-tight text-gray-900">
                      Summary
                    </h2>

                    <div className="mb-6 space-y-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold text-gray-900">{subtotal} EGP</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Delivery Fee</span>
                        <span className="font-bold text-gray-900">{cartItems[0]?.deliveryFee ?? 0} EGP</span>
                      </div>
                    </div>

                    <div className="mb-8 border-t border-gray-100 pt-6">
                      <div className="flex items-end justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-black text-blue-600">
                          {subtotal + (cartItems[0]?.deliveryFee ?? 0)} EGP
                        </span>
                      </div>
                    </div>

                    <Link href={'/checkout'} className="block w-full">
                      <button className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-5 text-lg font-black text-white shadow-xl shadow-black/20 transition-all hover:scale-[1.02] active:scale-95">
                        Checkout <ArrowRight size={20} />
                      </button>
                    </Link>
                    <p className="mt-4 text-center text-xs font-bold text-gray-400">Log in to apply promo codes.</p>
                  </div>
                </aside>
              </div>
            ) : (
              <EmptyCartView />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
