'use client';
import { IVendorPageBanner } from '@/app/[locale]/interface/VendorPage/vendorPageBanners';
import { IVendorPageCategory } from '@/app/[locale]/interface/VendorPage/vendorPageCategory';
import { IVendorPageCoupon } from '@/app/[locale]/interface/VendorPage/vendorPageCoupon';
import { IVendorPageProduct } from '@/app/[locale]/interface/VendorPage/vendorPageProduct';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { IVendorPageProductDiscounted } from '@/app/[locale]/interface/VendorPage/vendorPageProductsDiscounted';
import Link from 'next/link';
import FavoriteButton from '../Icons/FavouriteIcon';
import { getClass } from '@/services/ApiServices';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { IWishList } from '@/app/[locale]/interface/wishlist';
import { useRouter } from 'next/navigation';
import { showToast } from 'nextjs-toast-notify';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { useCartCount } from '@/lib/ContextAPI/cartCount';
import { Plus, X, ShoppingCart, Star, Zap, Loader2 } from 'lucide-react';
import { baseURL } from '@/app/[locale]/page';

type Categories = {
  categories: IVendorPageCategory[];
  coupons: IVendorPageCoupon[];
  banners: IVendorPageBanner[];
  discountedProduct: IVendorPageProductDiscounted[];
  id: string;
};

export default function CategoriesPageComponent({ categories, coupons, banners, discountedProduct, id }: Categories) {
  const [isSelectedCat, setIsSelectedCat] = useState(categories[0]?.id);
  const [isSelectSub, setIsSelectSub] = useState(categories[0]?.children?.[0]?.id);
  const [whichSubCat, setWhichSubCat] = useState(categories[0]?.children?.[0]?.slug);
  const [index, setIndex] = useState(0);
  const [products, setProducts] = useState<IVendorPageProduct[]>([]);
  const [copy, setCopy] = useState('');
  const [isCouponId, setIsCouponId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { token } = useAuth();
  const [saveWishList, setSaveWishList] = useState<IWishList[]>([]);
  const router = useRouter();
  const cartItem = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();
  const { setCountt } = useCartCount();
  const [quickAddProduct, setQuickAddProduct] = useState<any | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);

  const goToSection = () => {
    if (sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleCopy = async function (id: number, code: string) {
    navigator.clipboard.writeText(code);
    setIsCouponId(id);
    setTimeout(() => setIsCouponId(null), 3000);
  };

  async function addToWishList(productId: number) {
    if (!token) return;
    const body = { productId: productId };
    await getClass.addWishList(token, body);
    vendorPageProducts();
  }

  async function vendorPageProducts() {
    if (!whichSubCat) return;
    const data = await getClass.getVendorProduct(id, whichSubCat);
    console.log(data)
    if (data?.data?.products) {
      setProducts(data.data.products);
    }
  }

  function goTooSection(
    target: string,
    vSlug?: string,
    pSlug?: string,
    pVSlug?: string,
    pId?: string,
    pPSlug?: string,
    adults?: number,
    children?: number,
    checkin?: string,
    checkout?: string
  ) {
    if (target == 'vendor') {
      router.push(`/vendors/${vSlug}`);
    } else if (target == 'product') {
      router.push(`/vendors/${pVSlug}/${pSlug}`);
    } else if (target == 'property') {
      router.push(
        `/bookings/${pPSlug}?id=${pId}&checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=${children}`
      );
    }
  }

  useEffect(() => {
    async function getWishList() {
      if (!token) return;
      const data = await getClass.getWishList(token);
      if (data?.data) setSaveWishList(data.data);
    }
    getWishList();
    vendorPageProducts();
  }, [whichSubCat, id, token]);

  async function openQuickAddModal(product: any) {
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

    const sameVendor = cartItem.find((item: any) => item.vendorName != quickAddProduct.vendor.name);
    if (sameVendor) {
      showToast.error(
        'Please add products from the same vendor only. Clear the cart if you want to add from this vendor.',
        { position: 'bottom-right' }
      );
      return;
    }

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
        const getCart = await getClass.getCartItems(quickAddProduct.businessType.id, token);
        setCountt(getCart.items.length);
      } else {
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
    <>
      <div className="lg:col-span-1">
        <div className="sticky top-28 flex flex-col gap-2 rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 px-2 text-xl font-black tracking-tight text-slate-900">Categories</h3>
          {categories.map((category: IVendorPageCategory, i) => (
            <div
              key={category.id}
              onClick={() => {
                setIsSelectedCat(category.id);
                setIndex(i);
                const firstSub = category.children[0];
                if (firstSub) {
                  setIsSelectSub(firstSub.id);
                  setWhichSubCat(firstSub.slug);
                }
                goToSection();
              }}
              className={`cursor-pointer rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 ${
                isSelectedCat === category.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <h4>{category.name}</h4>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-16 lg:col-span-3">
        {/* Banner Carousel */}
        {banners.length > 0 && (
          <Carousel className="group w-full overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-900/10">
            <CarouselContent>
              {banners.map((banner: IVendorPageBanner) => {
                if (!banner.image?.url) return null;
                return (
                  <CarouselItem className="relative" key={banner.id}>
                    <Card className="overflow-hidden rounded-none border-0 bg-transparent">
                      <CardContent className="relative flex aspect-[21/9] min-h-[300px] w-full items-center justify-center p-0">
                        <Image
                          width={1000}
                          height={1000}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          src={IMAGE_PLACEHOLDER}
                          alt={banner.image?.alternativeText ?? 'Banner'}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                      </CardContent>
                    </Card>
                    <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end p-8 pb-12">
                      <h2 className="mb-6 text-center text-3xl font-black tracking-tight text-white drop-shadow-md sm:text-4xl">
                        {banner.title}
                      </h2>
                      <button
                        onClick={() =>
                          goTooSection(banner.targetType, banner.targetVendor?.slug, banner.targetProduct?.slug)
                        }
                        className="rounded-full bg-white px-10 py-4 text-sm font-black text-slate-900 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        Explore Now
                      </button>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        )}

        {/* Coupons */}
        {coupons.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon: IVendorPageCoupon) => (
              <div
                key={coupon.id}
                className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-xl shadow-purple-900/20 transition-transform hover:-translate-y-1"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black tracking-widest">{coupon.code}</span>
                    <button
                      className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-colors hover:bg-white/40"
                      onClick={() => handleCopy(coupon.id, coupon.code)}
                    >
                      <i
                        className={`fa-regular text-lg ${isCouponId === coupon.id ? 'fa-check text-green-300' : 'fa-copy'}`}
                      ></i>
                      {isCouponId === coupon.id && (
                        <span className="absolute -top-8 rounded-md bg-white/20 px-2 py-1 text-xs font-bold text-green-300">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm font-bold text-white/80">
                    <p>Max discount: {coupon.maxDiscount} EGP</p>
                    <p>Min order: {coupon.minSubtotal} EGP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sub-Categories */}
        <div ref={sectionRef} className="scroll-mt-32 space-y-6 pt-8">
          <h3 className="text-2xl font-black tracking-tight text-slate-900">Explore {categories[index]?.name}</h3>
          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-4">
            {categories[index]?.children.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => {
                  setIsSelectSub(subcategory.id);
                  setWhichSubCat(subcategory.slug);
                }}
                className={`snap-start rounded-full border-2 px-8 py-3 text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  isSelectSub === subcategory.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {products.map((product: IVendorPageProduct) => {
              const isWishlisted = saveWishList?.some((wish: IWishList) => wish.product.id === product.id);
              const wishlistItems = saveWishList?.filter((wish: IWishList) => wish.product.id === product.id);

              return (
                <div
                  key={product.id}
                  className="group flex flex-col rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5"
                >
                  <div className="relative mb-4 aspect-4/5 w-full overflow-hidden rounded-[1.5rem] bg-slate-50">
                    <Link href={`/vendors/${id}/${product.slug}`}>
                      <Image
                        width={500}
                        height={500}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={product.images?.[0]?.url ? `${baseURL}${product.images?.[0]?.url}` : IMAGE_PLACEHOLDER}
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
                  </div>
                  <div className="flex flex-1 flex-col px-2">
                    <Link href={`/vendors/${id}/${product.slug}`}>
                      <h4 className="mb-4 line-clamp-2 text-base font-black text-slate-900 transition-colors group-hover:text-blue-600">
                        {product.title}
                      </h4>
                    </Link>
                    <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                      <div className="flex flex-col items-start">
                        {product.baseSalePrice ? (
                          <>
                            <span className="text-[10px] font-bold text-slate-400 line-through">
                              {product.basePrice} EGP
                            </span>
                            <span className="text-lg font-black text-red-600">{product.baseSalePrice} EGP</span>
                          </>
                        ) : (
                          <span className="text-lg font-black text-slate-900">{product.basePrice} EGP</span>
                        )}
                      </div>

                      {/* ADD PLUS BUTTON */}
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
        </div>

        {/* Discounted Products Grid */}
        {discountedProduct.length > 0 && (
          <div className="mt-16 space-y-8 border-t border-slate-100 pt-16">
            <h3 className="flex items-center gap-3 text-3xl font-black tracking-tight text-red-600">
              <Zap className="fill-red-600" /> Special Offers
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {discountedProduct.map((discounted: any) => {
                const isWishlisted = saveWishList?.some((wish: IWishList) => wish.product.id === discounted.id);
                const wishlistItems = saveWishList?.filter((wish: IWishList) => wish.product.id === discounted.id);

                return (
                  <div
                    key={discounted.id}
                    className="group flex flex-col rounded-[2rem] border border-red-100 bg-red-50/30 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/5"
                  >
                    <div className="relative mb-4 aspect-4/5 w-full overflow-hidden rounded-[1.5rem] bg-white">
                      <Link href={`/vendors/${id}/${discounted.slug}`}>
                        <Image
                          width={500}
                          height={500}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          src={discounted.images?.[0]?.url || IMAGE_PLACEHOLDER}
                          alt={discounted.title ?? 'Discounted Product'}
                        />
                      </Link>
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-sm">
                          Sale
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <div className="rounded-full bg-white/80 shadow-sm backdrop-blur-md">
                          <FavoriteButton
                            onAdd={() => addToWishList(discounted.id)}
                            isWishlisted={isWishlisted ?? false}
                            wishlistItems={wishlistItems ?? []}
                            productId={discounted.id}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col px-2">
                      <Link href={`/vendors/${id}/${discounted.slug}`}>
                        <h4 className="mb-4 line-clamp-2 text-base font-black text-slate-900 transition-colors group-hover:text-red-600">
                          {discounted.title}
                        </h4>
                      </Link>
                      <div className="mt-auto flex items-center justify-between border-t border-red-100/50 pt-4">
                        <div className="flex flex-col items-start">
                          {discounted.baseSalePrice ? (
                            <>
                              <span className="text-[10px] font-bold text-red-400 line-through">
                                {discounted.basePrice} EGP
                              </span>
                              <span className="text-lg font-black text-red-600">{discounted.baseSalePrice} EGP</span>
                            </>
                          ) : (
                            <span className="text-lg font-black text-red-600">{discounted.basePrice} EGP</span>
                          )}
                        </div>

                        {/* ADD BUTTON */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            openQuickAddModal(discounted);
                          }}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-md transition-transform hover:scale-105 hover:bg-red-700 active:scale-95"
                        >
                          <Plus size={20} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =========================================
          Quick Add To Cart Modal (2026 Design)
          ========================================= */}
      {quickAddProduct && (
        <div className="animate-in fade-in fixed inset-0 z-[5000] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm duration-200 sm:items-center">
          <div className="animate-in slide-in-from-bottom-8 sm:zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-t-[2.5rem] bg-white shadow-2xl duration-300 sm:rounded-[2.5rem]">
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
              <div className="mb-6 flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                  <Image
                    fill
                    className="object-cover"
                    src={
                      quickAddProduct.images?.[0]?.url
                        ? `https://pyramids.devfolio.net${quickAddProduct.images[0].url}`
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
    </>
  );
}
