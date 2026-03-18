'use client';

import { ICategoriesOfProducts, IProduct } from '@/app/[locale]/interface/categoriesOfProducts';
import { IWishList } from '@/app/[locale]/interface/wishlist';
import Icon from '@/components/Icon';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { getClass } from '@/services/ApiServices';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import FavoriteButton from '../../Icons/FavouriteIcon';
import { Plus, X, ShoppingCart, Star, Zap, Loader2 } from 'lucide-react';
import { showToast } from 'nextjs-toast-notify';
import { LuLayoutGrid } from 'react-icons/lu';
import { BsList } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { useCartCount } from '@/lib/ContextAPI/cartCount';

export default function SeeMoreButton({ categoriesOfProducts }: { categoriesOfProducts: ICategoriesOfProducts[] }) {
  const [visibleProducts, setVisibleProducts] = useState<Record<number, number>>({});
  const [saveWishList, setSaveWishList] = useState<IWishList[]>([]);
  const { token } = useAuth();

  const cartItem = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();
  const { setCountt } = useCartCount();
  const [isGrid, setIsGrid] = useState(true);
  const [quickAddProduct, setQuickAddProduct] = useState<any | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);

  async function addToWishList(productId: number) {
    if (!token) return;
    const body = { productId: productId };
    await getClass.addWishList(token, body);
  }

  function showMore(categoryId: number) {
    setVisibleProducts((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] ?? 4) + 4,
    }));
  }

  async function openQuickAddModal(product: IProduct) {
    setQuickAddProduct(product);
    setQuantity(1);
    setSelectedVariant(null);
    setIsLoadingVariants(true);

    try {
      const fullProduct = await getClass.productPage(product.slug);
      setQuickAddProduct(fullProduct);

      if (fullProduct.variants && fullProduct.variants.length > 0) {
        setSelectedVariant(fullProduct.variants[0]);
      }
    } catch (error) {
      console.error('Failed to fetch product variants', error);
    } finally {
      setIsLoadingVariants(false);
    }
  }

  async function handleAddToCart() {
    if (!quickAddProduct) return;

    if (quickAddProduct.variants && quickAddProduct.variants.length > 0 && !selectedVariant) {
      showToast.error('Please select a variant first.', { position: 'bottom-right' });
      return;
    }

    // const sameVendor = cartItem.find((item: any) => item.vendorName != quickAddProduct.vendor.name);
    // if (sameVendor) {
    //   showToast.error(
    //     'Please add products from the same vendor only. Clear the cart if you want to add from this vendor.',
    //     { position: 'bottom-right' }
    //   );
    //   return;
    // }

    setIsAddingToCart(true);

    try {
      if (token) {
        const cart = {
          businessTypeId: quickAddProduct.businessType.id,
          productId: quickAddProduct.id,
          quantity: quantity,
          variantId: selectedVariant?.id ?? null,
          selectedOptions:
            selectedVariant?.options?.length > 0
              ? [{ groupId: selectedVariant.options[0].group.id, optionIds: [selectedVariant.options[0].id] }]
              : [],
        };
        await getClass.addItemToCart(cart, token);

        // Update global cart count
        const getCart = await getClass.getCartItems(quickAddProduct.businessType.id, token);
        setCountt(getCart.items.length);
      } else {
        // Unauthenticated Redux Dispatch
        dispatch(
          addToCart({
            id: quickAddProduct.id,
            name: quickAddProduct.title,
            quantity: quantity,
            variantName: selectedVariant?.options?.map((opt: any) => opt.label) || null,
            price: selectedVariant
              ? selectedVariant.salePrice || selectedVariant.price
              : quickAddProduct.baseSalePrice || quickAddProduct.basePrice,
            deliveryFee: quickAddProduct.vendor.deliveryFee,
            vendorName: quickAddProduct.vendor.name,
            businesstype: quickAddProduct.businessType.id,
            variantId: selectedVariant ? [selectedVariant.id] : null,
            selectedOptions: [],
          })
        );
      }

      showToast.success('Added to cart successfully!', { position: 'bottom-right', transition: 'bounceIn' });
      setQuickAddProduct(null);
    } catch (error) {
      showToast.error('Failed to add to cart.', { position: 'bottom-right' });
    } finally {
      setIsAddingToCart(false);
    }
  }

  return (
    <div className="animate-in fade-in space-y-16 duration-500">
      {categoriesOfProducts.map((categories) => {
        const visibleCount = visibleProducts[categories.id] ?? 4;

        return (
          <div key={categories.id} className="space-y-6">
            <div className="flex items-end justify-between border-b border-slate-100 pb-4">
              <h3 className="text-2xl font-black tracking-tight text-slate-900">{categories.name}</h3>
              <button onClick={() => setIsGrid(!isGrid)}>
                {isGrid ? <BsList size={24} color="blue" /> : <LuLayoutGrid size={24} color="blue" />}
              </button>
            </div>

            <div
              className={`grid ${isGrid ? 'grid-cols-2' : 'grid-cols-1'} gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
            >
              {categories.products.slice(0, visibleCount).map((product: IProduct) => {
                const isWishlisted = saveWishList?.some((wish: IWishList) => wish.product.id === product.id);
                const wishlistItems = saveWishList?.filter((wish: IWishList) => wish.product.id === product.id);

                return (
                  <div
                    key={product.id}
                    className="group flex flex-col rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5"
                  >
                    {/* Product Image Section */}
                    <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-slate-50">
                      <Link href={`/vendors/${product.vendor.slug}/${product.slug}`}>
                        <Image
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          fill
                          src={product.images?.[0]?.url || IMAGE_PLACEHOLDER}
                          alt={product.title}
                        />
                      </Link>

                      <div className="absolute top-3 right-3 z-10">
                        <div className="rounded-full bg-white/80 shadow-sm backdrop-blur-md">
                          <FavoriteButton
                            onAdd={() => addToWishList(product.id)}
                            isWishlisted={isWishlisted ?? false}
                            wishlistItems={wishlistItems ?? []}
                            productId={product.id}
                          />
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isFlashSale && (
                          <div className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-md">
                            <Zap size={12} className="fill-white" /> Sale
                          </div>
                        )}
                        {product.isFeatured && (
                          <div className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black tracking-widest text-amber-950 uppercase shadow-md">
                            <Star size={12} className="fill-amber-950" /> {product.averageRating || 'Top'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="flex flex-1 flex-col px-2">
                      <div className="mb-1 flex items-center justify-between">
                        <Link href={`/vendors/${product.vendor.slug}`}>
                          <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-blue-600">
                            {product.vendor.name}
                          </p>
                        </Link>
                        <p className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                          <Star size={10} className="fill-amber-500" /> {product.reviewCount ?? 0}
                        </p>
                      </div>

                      <Link href={`/vendors/${product.vendor.slug}/${product.slug}`}>
                        <h4 className="mb-2 line-clamp-2 text-base leading-tight font-black text-slate-900 transition-colors hover:text-blue-600">
                          {product.title}
                        </h4>
                      </Link>

                      <p className="mb-4 text-[10px] font-bold text-slate-500">{product.brand.name}</p>

                      <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                        <div>
                          {product.baseSalePrice == null ? (
                            <h5 className="text-lg font-black text-slate-900">{product.basePrice} EGP</h5>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 line-through">
                                {product.basePrice} EGP
                              </span>
                              <h5 className="text-lg font-black text-red-600">{product.baseSalePrice} EGP</h5>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            openQuickAddModal(product);
                          }}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md transition-transform hover:scale-105 hover:bg-blue-600 active:scale-95"
                        >
                          <Plus size={20} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* See More Button */}
            {visibleCount < categories.products.length && (
              <div className="flex justify-center pt-4">
                <button
                  className="rounded-full border-2 border-slate-200 bg-white px-8 py-3 text-sm font-black text-slate-700 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white active:scale-95"
                  onClick={() => showMore(categories.id)}
                >
                  View More {categories.name}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {quickAddProduct && (
        <div className="animate-in fade-in fixed inset-0 z-[99999] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm duration-200 sm:items-center">
          <div className="animate-in slide-in-from-bottom-8 sm:zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-t-[2.5rem] bg-white shadow-2xl duration-300 sm:rounded-[2.5rem]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h3 className="text-lg font-black text-slate-900">Add to Cart</h3>
              <button
                onClick={() => setQuickAddProduct(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-slate-300"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="p-6">
              {/* Product Snippet */}
              <div className="mb-6 flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                  <Image
                    fill
                    className="object-cover"
                    src={
                      quickAddProduct.images?.[0]?.url
                        ? `https://prism.devfolio.net${quickAddProduct.images[0].url}`
                        : IMAGE_PLACEHOLDER
                    }
                    alt={quickAddProduct.title}
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="line-clamp-2 text-base font-black text-slate-900">{quickAddProduct.title}</h4>
                  <p className="mt-1 text-lg font-black text-blue-600">
                    {selectedVariant?.salePrice ||
                      selectedVariant?.price ||
                      quickAddProduct.baseSalePrice ||
                      quickAddProduct.basePrice}{' '}
                    EGP
                  </p>
                </div>
              </div>

              {isLoadingVariants ? (
                <div className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 py-6">
                  <Loader2 className="mb-2 animate-spin text-blue-600" size={24} />
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Loading options...</p>
                </div>
              ) : (
                /* Variants Selector */
                quickAddProduct.variants &&
                quickAddProduct.variants.length > 0 && (
                  <div className="mb-6 space-y-3">
                    <h5 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Select Variant</h5>
                    <div className="flex flex-wrap gap-2">
                      {quickAddProduct.variants.map((variant: any) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all ${selectedVariant?.id === variant.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'}`}
                        >
                          {variant.options?.length > 0
                            ? variant.options[0].label
                            : variant.displayName || variant.name || 'Option'}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* Quantity Selector */}
              <div className="mb-8 flex items-center justify-between border-t border-slate-100 pt-6">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Quantity</span>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-slate-600 shadow-sm transition-colors hover:text-blue-600"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-lg font-black text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-slate-600 shadow-sm transition-colors hover:text-blue-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || isLoadingVariants}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-5 text-lg font-black text-white shadow-xl shadow-slate-900/20 transition-transform hover:scale-[1.02] active:scale-95 disabled:scale-100 disabled:bg-slate-300"
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'} <ShoppingCart size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
