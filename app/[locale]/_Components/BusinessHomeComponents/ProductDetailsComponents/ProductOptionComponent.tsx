'use client';
import {
  IProductDetailsPage,
  Option,
  OptionGroup,
  Variant,
} from '@/app/[locale]/interface/ProductDetailsPage/productDetailsPageInterface';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/redux/slices/cartSlice';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getClass } from '@/services/ApiServices';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { useCartCount } from '@/lib/ContextAPI/cartCount';
import { ICartItems, Item } from '@/app/[locale]/interface/Cart/cartItems';
import { useBusiness } from '@/lib/ContextAPI/businessTypeId';

type optiongroup = { products: IProductDetailsPage };

export default function ProductOptionComponent({ products }: optiongroup) {
  const cartItem = useSelector((state: any) => state.cart);
  const [errorMsg, setErrorMsg] = useState('');
  const { auth, token } = useAuth();
  const [getCar, setGetCar] = useState<ICartItems | null>(null);
  const { countt, setCountt } = useCartCount();
  const { businessId, setBusinessId } = useBusiness();

  const haveVariants = useMemo(() => {
    if (products.variants.length == 0) return null;
    return products.variants.reduce((min, variant) => {
      const minPrice = min.salePrice ?? min.price;
      const variantPrice = variant.salePrice ?? variant.price;
      return minPrice < variantPrice ? min : variant;
    });
  }, [products.variants]);
  const dispatch = useDispatch();

  const cartPrice = useMemo(() => {
    if (!token) return;
    const item = getCar?.items?.find((itemm: Item) => products.id == itemm.product.id);
    if (!item) return;
    if (item.variant) {
      const variantPrice = item.variant.salePrice ?? item.variant.price;
      return variantPrice * item.quantity;
    }
    if (!item.variant) {
      const mainPrice = item.product.baseSalePrice ?? item.product.basePrice;
      return mainPrice * item.quantity;
    }
  }, [getCar, products.id, auth, token]);

  async function getCartItems() {
    const businessIdd = products.businessType.id;
    setBusinessId(products.businessType.id);
    if (!token) return;
    const getCart = await getClass.getCartItems(businessIdd, token);
    setGetCar(getCart);
    setCountt(getCart.items.length);
  }

  async function addToCartt(productsId: number) {
    if (!token) return;
    const itemss = getCar?.items ?? [];
    const alreadyExists = itemss.some((item: Item) => item.product.id === productsId);
    if (alreadyExists) return;
    const cart = {
      businessTypeId: products.businessType.id,
      productId: products.id,
      quantity: 1,
      variantId: isSelected ?? null,
      selectedOptions: [{ groupId: haveVariants?.options[0].group.id, optionIds: [haveVariants?.options[0].id] }],
    };
    await getClass.addItemToCart(cart, token);
    getCartItems();
  }

  async function removeItem(itemId: number) {
    if (token) {
      await getClass.removeItemFromCart(itemId, token);
      setCount(0);
      getCartItems();
    }
  }

  async function changeCart(itemId: number, count: number) {
    if (!token) return;
    if (count == 0) {
      removeItem(itemId);
      getCartItems();
      return;
    }
    const cart = { cartItemId: itemId, quantity: count };
    await getClass.updateItemsInCart(cart, token);
    getCartItems();
  }

  function addItemToCart() {
    const sameVendor = cartItem.find((item: any) => item.vendorName != products.vendor.name);
    if (sameVendor) {
      setCount(0);
      setErrorMsg('Please add products from the same vendor only. Clear the cart if you want to add from this vendor.');
      toast.error('Please add products from the same vendor only. Clear the cart if you want to add from this vendor.');
      return null;
    }

    if (haveVariants) {
      dispatch(
        addToCart({
          id: products.id,
          name: products.title,
          quantity: count || 1,
          variantName: haveVariants.options.map((variant: Option) => variant.label),
          price:
            haveVariants.salePrice != 0 && haveVariants.salePrice != null ? haveVariants.salePrice : haveVariants.price,
          deliveryFee: products.vendor.deliveryFee,
          vendorName: products.vendor.name,
          businesstype: products.businessType.id,
          variantId: haveVariants.options.map((variant: Option) => variant.id),
          selectedOptions: [],
        })
      );
    } else {
      dispatch(
        addToCart({
          id: products.id,
          name: products.title,
          quantity: count || 1,
          variantName: null,
          price:
            products.baseSalePrice != null && products.baseSalePrice != 0 ? products.baseSalePrice : products.basePrice,
          deliveryFee: products.vendor.deliveryFee,
          vendorName: products.vendor.name,
          businesstype: products.businessType.id,
          variantId: null,
          selectedOptions: [],
        })
      );
    }
  }

  const [isSelected, setIsSelected] = useState<number | null>(null);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [basePrice, setBasePrice] = useState(0);
  const [stock, setStock] = useState<number>(0);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function getCartItem() {
      const businessIdd = products.businessType.id;
      setBusinessId(products.businessType.id);
      if (!token) return;
      const getCart = await getClass.getCartItems(businessIdd, token);
      setGetCar(getCart);
      setCountt(getCart.items.length);
    }
    getCartItem();
    function getReady() {
      if (!haveVariants) return;
      setIsSelected(haveVariants.id);
      setSalePrice(haveVariants.salePrice);
      setBasePrice(haveVariants.price);
      setStock(haveVariants.stock);
    }
    getReady();
  }, [haveVariants, token, products.businessType.id, setBusinessId, setCountt]);

  function decrease() {
    if ((count ?? 0) <= 0) return;
    setCount((count ?? 0) - 1);
  }
  function increase() {
    setCount((count ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Variants Selection */}
      {products.variants.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {products.variants.map((variant: Variant) => (
            <button
              key={variant.id}
              onClick={() => {
                setIsSelected((prev) => (prev == variant.id ? null : variant.id));
                setStock(variant.stock);
                setSalePrice(variant.salePrice);
                setBasePrice(variant.price);
              }}
              className={`rounded-full border-2 px-6 py-2.5 text-sm font-bold transition-all duration-300 outline-none ${
                isSelected == variant.id
                  ? 'border-black bg-black text-white shadow-md'
                  : 'border-gray-200 bg-transparent text-gray-700 hover:border-black hover:text-black'
              }`}
            >
              {variant.options.length > 0 ? variant.options?.[0]?.label : 'No Options'}
            </button>
          ))}
        </div>
      )}

      {/* Modern Price Display */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase">Price</h3>
        <div className="flex items-end gap-3">
          {salePrice != 0 || products.baseSalePrice ? (
            <>
              <span className="text-4xl font-black text-red-600 lg:text-5xl">
                {salePrice || products.baseSalePrice} EGP
              </span>
              <span className="mb-1 text-xl font-bold text-gray-400 line-through lg:text-2xl">
                {basePrice || products.basePrice} EGP
              </span>
            </>
          ) : (
            <span className="text-4xl font-black text-gray-900 lg:text-5xl">{basePrice || products.basePrice} EGP</span>
          )}
        </div>

        {/* Short Description */}
        {products.shortDescription && (
          <p className="mt-2 text-sm font-medium text-gray-600">
            <i className="fa-solid fa-check mr-2 text-green-500"></i>
            {products.shortDescription}
          </p>
        )}
      </div>

      {/* Action Row: Stock, Quantity, & Add to Cart */}
      <div className="flex flex-col gap-5 border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            In Stock: {haveVariants ? stock : products.stock}
          </span>

          {/* Dynamic Total calculation display */}
          <div className="text-right">
            {auth && cartPrice != null ? (
              <p className="text-sm font-bold text-gray-900">Total: {cartPrice} EGP</p>
            ) : (
              <p className="text-sm font-bold text-gray-900">
                Total:{' '}
                {Math.round(
                  (salePrice || products.baseSalePrice || basePrice || products.basePrice) * (count ?? 0) * 100
                ) / 100}{' '}
                EGP
              </p>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
            <i className="fa-solid fa-circle-exclamation mr-2"></i>
            {errorMsg}
          </div>
        )}

        {/* Big Add To Cart Control */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {/* Main button condition */}
          {(count == null || count == 0) && !getCar?.items?.some((ite: Item) => products.id == ite.product.id) ? (
            <button
              onClick={() => {
                setCount((count ?? 0) + 1);
                addItemToCart();
                addToCartt(products.id);
              }}
              className="w-full rounded-full bg-black py-4 text-center text-lg font-bold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 active:scale-95"
            >
              Add To Cart
            </button>
          ) : (
            <div className="flex w-full items-center justify-between gap-4 rounded-full border-2 border-gray-200 bg-white p-1 sm:w-auto">
              {/* Minus Button */}
              {auth ? (
                getCar?.items?.map(
                  (itemm: Item) =>
                    products.id == itemm.product.id && (
                      <button
                        key={itemm.id}
                        onClick={() => changeCart(itemm.id, itemm.quantity - 1)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl font-bold transition-colors hover:bg-gray-200 active:bg-gray-300"
                      >
                        -
                      </button>
                    )
                )
              ) : (
                <button
                  onClick={() => {
                    decrease();
                    addItemToCart();
                    addToCartt(products.id);
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl font-bold transition-colors hover:bg-gray-200 active:bg-gray-300"
                >
                  -
                </button>
              )}

              {/* Number Display */}
              <span className="w-8 text-center text-lg font-bold text-gray-900">
                {auth ? getCar?.items?.find((itemm: Item) => products.id == itemm.product.id)?.quantity : count}
              </span>

              {/* Plus Button */}
              {auth ? (
                getCar?.items?.map(
                  (itemm: Item) =>
                    products.id == itemm.product.id && (
                      <button
                        key={itemm.id}
                        onClick={() => changeCart(itemm.id, itemm.quantity + 1)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-xl font-bold text-white transition-colors hover:bg-gray-800 active:bg-gray-900"
                      >
                        +
                      </button>
                    )
                )
              ) : (
                <button
                  onClick={() => {
                    increase();
                    addItemToCart();
                    addToCartt(products.id);
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-xl font-bold text-white transition-colors hover:bg-gray-800 active:bg-gray-900"
                >
                  +
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
