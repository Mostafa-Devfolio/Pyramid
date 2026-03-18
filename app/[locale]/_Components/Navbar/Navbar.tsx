'use client';
import { getLoginTo, getLogout } from '@/app/[locale]/login/login';
import { useAuth } from '@/lib/ContextAPI/authContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import React from 'react';
import Link from 'next/link';
import { getClass } from '@/services/ApiServices';
import { useCartCount } from '@/lib/ContextAPI/cartCount';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { useBusiness } from '@/lib/ContextAPI/businessTypeId';
import {
  User,
  Menu,
  X,
  ShoppingCart,
  MapPin,
  ChevronDown,
  Loader2,
  Search,
  Store,
  UtensilsCrossed,
  ShoppingBasket,
  Pill,
  ArrowRight,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from '@/lib/ContextAPI/locationContext';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/lib/image';
import { IProduct5, IVendor5 } from '@/app/[locale]/interface/search';
import { baseURL } from '@/app/[locale]/page';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LightDarkMode from '../LightDarkMode';

export default function NavBar() {
  const t = useTranslations('PRISM');
  const pathName = usePathname();
  const locale = useLocale();
  const cartItem = useSelector((state: any) => state.cart);
  const { auth, setToken, setAuth } = useAuth();
  const [isSelected, setIsSelected] = useState(-1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { addressName } = useLocation();
  const { countt, setCountt } = useCartCount();
  const { businessId, businessSlug, setBusinessSlug } = useBusiness();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchTarget, setSearchTarget] = useState<'products' | 'vendors'>('products');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResultsVendors, setSearchResultsVendors] = useState<IVendor5[] | []>([]);
  const [searchResultsProducts, setSearchResultsProducts] = useState<IProduct5[] | []>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [foundResult, setFoundResult] = useState(false);

  async function getRoute(pageNumber: number) {
    if (pageNumber == 0) router.push('/orders');
    else if (pageNumber == 1) router.push('/address');
    else if (pageNumber == 2) router.push('/loyalty');
    else if (pageNumber == 3) router.push('/wallet');
  }

  const currentContext = useMemo(() => {
    if (pathName.includes('/restaurants'))
      return { id: 'restaurants', label: t('restaurants'), icon: <UtensilsCrossed size={14} /> };
    if (pathName.includes('/groceries'))
      return { id: 'groceries', label: t('groceries'), icon: <ShoppingBasket size={14} /> };
    if (pathName.includes('/pharmacies')) return { id: 'pharmacies', label: t('pharmacies'), icon: <Pill size={14} /> };
    if (pathName.includes('/e-commerce')) return { id: 'e-commerce', label: t('ecommerce'), icon: <Store size={14} /> };
    return null;
  }, [pathName, t]);

  useEffect(() => {
    setIsMounted(true);
    if (currentContext) {
      setSearchCategory(currentContext.id);
      setBusinessSlug(currentContext.id);
    } else {
      setSearchCategory('restaurants');
      setBusinessSlug('restaurants');
    }
  }, [currentContext, setBusinessSlug]);

  useEffect(() => {
    if (isSearchOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        setFoundResult(false);
        try {
          if (businessSlug == null) return;

          if (searchTarget === 'vendors') {
            const vendors = await getClass.searchByVendors(businessSlug, searchQuery);
            setSearchResultsVendors(vendors || []);
            setSearchResultsProducts([]);
          } else {
            const products = await getClass.searchByProducts(businessSlug, searchQuery);
            setSearchResultsProducts(products || []);
            setSearchResultsVendors([]);
          }

          await new Promise((resolve) => setTimeout(resolve, 300));
          setFoundResult(true);
        } finally {
          setIsSearching(false);
        }
      } else {
        setFoundResult(false);
        setSearchResultsVendors([]);
        setSearchResultsProducts([]);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchCategory, businessSlug, searchTarget]);

  function logout() {
    getLogout();
    router.push('/');
    setAuth(false);
    setToken(null);
  }

  const menuItems = [
    { name: t('home'), url: `/${[locale]}`, index: 0 },
    { name: t('about'), url: `/${[locale]}/about`, index: 1 },
    { name: t('contact_us'), url: `/${[locale]}/contact-us`, index: 2 },
  ];

  const cartDisplayCount = auth ? countt : cartItem.length;
  const showCart = pathName !== '/' && pathName !== '/taxi' && pathName !== '/courier';

  return (
    <>
      {/* ==================== MOBILE HEADER ==================== */}
      <div className="sticky top-0 z-100 flex w-full flex-col bg-white/95 shadow-sm backdrop-blur-xl sm:hidden dark:bg-black/60">
        <div className="relative flex h-14 w-full items-center justify-between px-3">
          {/* Left Side: Search */}
          <div className="z-10 flex shrink-0 items-center">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-transform active:scale-95 dark:bg-black/60 dark:text-white"
            >
              <Search size={18} strokeWidth={2.5} />
            </button>
            <LightDarkMode />
          </div>

          <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 flex max-w-[40vw] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <h2 className="truncate text-lg font-black tracking-tighter text-slate-900 uppercase dark:text-white">
              {t('prism')}
            </h2>
          </div>

          {/* Right Side: Language & Cart */}
          <div className="z-10 flex shrink-0 items-center justify-end gap-2 pl-2">
            <LanguageSwitcher />

            <button
              onClick={() => router.push('/cart')}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 transition-transform active:scale-95 dark:bg-black/60"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4 text-slate-700 dark:text-white" />
              {cartDisplayCount > 0 && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-600 text-[10px] font-black text-white shadow-sm">
                  {cartDisplayCount}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Address Bar */}
        <div
          onClick={() => router.push('/address')}
          className="flex cursor-pointer items-center gap-2 border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 transition-colors active:bg-slate-100"
        >
          <MapPin size={16} className="shrink-0 text-blue-600" />
          <div className="min-w-0 flex-1">
            {!isMounted ? (
              <div className="mt-0.5 h-3 w-32 animate-pulse rounded-full bg-slate-200" />
            ) : !addressName ? (
              <div className="mt-0.5 flex items-center gap-1.5">
                <Loader2 size={12} className="shrink-0 animate-spin text-blue-600" />
                <span className="animate-pulse text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                  {t('locating')}
                </span>
              </div>
            ) : (
              <p className="truncate text-xs font-bold text-slate-900">{addressName}</p>
            )}
          </div>
          <ChevronDown size={14} className="shrink-0 text-slate-400" />
        </div>
      </div>

      {/* ==================== DESKTOP & TABLET HEADER ==================== */}
      <nav className="sticky top-0 z-100 hidden w-full border-b border-slate-100 bg-white/85 shadow-sm backdrop-blur-xl transition-all sm:block dark:bg-black/60">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4 lg:gap-6">
            <Link
              href="/"
              className="shrink-0 text-2xl font-black tracking-tighter text-slate-900 transition-transform hover:scale-105 dark:text-white"
            >
              {t('prism')}
            </Link>
            <div
              onClick={() => router.push('/address')}
              className="flex max-w-60 min-w-0 cursor-pointer items-center gap-2.5 rounded-full border border-slate-200/60 bg-slate-100/80 px-4 py-2 transition-colors hover:bg-slate-200"
            >
              <MapPin size={18} className="shrink-0 text-blue-600" />
              <div className="flex min-w-0 flex-col justify-center">
                <span className="mb-0.5 text-[8px] leading-none font-black tracking-widest text-slate-400 uppercase">
                  {t('deliver_to')}
                </span>
                {!isMounted ? (
                  <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
                ) : !addressName ? (
                  <div className="flex items-center gap-1">
                    <Loader2 size={10} className="shrink-0 animate-spin text-blue-600" />
                    <span className="animate-pulse text-[9px] leading-none font-bold text-blue-600">
                      {t('locating')}
                    </span>
                  </div>
                ) : (
                  <span className="truncate text-xs leading-none font-bold text-slate-900">{addressName}</span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-2 lg:flex">
            {menuItems.map((item) => (
              <Link
                key={item.index}
                href={item.url}
                className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all dark:text-white ${pathName === item.url ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {/* Desktop Language Switcher */}
            <LanguageSwitcher />
            <LightDarkMode />

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 hover:text-blue-600 dark:bg-black/60 dark:text-white"
            >
              <Search size={20} strokeWidth={2.5} />
            </button>

            {showCart && (
              <button
                onClick={() => router.push('/cart')}
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 hover:text-blue-600 dark:bg-black/60 dark:text-white"
              >
                <ShoppingCart size={20} strokeWidth={2.5} />
                {cartDisplayCount > 0 && (
                  <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-600 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
                    {cartDisplayCount}
                  </div>
                )}
              </button>
            )}

            <div className="hidden items-center gap-3 lg:flex">
              {!auth ? (
                <>
                  <Link
                    href="/login"
                    className="rounded-full px-6 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-black/60"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
                  >
                    {t('register')}
                  </Link>
                </>
              ) : (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition-all outline-none hover:scale-105">
                      <User size={20} />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu className="w-64 p-2" aria-label="User menu">
                    <DropdownItem
                      key="profile"
                      onClick={() => router.push('/profile')}
                      className="mb-2 border-b border-slate-100 pb-2"
                    >
                      <p className="font-bold text-slate-900">Signed in</p>
                      <p className="text-xs font-medium text-slate-500">Manage Account</p>
                    </DropdownItem>
                    <DropdownItem key="orders" onClick={() => getRoute(0)} className="font-bold text-slate-700">
                      {t('my_orders')}
                    </DropdownItem>
                    <DropdownItem key="address" onClick={() => getRoute(1)} className="font-bold text-slate-700">
                      {t('my_addresses')}
                    </DropdownItem>
                    <DropdownItem key="loyalty" onClick={() => getRoute(2)} className="font-bold text-slate-700">
                      {t('loyalty_points')}
                    </DropdownItem>
                    <DropdownItem key="wallet" onClick={() => getRoute(3)} className="font-bold text-slate-700">
                      {t('my_wallet')}
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      onClick={logout}
                      color="danger"
                      className="mt-2 border-t border-slate-100 pt-2 font-bold text-red-600"
                    >
                      {t('logout')}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>

            {/* Desktop Overlay Menu for Tablets */}
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Tablet Menu Overlay */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 z-90 w-full space-y-6 border-b border-gray-100 bg-white px-4 py-6 shadow-2xl lg:hidden">
                <div className="flex flex-col gap-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.index}
                      href={item.url}
                      onClick={() => {
                        setIsSelected(item.index);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full rounded-2xl p-4 text-center font-bold transition-colors ${pathName === item.url ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
                  {!auth ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          router.push('/login');
                          setIsMenuOpen(false);
                        }}
                        className="w-full rounded-full bg-slate-100 py-3.5 text-center font-bold text-slate-900"
                      >
                        {t('login')}
                      </button>
                      <button
                        onClick={() => {
                          router.push('/register');
                          setIsMenuOpen(false);
                        }}
                        className="w-full rounded-full bg-blue-600 py-3.5 text-center font-bold text-white shadow-md"
                      >
                        {t('register')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          router.push('/profile');
                          setIsMenuOpen(false);
                        }}
                        className="w-full rounded-full bg-slate-100 py-3.5 text-center font-bold text-slate-900"
                      >
                        {t('go_to_profile')}
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full rounded-full bg-red-50 py-3.5 text-center font-bold text-red-600"
                      >
                        {t('logout')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isSearchOpen && (
        <div className="animate-in fade-in fixed inset-0 z-5000 flex items-start justify-center bg-slate-900/60 pt-0 backdrop-blur-sm duration-200 sm:pt-20">
          <div className="animate-in slide-in-from-bottom-8 sm:zoom-in-95 flex h-dvh w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[85vh] sm:max-w-3xl sm:rounded-[2.5rem]">
            <div className="flex shrink-0 items-center gap-4 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-6">
              <Search size={24} className="hidden shrink-0 text-blue-600 sm:block" />
              <input
                autoFocus
                type="text"
                placeholder={currentContext ? `${t('search_in')} ${currentContext.label}...` : `${t('search_prism')}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-lg font-black text-slate-900 outline-none placeholder:text-slate-300 sm:text-2xl"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="shrink-0 border-b border-slate-100 bg-slate-50 p-2">
              <div className="flex gap-2 rounded-2xl bg-slate-100/50 p-1">
                <button
                  onClick={() => setSearchTarget('products')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-300 ${searchTarget === 'products' ? 'border border-slate-200 bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <ShoppingBasket size={16} /> {t('products')}
                </button>
                <button
                  onClick={() => setSearchTarget('vendors')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-300 ${searchTarget === 'vendors' ? 'border border-slate-200 bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Store size={16} /> {t('vendors')}
                </button>
              </div>
            </div>

            <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
              {currentContext ? (
                <div className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white">
                  {currentContext.icon} {t('searching_in')} {currentContext.label}
                </div>
              ) : (
                [
                  { id: 'restaurants', label: t('restaurants'), icon: <UtensilsCrossed size={14} /> },
                  { id: 'groceries', label: t('groceries'), icon: <ShoppingBasket size={14} /> },
                  { id: 'pharmacies', label: t('pharmacies'), icon: <Pill size={14} /> },
                  { id: 'e-commerce', label: t('ecommerce'), icon: <Store size={14} /> },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSearchCategory(cat.id);
                      setBusinessSlug(cat.id);
                    }}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all ${searchCategory === cat.id ? 'bg-blue-600 text-white shadow-md' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))
              )}
            </div>

            <div className="min-h-[50vh] flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6">
              {!searchQuery ? (
                <div className="mt-12 flex flex-col items-center justify-center gap-4 text-slate-400">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                    {searchTarget === 'products' ? <ShoppingBasket size={32} /> : <Store size={32} />}
                  </div>
                  <p className="text-center font-bold">
                    {t('type_search_for')} {searchTarget}...
                  </p>
                </div>
              ) : isSearching ? (
                <div className="mt-12 flex flex-col items-center justify-center gap-4 text-blue-600">
                  <Loader2 size={36} className="animate-spin" />
                  <p className="animate-pulse text-xs font-black tracking-widest uppercase">
                    {t('searching')} {searchTarget}...
                  </p>
                </div>
              ) : foundResult ? (
                <div className="space-y-3 pb-10">
                  {searchTarget === 'vendors' ? (
                    searchResultsVendors.length > 0 ? (
                      searchResultsVendors.map((vendor: IVendor5) => (
                        <div
                          key={vendor.id}
                          onClick={() => {
                            router.push(`/vendors/${vendor.slug}`);
                            setIsSearchOpen(false);
                          }}
                          className="group flex cursor-pointer items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-white p-3 transition-all hover:border-blue-600 hover:shadow-lg hover:shadow-blue-900/5"
                        >
                          <div className="min-w-0 flex-1 pl-2">
                            <h5 className="truncate text-lg font-black text-slate-900 transition-colors group-hover:text-blue-700">
                              {vendor.name}
                            </h5>
                          </div>
                          <ArrowRight
                            size={18}
                            className="mr-2 text-slate-300 transition-all group-hover:-translate-x-1 group-hover:text-blue-600"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="mt-12 flex flex-col items-center justify-center gap-2 text-slate-500 opacity-80">
                        <p className="text-xl font-black text-slate-900">{'no_vendors'}</p>
                      </div>
                    )
                  ) : searchResultsProducts.length > 0 ? (
                    searchResultsProducts.map((product: IProduct5) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          router.push(`/vendors/${product.vendor.slug}/${product.slug}`);
                          setIsSearchOpen(false);
                        }}
                        className="group flex cursor-pointer items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-white p-3 transition-all hover:border-blue-600 hover:shadow-lg hover:shadow-blue-900/5"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                          <Image
                            src={product.images?.[0]?.url ? `${baseURL}${product.images[0].url}` : IMAGE_PLACEHOLDER}
                            fill
                            className="object-cover"
                            alt={product.title}
                          />
                        </div>
                        <div className="min-w-0 flex-1 pr-4">
                          <h5 className="truncate font-black text-slate-900 transition-colors group-hover:text-blue-700">
                            {product.title}
                          </h5>
                          <p className="mt-0.5 truncate text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                            {product.vendor?.name}
                          </p>
                        </div>
                        <div className="mr-2 shrink-0 text-right">
                          <p className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 font-black text-slate-900">
                            {product.baseSalePrice
                              ? `${product.baseSalePrice} ${t('egp')}`
                              : `${product.basePrice} ${t('egp')}`}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="mt-12 flex flex-col items-center justify-center gap-2 text-slate-500 opacity-80">
                      <p className="text-xl font-black text-slate-900">{t('no_products')}</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
